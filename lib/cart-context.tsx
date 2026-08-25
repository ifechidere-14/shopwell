"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lordtempsmart-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        queueMicrotask(() => setLines(JSON.parse(raw)));
      }
    } catch {
      /* ignore */
    }
    queueMicrotask(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    return {
      lines,
      count,
      total,
      add: (line, qty = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.id === line.id);
          if (existing)
            return prev.map((l) =>
              l.id === line.id ? { ...l, quantity: l.quantity + qty } : l
            );
          return [...prev, { ...line, quantity: qty }];
        }),
      remove: (id) => setLines((prev) => prev.filter((l) => l.id !== id)),
      setQuantity: (id, qty) =>
        setLines((prev) =>
          prev
            .map((l) => (l.id === id ? { ...l, quantity: Math.max(0, qty) } : l))
            .filter((l) => l.quantity > 0)
        ),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function formatNaira(value: number | string): string {
  return `₦${Number(value).toLocaleString("en-NG")}`;
}