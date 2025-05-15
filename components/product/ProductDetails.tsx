import { useId } from "preact/hooks";
import ShippingSimulation from "$store/islands/ShippingSimulation.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Button from "$store/components/ui/Button.tsx";
import Image from "apps/website/components/Image.tsx";
// import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import OutOfStock from "$store/islands/OutOfStock.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import type { ProductDetailsPage } from "apps/commerce/types.ts";
import AddToCartActions from "$store/islands/AddToCartActions.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { getShareLink } from "$store/sdk/shareLinks.tsx";
// import DiscountBadge from "./DiscountBadge.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import AddToCartButton from "$store/components/product/AddToCartButton.tsx";
import ProductButtonFloatingText from "$store/components/ui/ProductButtonFloatingText.tsx";
import ProductDetailsImages from "$store/components/product/ProductDetailsImage.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import ModalImage from "$store/islands/ModalImage.tsx";
import { type LoaderReturnType } from "@deco/deco";
export type Variant = "front-back" | "slider" | "auto";
export type ShareableNetwork = "Facebook" | "Twitter" | "Email" | "WhatsApp";
export interface Props {
    page: LoaderReturnType<ProductDetailsPage | null>;
    /**
     * @title Product view
     * @description Ask for the developer to remove this option since this is here to help development only and should not be used in production
     */
    variant?: Variant;
    shipmentPolitics?: {
        label: string;
        link: string;
    };
    shareableNetworks?: ShareableNetwork[];
    highlights?: HighLight[];
}
const WIDTH = 500;
const HEIGHT = 500;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;
/**
 * Rendered when a not found is returned by any of the loaders run on this page
 */
