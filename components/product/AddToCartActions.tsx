import QuantitySelector from "$store/components/ui/QuantitySelector.tsx";
import { useState } from "preact/hooks";
import AddToCartButton from "$store/islands/AddToCartButton.tsx";
import { useUI } from "$store/sdk/useUI.ts";

type Props = {
  productID: string;
  seller: string;
  price?: number;
  listPrice?: number;
  productName: string;
  productGroupID: string;
};

export default function AddToCartActions(
  { productID, seller, price, listPrice, productName, productGroupID }: Props,
) {
  const [quantity, setQuantity] = useState(1);
  const { productQuantity } = useUI();

  return (
    <div class="flex w-full gap-[30px]">
      <QuantitySelector
        quantity={quantity}
        onChange={(_quantity) => {
          setQuantity(_quantity);
          productQuantity.value = _quantity
        }}
      />
      <AddToCartButton
        skuId={productID}
        sellerId={seller}
        price={price ?? 0}
        discount={price && listPrice ? listPrice - price : 0}
        name={productName}
        productGroupId={productGroupID}
        quantity={quantity}
        classes="btn btn-primary btn-block transition-all max-w-sm hover:text-neutral-100 font-medium text-secondary-focus"
      />
    </div>
  );
}