import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { pool, formatNaira } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");
  const { rows: orders } = await pool.query(`SELECT o.id, o.total, o.status, o.payment_status, o.created_at, STRING_AGG(p.name || ' x' || oi.quantity, ', ') AS items FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN products p ON p.id = oi.product_id WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`, [user.id]);
  const { rows: saved } = await pool.query(`SELECT p.id, p.name, p.price FROM wishlists w JOIN products p ON p.id = w.product_id WHERE w.user_id = $1 ORDER BY w.created_at DESC`, [user.id]);
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">My account</h1>
      <p className="mt-2 text-neutral-500">{user.full_name} · {user.email}</p>
      <section className="mt-8">
        <h2 className="text-xl font-bold">Order history</h2>
        {orders.length === 0 ? <p className="mt-3 text-neutral-500">No orders yet. <Link href="/shop" className="text-brand-dark underline">Start shopping</Link></p> : <div className="mt-4 space-y-3">{orders.map((order) => <div key={order.id} className="rounded-xl border border-neutral-200 p-4"><div className="flex flex-wrap justify-between gap-2"><strong>#{order.id.slice(0, 8)}</strong><span className="font-semibold text-brand-dark">{formatNaira(order.total)}</span></div><p className="mt-1 text-sm text-neutral-600">{order.items || "No items"}</p><p className="mt-2 text-sm"><span className="font-semibold capitalize">{order.status}</span> · payment {order.payment_status} · {new Date(order.created_at).toLocaleDateString("en-NG")}</p></div>)}</div>}
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-bold">Saved items</h2>
        {saved.length === 0 ? <p className="mt-3 text-neutral-500">Your wishlist is empty.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-3">{saved.map((item) => <Link key={item.id} href={`/shop/${item.id}`} className="rounded-xl border border-neutral-200 p-4 hover:border-brand"><p className="font-semibold">{item.name}</p><p className="mt-1 text-brand-dark">{formatNaira(item.price)}</p></Link>)}</div>}
      </section>
    </div>
  );
}