function NotFound() {
    return (<div class="w-full flex justify-center items-center py-28">
      <div class="flex flex-col items-center justify-center gap-6">
        <span class="font-medium text-2xl">Página não encontrada</span>
        <a href="/">
          <Button>Voltar à página inicial</Button>
        </a>
      </div>
    </div>);
}
function ProductInfo({ page, shipmentPolitics, shareableNetworks }: {
    page: ProductDetailsPage;
    shipmentPolitics?: Props["shipmentPolitics"];
    shareableNetworks?: Props["shareableNetworks"];
}) {
    const { breadcrumbList, product, } = page;
    const { description, productID, offers, name, gtin, isVariantOf, url, } = product;
    const { price, listPrice, seller, installments } = useOffer(offers);
    let stock;
    if (offers) {
        stock = offers.offers[0].inventoryLevel.value;
    }
    return (<>
      <div class="floating bg-[#2F1893] w-full h-[80px] fixed left-0 bottom-0 z-20 container-floating is-hidden">
        <div class="floating__container grid grid-cols-9 grid-rows-none h-full items-center max-w-[80%] item-floating my-0 mx-auto">
          <ProductButtonFloatingText product={product}/>
          <div class="floating__price col-[5/7] flex flex-col text-right">
            <span class="text-white">
              Por: {formatPrice(price, offers!.priceCurrency!)}
            </span>
            <span class="text-white text-xs">
              ou {installments}
            </span>
          </div>
          <div class="floating__button mt-0 flex flex-col gap-4 col-[8/10]">
            {stock > 0
            ? (<>
                  {seller && (<AddToCartButton sellerId={seller} skuId={productID} classes="btn-primary btn-block transition-all max-w-sm hover:text-neutral-100 font-medium text-secondary-focus h-10"/>)}
                </>)
            : <OutOfStock productID={productID}/>}
          </div>
        </div>
      </div>

      <div class="mt-4 sm:mt-0">
        <h1>
          <span class="font-medium text-base-content text-2xl">
            {isVariantOf?.name}
          </span>
        </h1>
        <div>
          <span class="text-sm text-base-300">
            Código: {gtin}
          </span>
        </div>
      </div>
      {/* Quantidade em estoque */}
      <div class={`mt-3 ${stock && stock <= 10 ? 'text-orange-400' : 'text-current'}`}>
        {stock && (`Quantidade em estoque: ${stock}`)}
      </div>      
      {/* Prices */}
      <div class="mt-3">
        <div class="flex flex-row gap-2 items-center">
          {listPrice !== price && (<span class="line-through text-base-300 text-xs">
              {formatPrice(listPrice, offers!.priceCurrency!)}
            </span>)}
          <span class="font-medium text-3xl text-emphasis">
            {formatPrice(price, offers!.priceCurrency!)}
          </span>
        </div>
        <span>
          {installments}
        </span>
      </div>
      {/* Sku Selector */}
      <div class="mt-4 sm:mt-5">
        <ProductSelector product={product}/>
      </div>
      {/* Add to Cart and Favorites button */}
      <div class="mt-4 lg:mt-10 flex gap-[30px]">
        {stock > 0
            ? (<>
              {seller && (<AddToCartActions productID={productID} seller={seller} price={price} listPrice={listPrice} productName={name ?? ""} productGroupID={product.isVariantOf?.productGroupID ?? ""}/>)}
            </>)
            : <OutOfStock productID={productID}/>}
      </div>
      {/* Description card */}
      <details className="collapse collapse-plus border-b border-neutral rounded-none">
        <summary className="collapse-title px-0">
          Detalhes do produto
        </summary>
        <div className="readmore text-xs px-0 leading-tight collapse-content text-base-300">
          <input type="checkbox" id="readmore" className="readmore-toggle"/>
          <label htmlFor="readmore" className="readmore-label my-2 block">
            + Ler mais
          </label>
          <p className="readmore-content">{description}</p>
        </div>
      </details>
      {/* Shipping Simulation */}
      <div className="collapse collapse-plus">
        <input type="checkbox"/>
        <div className="collapse-title px-0">
          Calcular frete e entrega
        </div>
        <div className="collapse-content px-0">
          <ShippingSimulation items={[{
                id: Number(product.sku),
                quantity: 1,
                seller: seller ?? "1",
            }]} shipmentPolitics={shipmentPolitics}/>
        </div>
      </div>
      {/* Share Product on Social Networks */}
      {shareableNetworks && (<div class="flex items-center gap-5 my-5">
          <span class="text-xs text-base-300">Compartilhar</span>
          <ul class="gap-2 flex items-center justify-between">
            {shareableNetworks.map((network) => (<li class="bg-base-300 w-8 h-8 rounded-full hover:bg-emphasis transition-all">
                <a href={getShareLink({
                    network,
                    productName: isVariantOf?.name ?? name ?? "",
                    url: url ?? "",
                })} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-full h-full text-neutral-100">
                  <Icon id={network} width={20} height={20}/>
                </a>
              </li>))}
          </ul>
        </div>)}

      {/* Analytics Event */}
      <SendEventOnLoad event={{
            name: "view_item",
            params: {
                items: [
                    mapProductToAnalyticsItem({
                        product,
                        breadcrumbList,
                        price,
                        listPrice,
                    }),
                ],
            },
        }}/>
    </>);
}
/**
 * Here be dragons
 *
 * bravtexfashionstore (VTEX default fashion account) has the same images for different skus. However,
 * VTEX api does not return the same link for the same image. This causes the image to blink when
 * the user changes the selected SKU. To prevent this blink from happening, I created this function
 * bellow to use the same link for all skus. Example:
 *
 * {
    skus: [
      {
        id: 1
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/123/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/124/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/125/c.jpg"
        ]
      },
      {
        id: 2
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
        ]
      }
    ]
  }

  for both skus 1 and 2, we have the same images a.jpg, b.jpg and c.jpg, but
  they have different urls. This function returns, for both skus:

  [
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
  ]

  This is a very catalog dependent function. Feel free to change this as you wish
 */
