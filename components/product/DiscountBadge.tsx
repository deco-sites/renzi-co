import {
    AlignHorizontal,
    GRID_COL_START,
    WidthElement,
    AlignVertical,
    ALIGN_VERTICAL,
    GRID_ROW_HORIZONTAL,
    ColumnStart,
  } from "$store/components/product/ProductHighlights.tsx";
  
  type Props = {
    price: number;
    listPrice: number;
    label?: string;
    variant?: string;
    className?: string;
    columnStart?: ColumnStart;
    alignVertical?:AlignVertical;
    widthElement?: WidthElement;
    alignHorizontal?: AlignHorizontal;
  };
  
  function DiscountBadge({
    price,
    listPrice,
    label,
    variant,
    className,
    widthElement,
    alignVertical,
    columnStart,
    alignHorizontal,
  }: Props) {
    const discount = ((listPrice - price) / listPrice) * 100;

    console.log(price, listPrice, "ddddd");
    console.log(discount);
  
    return (
      <div
        class={`tag-container flex items-center z-10  
        ${className}
        ${alignVertical ? ALIGN_VERTICAL[alignVertical] : "row-start-auto"}
        ${columnStart ? GRID_COL_START[columnStart] : "col-start-auto"}
        ${alignHorizontal ? GRID_ROW_HORIZONTAL[alignHorizontal] : "items-center"}     
        `}
        style={{width: widthElement}}      
      >
        <div
          class={`absolute right-0 top-0 p-[10px] flex items-center z-10 ${className}`}
        >
          <div
            class={`text-xs uppercase font-bold border-none px-[10px] py-[7px] rounded-lg flex box-content bg-opacity-100 opacity-100 text-base-100 bg-${
              variant ?? "emphasis"
            }`}
          >
            {discount?.toFixed(2).slice(0, 2)}% {label ?? "OFF"}
          </div>
        </div>
      </div>
    );
  }
  
  export default DiscountBadge;