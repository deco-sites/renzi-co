import { useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { useCart } from "apps/shopify/hooks/useCart.ts";
import { useUI } from "$store/sdk/useUI.ts";

interface Options {
  skuId: string;
  sellerId?: string;
}

export const useAddToCart = ({ skuId, sellerId }: Options) => {
  const isAddingToCart = useSignal(false);
  const { displayCart } = useUI();
  const { addItems, loading } = useCart();

  const onClick = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sellerId) {
      return;
    }

    try {
      isAddingToCart.value = true;

      await addItems({
        lines: {
          merchandiseId: skuId,
        },
      });

      displayCart.value = true;
    } finally {
      isAddingToCart.value = false;
    }
  }, [skuId, sellerId]);

  return { onClick, disabled: loading.value, loading: isAddingToCart.value };
};