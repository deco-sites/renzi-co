import { Product } from "apps/commerce/types.ts";
import ScrollButtonFloating from "$store/components/ui/ScrollButtonFloating.tsx";
import { useEffect } from "preact/compat";

interface Props {
  product: Product;
}

function ProductButtonFloatingText({ product }: Props) {
  const { isVariantOf } = product;

  useEffect(() => {
    ScrollButtonFloating();
  },[]);

  return (
    <>
      <div class="floating__text max-w-[140px]">
        <span class="text-white text-xs">
          {isVariantOf?.name}
        </span>
      </div>
    </>
  );
}

export default ProductButtonFloatingText;