import Button from "$store/components/ui/Button.tsx";
import { useAddToCart } from "$store/sdk/useAddToCart.ts";
import Icon from "$store/components/ui/Icon.tsx";

interface Props {
  skuId: string;
  sellerId: string;
  classes?: string;
  label?: string;
}

function AddToCartButton({ skuId, sellerId, classes, label }: Props) {
  const props = useAddToCart({
    skuId,
    sellerId,
  });

  return (
    <Button data-deco="add-to-cart" {...props} class={classes}>
      <p class="flex gap-2 items-center justify-center">
        <Icon id="ShoppingCart" width={20} height={20} />
        <span class="lg:hidden">{label ?? "Comprar"}</span>
        <span class="hidden lg:inline">{label ?? "Adicionar ao carrinho"}</span>
      </p>
    </Button>
  );
}

export default AddToCartButton;
