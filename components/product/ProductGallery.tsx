import { Product } from "apps/commerce/types.ts";
import { computed } from "@preact/signals";
import { gridColsSignal } from "$store/components/search/SearchResultsGridChoice.tsx";
import ProductCard from "./ProductCard.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import type { Layout  } from "$store/components/product/ProductCard.tsx";

export interface Props {
  products: Product[] | null;
  /**
   * @description Flags, exibidos quando os produtos são encontrados
   */
  highlights?: HighLight[];

  Layout?: Layout;

}

function ProductGallery({ products, highlights, Layout }: Props) {
  const gridCols = computed(() => gridColsSignal.value);
  return (
    <div class={`column-selector__container grid grid-cols-${gridCols.value.mobile} gap-2 items-center lg:grid-cols-${gridCols.value.desktop} lg:gap-[30px]`}>
      {products?.map((product, index) => (
        <ProductCard
          product={product}
          preload={index === 0}
          layout={Layout}
          highlights={highlights}
        />
      ))}
    </div>
  );
}

export default ProductGallery;