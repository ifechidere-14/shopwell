import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

type IncomingLine = { id: string; quantity: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, email, phone, address, promoCode, paymentMethod, lines } = body as {
      customerName?: string;
      email?: string;
      phone?: string;
      address?: string;
      promoCode?: string;
      paymentMethod?: string;
      lines?: IncomingLine[];
    };

    if (!customerName || !email || !address || !Array.isArray(lines) || lines.length === 0)
      return Response.json({ error: "Missing order details" }, { status: 400 });

    // Fetch current prices from the DB — never trust client prices
    const ids = lines.map((l) => l.id);
    const { rows: products } = await pool.query<{
      id: string; price: string; name: string; stock: number;
    }>(`SELECT id, price, name, stock FROM products WHERE id = ANY($1::uuid[])`, [ids]);
    if (products.length === 0)
      return Response.json({ error: "No valid products in order" }, { status: 400 });

    let total = 0;
    const priced = lines
      .map((l) => {
        const p = products.find((p) => p.id === l.id);
        if (!p) return null;
        const qty = Math.max(1, Math.floor(l.quantity));
        if (qty > p.stock) return null;
        total += Number(p.price) * qty;
        return { product_id: p.id, quantity: qty, unit_price: p.price };
      })
      .filter(Boolean) as { product_id: string; quantity: number; unit_price: string }[];
    if (priced.length !== lines.length)
      return Response.json({ error: "One or more products do not have enough stock" }, { status: 409 });

    const user = await getSessionUser();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      let discount = 0;
      let validPromo: string | null = null;
      if (promoCode) {
        const { rows: promos } = await client.query<{ code: string; discount_percent: number | null; discount_amount: string | null }>(
          `SELECT code, discount_percent, discount_amount FROM promo_codes WHERE UPPER(code) = UPPER($1) AND active = TRUE AND (expires_at IS NULL OR expires_at > now()) AND minimum_order <= $2`, [String(promoCode).trim(), total]
        );
        const promo = promos[0];
        if (promo) {
          discount = promo.discount_percent ? total * promo.discount_percent / 100 : Number(promo.discount_amount ?? 0);
          discount = Math.min(total, discount);
          validPromo = promo.code;
        }
      }
      const finalTotal = total - discount;
      const { rows: orderRows } = await client.query<{ id: string }>(
        `INSERT INTO orders (user_id, customer_name, email, phone, address, total, discount, promo_code, payment_method)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [user?.id ?? null, customerName, email, phone ?? null, address, finalTotal, discount, validPromo, paymentMethod === "paystack" ? "paystack" : "cash_on_delivery"]
      );
      const orderId = orderRows[0].id;
      for (const item of priced) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, item.unit_price]
        );
        await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [item.quantity, item.product_id]);
      }
      await client.query("COMMIT");
      return Response.json({ orderId, total: finalTotal, discount });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Checkout failed" }, { status: 500 });
  }
}