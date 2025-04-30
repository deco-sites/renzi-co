import { Product } from "apps/commerce/types.ts";
import { computed } from "@preact/signals";
import { gridColsSignal } from "$store/components/search/SearchResultsGridChoice.tsx";
import ProductCard from "./ProductCard.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";

export interface Props {
  products: Product[] | null;
  /**
   * @description Flags, exibidos quando os produtos são encontrados
   */
  highlights?: HighLight[];
}

function ProductGallery({ products, highlights }: Props) {
  const gridCols = computed(() => gridColsSignal.value);
  return (
    <div class={`column-selector__container grid grid-cols-${gridCols.value.mobile} gap-2 items-center lg:grid-cols-${gridCols.value.desktop} lg:gap-[30px]`}>
      {products?.map((product, index) => (
        <ProductCard
          product={product}
          preload={index === 0}
          layout={{
            discount: { label: "OFF", variant: "emphasis" },
            hide: { skuSelector: true, productDescription: true },
            basics: { contentAlignment: "Center" },
          }}
          highlights={highlights}
        />
      ))}
    </div>
  );
}

export default ProductGallery;