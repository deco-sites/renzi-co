import Filters from "$store/components/search/Filters.tsx";
import SearchControls from "$store/islands/SearchControls.tsx";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import ProductGallery from "../product/ProductGallery.tsx";
import type { ProductListingPage } from "apps/commerce/types.ts";
import Sort from "$store/islands/Sort.tsx";
import type { Layout  } from "$store/components/product/ProductCard.tsx";
import SearchPagination from "$store/components/search/SearchPagination.tsx";
import SearchResultsGridChoice from "$store/islands/SearchResultsGridChoice.tsx";
import type { HighLight } from "$store/components/product/ProductHighlights.tsx";
import { type LoaderReturnType } from "@deco/deco";
import { type Section } from "@deco/deco/blocks";
export interface Props {
  page: LoaderReturnType<ProductListingPage | null>;
  /**
   * @description Flags, exibidos quando os produtos são encontrados
   */
  highlights?: HighLight[];
  /**
   * @description Use drawer for mobile like behavior on desktop. Aside for rendering the filters alongside the products
   */
  variant?: "aside" | "drawer";
  /**
   * @description Not found section, displayed when no products are found
   */
  notFoundSection: Section;

  layout?: Layout;

}
function Result({
  page,
  variant,
  highlights,
  layout
}: Omit<Omit<Props, "page">, "notFoundSection"> & {
  page: ProductListingPage;
}) {
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const productsFound = (
    <h6 class="text-secondary font-medium">
      {pageInfo.records} Produtos encontrados
    </h6>
  );
  return (
    <>
      <div>
        <div class="flex flex-row gap-8">
          {variant === "aside" && filters.length > 0 && (
            <aside class="hidden lg:block w-min mt-1 min-w-[270px]">
              <Filters filters={filters} />
            </aside>
          )}
          <div class="flex flex-col gap-5 w-full">
            <div class="flex justify-between items-center gap-2.5">
              <div class="hidden lg:block">{productsFound}</div>
              <SearchControls
                sortOptions={sortOptions}
                filters={filters}
                breadcrumb={breadcrumb}
                displayFilter={variant === "drawer"}
              />
              {sortOptions.length > 0 ? (
                <label class="flex gap-[10px] w-1/2 lg:w-auto items-center">
                  <span class="text-base-300 hidden whitespace-nowrap lg:inline">
                    Ordenar por:
                  </span>
                  <Sort sortOptions={sortOptions} />
                </label>
              ) : null}
              <SearchResultsGridChoice variant="desktop" />
            </div>
            <div class="lg:hidden column-selector relative">
              {productsFound}
              <SearchResultsGridChoice variant="mobile" />
            </div>
            <div class="flex-grow">
              <ProductGallery products={products} highlights={highlights} Layout={layout} />
              <SearchPagination pageInfo={pageInfo} />
            </div>
          </div>
        </div>
      </div>
      <SendEventOnLoad
        event={{
          name: "view_item_list",
          params: {
            // TODO: get category name from search or cms setting
            item_list_name: "",
            item_list_id: "",
            items: page.products?.map((product) =>
              mapProductToAnalyticsItem({
                ...useOffer(product.offers),
                product,
                breadcrumbList: page.breadcrumb,
              })
            ),
          },
        }}
      />
    </>
  );
}
function SearchResult({
  page,
  notFoundSection: { Component: NotFoundSection, props: notFoundProps },
  ...props
}: Props) {
  if (!page || !page.products || page.products.length === 0) {
    return <NotFoundSection {...notFoundProps} />;
  }
  return <Result {...props} page={page} />;
}
export default SearchResult;
