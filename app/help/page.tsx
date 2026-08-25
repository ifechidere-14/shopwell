import Link from "next/link";

const faqs = [
  ["How do I order?", "Browse the shop, add items to your cart, then fill in your delivery details at checkout. You will get an order reference instantly."],
  ["What is the delivery fee?", "Delivery is free on all orders above ₦50,000. Below that, standard delivery fees apply based on your location."],
  ["How long does delivery take?", "Orders within Lagos arrive in 1–2 business days; other states take 2–5 business days."],
  ["Can I return a product?", "Yes — unopened products can be returned within 7 days of delivery. Contact us to arrange a pickup."],
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Help Center</h1>
      <div className="mt-8 space-y-4">
        {faqs.map(([q, a]) => (
          <details key={q} className="rounded-xl border border-neutral-200 p-5">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-3 text-neutral-600">{a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8">
        Still need help? <Link href="/contact" className="font-semibold text-brand-dark hover:underline">Contact Us</Link>
      </p>
    </div>
  );
}