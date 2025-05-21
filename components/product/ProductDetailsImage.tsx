import Slider from "$store/components/ui/Slider.tsx";
import DiscountBadge from "./DiscountBadge.tsx";
import Image from "apps/website/components/Image.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { ImageObject, Product } from "apps/commerce/types.ts";
import OpenModalImage from "$store/components/ui/OpenModalImage.tsx";

interface Props {
  images: ImageObject[];
  width: number;
  height: number;
  aspect: string;
  product: Product;
}

const WIDTH = 500;
const HEIGHT = 500;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductDetailsImage({ images, product }: Props) {
  const { offers } = product;
  const { price, listPrice } = useOffer(offers);

  return (
    <>
      {/* Product Images */}
      <div class="flex flex-col xl:flex-row-reverse relative lg:items-start gap-4">
        {/* Image Slider */}
        <div class="relative xl:pl-32">
          <Slider class="carousel carousel-center gap-6 box-border lg:box-content lg:w-[500px] xl:w-[600px] w-full px-4 lg:px-0">
            {images.map((img, index) => (
              <Slider.Item
                index={index}
                class="carousel-item w-full"
              >
                <figure
                  style={`background-image: url(${img
                    .url!}); background-size: 250%;`}
                  onMouseMove={(e: MouseEvent) => {
                    const zoomer = e.currentTarget as HTMLElement;
                    const offsetX = e.offsetX;
                    const offsetY = e.offsetY;
                    const x = offsetX / (zoomer.offsetWidth) * 100;
                    const y = offsetY / (zoomer.offsetHeight) * 100;

                    zoomer!.style.backgroundPosition = x + "% " + y + "%";
                  }}
                  class="overflow-hidden cursor-zoom-in relative"
                >
                  {/* <OpenModalImage /> */}
                  <Image
                    class="rounded-[10px] transition duration-150 opacity-100  lg:hover:opacity-0 hover:duration-300"
                    sizes="(max-width: 640px) 100vw, 40vw"
                    style={{ aspectRatio: ASPECT_RATIO }}
                    src={img.url!}
                    alt={img.alternateName}
                    width={WIDTH}
                    height={HEIGHT}
                    // Preload LCP image for better web vitals
                    preload={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}        
                  />
                </figure>
              </Slider.Item>
            ))}
          </Slider>

          {/* Discount tag */}
          {price && listPrice && price !== listPrice
            ? (
              <DiscountBadge
                price={price}
                listPrice={listPrice}
                className="lg:left-auto lg:right-0 left-4"
              />
            )
            : null}
        </div>

        {/* Dots */}
        <div class="lg:max-w-[500px] lg:self-start xl:self-start xl:left-0 xl:absolute xl:max-h-full xl:overflow-y-scroll xl:scrollbar-none">
          <ul
            class={`flex gap-4 overflow-auto lg:max-h-min lg:flex-1 lg:justify-start xl:flex-col`}
          >
            {images.map((img, index) => (
              <li class="min-w-[75px] lg:h-fit lg:min-w-[100px]">
                <Slider.Dot index={index}>
                  <Image
                    style={{ aspectRatio: ASPECT_RATIO }}
                    class="border-neutral hover:border-secondary-focus group-disabled:border-secondary-focus border-2 rounded-[10px]"
                    width={WIDTH / 5}
                    height={HEIGHT / 5}
                    src={img.url!}
                    alt={img.alternateName}
                  />
                </Slider.Dot>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ProductDetailsImage;