export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-4 text-neutral-600">
        Questions about an order or a product? Reach us anytime:
      </p>
      <ul className="mt-6 space-y-3 text-lg">
        <li>💬 WhatsApp: +234 800 000 0000</li>
        <li>📧 Email: support@lordtempsmart.com</li>
        <li>📍 Lagos, Nigeria</li>
      </ul>
      <p className="mt-8 rounded-xl bg-brand-light p-6 text-sm text-neutral-700">
        We typically respond within a few hours, Monday – Saturday, 8am – 7pm (WAT).
      </p>
    </div>
  );
}