const useStableImages = (product: ProductDetailsPage["product"]) => {
    const imageNameFromURL = (url = "") => {
        const segments = new URL(url).pathname.split("/");
        return segments[segments.length - 1];
    };
    const images = product.image ?? [];
    const allImages = product.isVariantOf?.hasVariant.flatMap((p) => p.image)
        .reduce((acc, img) => {
        if (img?.url) {
            acc[imageNameFromURL(img.url)] = img.url;
        }
        return acc;
    }, {} as Record<string, string>) ?? {};
    return images.map((img) => {
        const name = imageNameFromURL(img.url);
        return { ...img, url: allImages[name] ?? img.url };
    });
};
function Details({ page, variant, shipmentPolitics, shareableNetworks }: {
    page: ProductDetailsPage;
    variant: Variant;
    shipmentPolitics?: Props["shipmentPolitics"];
    shareableNetworks?: Props["shareableNetworks"];
    highlights?: HighLight[];
}) {
    const { product, breadcrumbList } = page;
    // const { offers } = product;
    // const { price, listPrice, } = useOffer(offers);
    const id = `product-image-gallery:${useId()}`;
    const images = useStableImages(product);
    /**
     * Product slider variant
     */
    if (variant === "slider") {
        return (<>
        {/* Breadcrumb */}
        <Breadcrumb itemListElement={breadcrumbList?.itemListElement.slice(0, -1)}/>
        <div id={id} class="product-image-gallery flex flex-col lg:flex-row gap-4 lg:justify-center">
          {/* Product Images */}
          <ProductDetailsImages images={images} width={WIDTH} height={HEIGHT} aspect={ASPECT_RATIO} product={product}/>

          {/* Product Info */}
          <div class="w-full lg:pr-0 lg:pl-6">
            <ProductInfo page={page} shipmentPolitics={shipmentPolitics} shareableNetworks={shareableNetworks}/>
          </div>

          {/* <div class="modal-image-mobile">
              <div class="close-modal" onClick={closeModalImage}></div>
              <img />
            </div> */}
          <ModalImage />
        </div>
        <SliderJS rootId={id}></SliderJS>
      </>);
    }
    /**
     * Product front-back variant.
     *
     * Renders two images side by side both on mobile and on desktop. On mobile, the overflow is
     * reached causing a scrollbar to be rendered.
     */
    return (<div class="grid grid-cols-1 gap-4 lg:grid-cols-[50vw_25vw] lg:grid-rows-1 lg:justify-center">
      {/* Image slider */}
      <ul class="carousel carousel-center gap-6">
        {[images[0], images[1] ?? images[0]].map((img, index) => (<li class="carousel-item min-w-[100vw] lg:min-w-[24vw]">
            <Image sizes="(max-width: 640px) 100vw, 24vw" style={{ aspectRatio: ASPECT_RATIO }} src={img.url!} alt={img.alternateName} width={WIDTH} height={HEIGHT} 
        // Preload LCP image for better web vitals
        preload={index === 0} loading={index === 0 ? "eager" : "lazy"}/>
          </li>))}
      </ul>

      {/* Product Info */}
      <div class="px-4 lg:pr-0 lg:pl-6">
        <ProductInfo page={page}/>
      </div>
    </div>);
}
function ProductDetails({ page, variant: maybeVar = "auto", shipmentPolitics, shareableNetworks, highlights, }: Props) {
    /**
     * Showcase the different product views we have on this template. In case there are less
     * than two images, render a front-back, otherwhise render a slider
     * Remove one of them and go with the best suited for your use case.
     */
    const variant = maybeVar === "auto"
        ? page?.product.image?.length && page?.product.image?.length < 2
            ? "front-back"
            : "slider"
        : maybeVar;
    return (<div class="py-0 lg:pb-10">
      {page
            ? (<Details page={page} variant={variant} shipmentPolitics={shipmentPolitics} shareableNetworks={shareableNetworks} highlights={highlights}/>)
            : <NotFound />}
    </div>);
}
export default ProductDetails;