import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { useUI } from "$store/sdk/useUI.ts";
// import { useCart } from "apps/vtex/hooks/useCart.ts";
import { useCart, itemToAnalyticsItem } from "apps/shopify/hooks/useCart.ts";

function SearchButton() {
  const { displaySearchbar } = useUI();

  return (
    <Button
      class="btn-square btn-ghost flex items-center justify-center"
      aria-label="search icon button"
      onClick={() => {
        displaySearchbar.value = !displaySearchbar.peek();
      }}
    >
      <Icon
        class="text-base-content"
        id="MagnifyingGlass"
        width={20}
        height={20}
        strokeWidth={0.1}
      />
    </Button>
  );
}

function MenuButton() {
  const { displayMenu } = useUI();

  return (
    <Button
      class="rounded-full border-2 border-solid no-animation btn-ghost relative flex justify-center items-center lg:hidden"
      aria-label="open menu"
      onClick={() => {
        displayMenu.value = true;
      }}
    >
      <Icon class="text-base-content" id="Menu" width={25} height={25} />
    </Button>
  );
}

function CartButton() {
  const { displayCart } = useUI();
  const { loading, cart } = useCart();
  const totalItems = cart?.value?.lines?.nodes?.length ?? 0;
  const currencyCode = cart?.value?.cost?.totalAmount?.currencyCode ?? "BRL";
  const total = cart?.value?.cost?.totalAmount?.amount ?? 0;
  const discounts = 0

  const onClick = () => {
    displayCart.value = true;
    sendEvent({
      name: "view_cart",
      params: {
        currency: currencyCode,
        value: total,
        items: cart.value ? itemToAnalyticsItem(cart.value) : [],
      },
    });
  };

  return (
    <Button
      class="btn-square btn-ghost relative flex justify-center items-center"
      aria-label="open cart"
      data-deco={displayCart.value && "open-cart"}
      loading={loading.value}
      onClick={onClick}
    >
      <div class="indicator">
        {totalItems > 0 && (
          <span class="indicator-item text-base-100 btn btn-primary w-4 h-4 min-h-0 p-0 rounded-full text-xs left-4 top-3 font-bold">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
        <Icon
          class="text-base-content"
          id="ShoppingCart"
          width={24}
          height={24}
          strokeWidth={1}
        />
      </div>
    </Button>
  );
}

function Buttons({ variant }: { variant: "cart" | "search" | "menu" }) {
  if (variant === "cart") {
    return <CartButton />;
  }

  if (variant === "search") {
    return <SearchButton />;
  }

  if (variant === "menu") {
    return <MenuButton />;
  }

  return null;
}

export default Buttons;