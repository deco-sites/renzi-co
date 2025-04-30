// import type { Product } from "apps/commerce/types.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import type { ProductDetailsPage } from "apps/commerce/types.ts";

export type HighlightsColors =
  | "emphasis"
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "base"
  | "info"
  | "success"
  | "warning"
  | "error";

export type ColumnStart =
  | "esquerda"
  | "direita";

export type AlignVertical =
  | "superior"
  | "meio"
  | "inferior";

export type AlignHorizontal =
  | "esquerda"
  | "centro"
  | "direita";

export type WidthElement =
  | "auto"
  | "75%"
  | "100%";

export interface HighLight {
  /** @description (caso seja inserido imagem, o texto não irá aparecer) */  
  icon?: ImageWidget;
  /** @title Texto */ 
  label?: string;
  /** @description (consultar ID da Coleção no admin da VTEX) */   
  collectionId: string;
  /** @title Cor do fundo */   
  /** @description (link de cores: https://www.w3schools.com/cssref/css_colors.php) */   
  backgorundColor?: string;
  /** @title Cor do texto */   
  /** @description (link de cores: https://www.w3schools.com/cssref/css_colors.php) */  
  color?: string;
  /** @title Posição horizontal do elemento */
  columnStart?: ColumnStart;
  /** @title Alinhamento vertical da linha */
  alignVertical?: AlignVertical;
  /** @title Largura do elemento */
  widthElement?: WidthElement;
  /** @title Alinhamento horizontal */ 
  /** @description (conforme Posição selecionada) */ 
  alignHorizontal?: AlignHorizontal;
}

type Props = {
  product: ProductDetailsPage["product"];
  className?: string;
  highlights?: HighLight[];
};

export const GRID_COL_START: Record<ColumnStart, string> = {
  "esquerda" : "col-start-1",
  "direita" : "col-start-2",
};

export const GRID_ROW_HORIZONTAL: Record<AlignHorizontal, string> = {
  "esquerda": "justify-self-start",
  "centro": "justify-self-center",
  "direita": "justify-self-end",
};

export const WIDTH_ELEMENT: Record<WidthElement, string> = {
  "auto": "auto",
  "75%": "75%",
  "100%": "100%",
};

export const ALIGN_VERTICAL: Record<AlignVertical, string> = {
  "superior": "row-start-1",
  "meio": "row-start-2",
  "inferior": "row-start-3",
};

function ProductHighlights(props: Props) {
  const { product, highlights } = props;
  const additionalProperty = product?.additionalProperty ?? [];
  const productHighlights = additionalProperty;

  if (!productHighlights.length) return null;
  if (!highlights) return null;

  return (
    <>
      {productHighlights.map(({ value, propertyID }) => {
        return highlights.map(
          (
            {
              collectionId,
              backgorundColor,
              color,
              label,
              icon,
              columnStart,
              widthElement,
              alignHorizontal,
              alignVertical,
            },
          ) => {
            if (propertyID == collectionId) {
              return (
                <div class="absolute w-full left-0 top-0 p-[10px] flex items-center z-10">
                  <div class="w-full h-full z-10 grid grid-cols-2 gap-y-1">
                    <div class=
                      {`product-highlights flex box-content h-[25px] text-[9px] 2xl:text-[10px] items-center uppercase font-bold border-none rounded-lg  bg-opacity-100 opacity-100 justify-center
                        ${alignVertical ? ALIGN_VERTICAL[alignVertical] : "row-start-auto"}
                        ${columnStart ? GRID_COL_START[columnStart] : "col-start-auto"}
                        ${alignHorizontal ? GRID_ROW_HORIZONTAL[alignHorizontal] : "items-center"}  
                        ${icon ? "p-0 self-start" : "p-1 2xl:p-2 self-start"}
                        ${widthElement ? "w-" + WIDTH_ELEMENT[widthElement] : "w-auto" }
                      `}
                      style={{background: backgorundColor,color, width: widthElement}}
                    >
                      {icon ? (<Image src={icon} width={58} height={58} />) : label ? label : value}
                    </div>                  
                  </div>
                </div>
              );
            } else {
              return null;
            }
          },
        );
      })}
    </>
  );
}

export default ProductHighlights;