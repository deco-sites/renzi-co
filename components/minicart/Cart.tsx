import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { formatPrice } from "$store/sdk/format.ts";
// import { useCart } from "apps/vtex/hooks/useCart.ts";
import { useCart, itemToAnalyticsItem } from "apps/shopify/hooks/useCart.ts";
import CartItem from "./CartItem.tsx";
import Coupon from "./Coupon.tsx";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline";

export interface ICartProps {
  /**
   * @title Hide clear all items button?
   * @default false
   */
  showClearButton?: boolean;
  desktop: {
    /**
     * @title finish order button variant
     */
    buttonMode?: ButtonVariant;
  };
  mobile: {
    /**
     * @title finish order button variant
     */
    buttonMode?: ButtonVariant;
  };
  /**
   * @title finish button label
   * @default Finalzar Compra
   */
  goToCartLabel?: string;
}

interface TotalizerProps {
  label?: string;
  value?: number;
  highlighted?: boolean;
  currencyCode: string;
  locale: string;
}

export const BUTTON_VARIANTS: Record<string, string> = {
  "primary": "btn primary hover:text-base-100",
  "secondary": "btn secondary hover:text-base-100",
  "accent": "btn accent text-base-content hover:text-base-100",
  "outline": "btn outline border border-base-content hover:bg-base-content",
};

function Totalizer(
  { value, label, currencyCode, locale }: TotalizerProps,
) {
  if (!value) return null;

  return (
    <div class="flex justify-between items-center w-full text-gray-500">
      <span class="text-sm max-md:text-xs text-base-content">{label}</span>
      <span class="text-sm max-md:text-xs text-base-content">
        {formatPrice(value, currencyCode!, locale)}
      </span>
    </div>
  );
}

function Cart(props: ICartProps) {
  const {
    desktop: {
      buttonMode,
    },
    mobile: {
      buttonMode: buttonModeMobile,
    },
    showClearButton = true,
    goToCartLabel = "Finalizar compra",
  } = props;
  const { loading, cart, removeAllItems} = useCart();
  const isCartEmpty = cart.value?.lines?.nodes?.length === 0;
  const locale = "pt-BR";
  const currencyCode = cart.value?.cost?.totalAmount.currencyCode ?? "BRL";
  const discounts = cart.value?.cost?.subtotalAmount.amount ?? 0
  const items = cart.value?.lines?.nodes ?? [];

  if (cart.value === null) {
    return null;
  }

  // Empty State
  if (isCartEmpty) {
    return (
      <div class="flex flex-col justify-center items-center h-full gap-6">
        <Icon class="text-emphasis" id="ShoppingCart" width={30} height={30} />
        <span class="font-medium text-sm text-base-300 lg:text-base">
          Seu carrinho esta vazio
        </span>
      </div>
    );
  }

  const subTotal =  cart.value?.cost?.subtotalAmount.amount ?? 0;
  const totalTaxAmount =  cart.value?.cost?.totalTaxAmount.amount ?? 0;
  const discountsTotal  =  0;
  const total = cart.value?.cost?.totalAmount.amount ?? 0;
  
  return (
    <>
      <ul
        role="list"
        class="mx-5 my-3 flex-grow overflow-y-auto flex flex-col gap-6 lg:mx-10"
      >
        {items?.map((_, index) => (
          <li key={index}>
            <CartItem index={index} currency={currencyCode!} />
          </li>
        ))}
      </ul>

      <footer class="flex flex-col items-center justify-center max-lg:px-5 px-10">
        <Coupon />
        <Totalizer
          currencyCode={currencyCode as string}
          label="Subtotal"
          locale={locale as string}
          value={subTotal}
        />
        <Totalizer
          currencyCode={currencyCode as string}
          label="Descontos"
          locale={locale as string}
          value={discountsTotal as number}
        />
        <Totalizer
          currencyCode={currencyCode as string}
          label="Taxa"
          locale={locale as string}
          value={totalTaxAmount}
        />
        {total && (
          <div class="flex flex-col justify-end items-end gap-2 py-3 mx-5 border-solid border-b-[1px] border-base-200 lg:mx-10 w-full">
            <div class="flex justify-between items-center w-full font-bold text-xs text-base-content lg:text-sm">
              <span class="lg:text-base-content text-emphasis max-md:text-xs">
                Total
              </span>
              <span class="lg:text-base-content text-emphasis max-md:text-xs">
                {formatPrice(total, currencyCode!, locale)}
              </span>
            </div>
          </div>
        )}
        <div class="py-4 lg:hidden w-full">
          <a class="justify-center w-full block" href="/checkout">
            <Button
              data-deco="buy-button"
              class={`h-9 font-medium text-xs border-none w-full btn-${
                BUTTON_VARIANTS[buttonModeMobile ?? "primary"]
              }`}
              disabled={loading.value || items?.length === 0}
              onClick={() => {
                sendEvent({
                  name: "begin_checkout",
                  params: {
                    currency: cart.value ? currencyCode! : "",
                    value: (total - discounts) / 100,
                    coupon: cart.value?.marketingData?.coupon ?? undefined,

                    items: cart.value
                      ? itemToAnalyticsItem(cart.value)
                      : [],
                  },
                });
              }}
            >
              Fechar Pedido
            </Button>
          </a>
        </div>
        <div class="p-4 max-lg:hidden lg:flex lg:justify-between lg:mx-10 lg:px-0 w-full gap-2 xl:gap-5 lg:flex-col xl:flex-row">
          {!showClearButton && (
            <Button
              data-deco="buy-button"
              class="h-9  btn btn-outline lg:h-10 whitespace-nowrap px-6"
              disabled={loading?.value || items?.length === 0}
              onClick={() => {
                removeAllItems(undefined);
              }}
            >
              Limpar Carrinho
            </Button>
          )}
          <a class="w-full flex justify-center" href="/checkout">
            <Button
              data-deco="buy-button"
              class={`h-9 btn-${
                BUTTON_VARIANTS[buttonMode as string]
              } font-medium text-xs w-[40%] text-base-100 lg:w-full lg:text-sm lg:h-10`}
              disabled={loading.value || items?.length === 0}
              onClick={() => {
                sendEvent({
                  name: "begin_checkout",
                  params: {
                    currency: cart.value ? currencyCode! : "",
                    value: total ? (total - (discounts ?? 0)) / 100 : 0,
                    coupon: cart.value?.marketingData?.coupon ?? undefined,

                    items: cart.value
                      ? itemToAnalyticsItem(cart.value)
                      : [],
                  },
                });
              }}
            >
              {goToCartLabel}
            </Button>
          </a>
        </div>
      </footer>
    </>
  );
}

export default Cart;