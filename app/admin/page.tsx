import { pool, formatNaira } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/AdminLogin";
import { LogoutButton, StatusSelect } from "@/components/AdminControls";
import AdminProductManager from "@/components/AdminProductManager";
import RefundButton from "@/components/RefundButton";
import AdminInventory from "@/components/AdminInventory";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — LordTempsMart" };

type Stats = {
  total_orders: string;
  pending_orders: string;
  revenue: string;
  users: string;
  products: string;
  today_orders: string;
  week_revenue: string;
};

type RecentOrder = {
  id: string;
  customer_name: string;
  email: string;
  address: string;
  total: string;
  status: string;
  created_at: string;
  items: string;
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) return <AdminLoginForm />;

  // Fetch dashboard data defensively so a transient DB/pooler hiccup
  // (e.g. Retool cold start / DNS) falls back to a friendly banner
  // instead of crashing the whole page with a 500.
  const emptyStats: Stats = {
    total_orders: "0",
    pending_orders: "0",
    revenue: "0",
    users: "0",
    products: "0",
    today_orders: "0",
    week_revenue: "0",
  };

  let stats = emptyStats;
  let byCategory: { category: string; sold: string; revenue: string }[] = [];
  let topProducts: { name: string; sold: string; revenue: string }[] = [];
  let recentOrders: RecentOrder[] = [];
  let dbError: string | null = null;

  try {
    const [s, cat, top, recent] = await Promise.all([
      pool.query<Stats>(
        `SELECT
          (SELECT COUNT(*) FROM orders) AS total_orders,
          (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
          (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'cancelled') AS revenue,
          (SELECT COUNT(*) FROM users) AS users,
          (SELECT COUNT(*) FROM products) AS products,
          (SELECT COUNT(*) FROM orders WHERE created_at >= now() - INTERVAL '24 hours') AS today_orders,
          (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'cancelled' AND created_at >= now() - INTERVAL '7 days') AS week_revenue`
      ).then((r) => r.rows[0]),
      pool
        .query<{ category: string; sold: string; revenue: string }>(`
        SELECT c.name AS category, SUM(oi.quantity)::INT AS sold, SUM(oi.quantity * oi.unit_price) AS revenue
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        JOIN categories c ON c.id = p.category_id
        GROUP BY c.name ORDER BY c.name
      `)
        .then((r) => r.rows),
      pool
        .query<{ name: string; sold: string; revenue: string }>(`
          SELECT p.name, SUM(oi.quantity)::INT AS sold, SUM(oi.quantity * oi.unit_price) AS revenue
          FROM order_items oi JOIN products p ON p.id = oi.product_id
          GROUP BY p.name ORDER BY sold DESC LIMIT 5
        `)
        .then((r) => r.rows),
      pool
        .query<RecentOrder>(`
          SELECT o.*, (
            SELECT STRING_AGG(p.name || ' ×' || oi.quantity, ', ')
            FROM order_items oi JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = o.id
          ) AS items
          FROM orders o ORDER BY o.created_at DESC LIMIT 15
        `)
        .then((r) => r.rows),
    ]);
    stats = s ?? emptyStats;
    byCategory = cat;
    topProducts = top;
    recentOrders = recent;
  } catch (e) {
    dbError =
      "Could not reach the database. The connection may be warming up — refresh in a few seconds.";
    console.error("Admin DB error:", e);
  }

  const cards: [string, string, string][] = [
    ["💰 Total Revenue", formatNaira(stats.revenue), `${formatNaira(stats.week_revenue)} in the last 7 days`],
    ["📦 Orders", String(stats.total_orders), `${stats.pending_orders} pending · ${stats.today_orders} today`],
    ["👥 Registered Users", String(stats.users), "customer accounts"],
    ["🛍️ Products", String(stats.products), "live on the storefront"],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>
          <p className="text-neutral-500">LordTempsMart usage &amp; order management</p>
        </div>
        <LogoutButton />
      </div>

      {dbError && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <span>⚠️</span>
          <div>
            <p className="font-semibold">Dashboard data temporarily unavailable</p>
            <p>{dbError}</p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([title, value, sub]) => (
          <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="mt-2 text-2xl font-bold text-brand-dark">{value}</p>
            <p className="mt-1 text-xs text-neutral-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* Sales breakdown */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-bold">Sales by Category</h2>
          {byCategory.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">No sales yet.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead><tr className="text-left text-neutral-500"><th className="pb-2">Category</th><th>Units sold</th><th className="text-right">Revenue</th></tr></thead>
              <tbody>
                {byCategory.map((c) => (
                  <tr key={c.category} className="border-t border-neutral-100">
                    <td className="py-2 font-semibold">{c.category}</td>
                    <td>{c.sold}</td>
                    <td className="text-right text-brand-dark">{formatNaira(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-bold">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">No sales yet.</p>
          ) : (
            <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm">
              {topProducts.map((p) => (
                <li key={p.name}>
                  {p.name} — <span className="text-neutral-500">{p.sold} sold · {formatNaira(p.revenue)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-8 rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-bold">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-neutral-500">
                  <th className="pb-2">Date</th><th>Customer</th><th>Items</th>
                  <th>Total</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-neutral-100 align-top">
                    <td className="py-3 whitespace-nowrap">{new Date(o.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td>
                      <p className="font-semibold">{o.customer_name}</p>
                      <p className="text-xs text-neutral-500">{o.email}</p>
                      <p className="text-xs text-neutral-400">{o.address}</p>
                    </td>
                    <td className="max-w-[220px] text-xs text-neutral-600">{o.items}</td>
                    <td className="whitespace-nowrap font-bold text-brand-dark">{formatNaira(o.total)}</td>
                    <td><StatusSelect orderId={o.id} current={o.status} /><div className="mt-2"><RefundButton orderId={o.id} total={o.total} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AdminProductManager />
      <AdminInventory />
    </div>
  );
}