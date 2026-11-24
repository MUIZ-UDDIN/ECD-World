import { useEffect, useState } from "react";

/**
 * True once the component has mounted on the client.
 * Used to avoid rendering persisted cart/wishlist counts during SSR.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
