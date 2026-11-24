"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  slug: string;
  quantity: number;
};

type StoreState = {
  cart: CartLine[];
  wishlist: string[];
  addToCart: (slug: string, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  addToWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  moveToCart: (slug: string) => void;
};

const MAX_QUANTITY = 99;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (slug, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((line) => line.slug === slug);
          if (existing) {
            return {
              cart: state.cart.map((line) =>
                line.slug === slug
                  ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) }
                  : line,
              ),
            };
          }
          return {
            cart: [...state.cart, { slug, quantity: Math.min(MAX_QUANTITY, quantity) }],
          };
        }),

      removeFromCart: (slug) =>
        set((state) => ({ cart: state.cart.filter((line) => line.slug !== slug) })),

      setQuantity: (slug, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((line) => line.slug !== slug)
              : state.cart.map((line) =>
                  line.slug === slug
                    ? { ...line, quantity: Math.min(MAX_QUANTITY, quantity) }
                    : line,
                ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (slug) => {
        const { wishlist } = get();
        set({
          wishlist: wishlist.includes(slug)
            ? wishlist.filter((item) => item !== slug)
            : [...wishlist, slug],
        });
      },

      addToWishlist: (slug) =>
        set((state) => ({
          wishlist: state.wishlist.includes(slug) ? state.wishlist : [...state.wishlist, slug],
        })),

      removeFromWishlist: (slug) =>
        set((state) => ({ wishlist: state.wishlist.filter((item) => item !== slug) })),

      moveToCart: (slug) => {
        const { cart, wishlist } = get();
        const already = cart.some((line) => line.slug === slug);
        set({
          wishlist: wishlist.filter((item) => item !== slug),
          cart: already ? cart : [...cart, { slug, quantity: 1 }],
        });
      },
    }),
    {
      name: "ecd-world-store",
      version: 1,
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    },
  ),
);
