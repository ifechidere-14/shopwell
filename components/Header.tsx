"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-[#1d1c1a] text-[#f4f1eb] text-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <span className="hidden sm:inline tracking-wide">Complimentary delivery on orders above ₦50,000</span>
          <span className="sm:hidden tracking-wide">Nigeria · NGN</span>
          <div className="flex items-center gap-4">
            <Link href="/help" className="hover:text-green-400">Help Center</Link>
            <Link href="/contact" className="hover:text-green-400">Contact Us</Link>
            <span>Nigeria · NGN · EN</span>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#f4f1eb]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight text-[var(--ink)]">
            Lord<span className="text-brand">Temps</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.12em] md:flex">
            <Link href="/" className="hover:text-brand">Home</Link>
            <Link href="/shop" className="hover:text-brand">Collection</Link>
            <Link href="/deals" className="hover:text-brand">Offers</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Bag{count > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link href="/account" className="hidden border border-[var(--line)] px-4 py-2 text-sm font-semibold hover:border-[var(--ink)] md:block">
              Account
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="rounded p-2 md:hidden"
            >
              ☰
            </button>
          </div>
        </nav>
        {open && (
          <div className="border-t border-neutral-200 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3 font-medium">
              <Link href="/" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
              <Link href="/deals" onClick={() => setOpen(false)}>Deals</Link>
              <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}