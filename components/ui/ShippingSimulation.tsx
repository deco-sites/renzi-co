import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import { formatPrice } from "$store/sdk/format.ts";
// import { useCart } from "apps/shopify/hooks/useCart.ts";
import { useCart } from "apps/vtex/hooks/useCart.ts";
import { useCart as useCartShopify } from "apps/shopify/hooks/useCart.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";
// import { invoke } from "../../runtime.ts";

export type MoneyV2 = {
  /** Decimal money amount. */
  amount: Scalars["Decimal"]["output"];
  /** Currency of the money. */
  currencyCode: CurrencyCode;
};

export enum CurrencyCode {
  CAD = "CAD",
  Usd = "USD",
}

export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  ARN: { input: any; output: any };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
  Decimal: { input: any; output: any };
  FormattedString: { input: any; output: any };
  HTML: { input: any; output: any };
  JSON: { input: any; output: any };
  Money: { input: any; output: any };
  StorefrontID: { input: any; output: any };
  URL: { input: any; output: any };
  UnsignedInt64: { input: any; output: any };
  UtcOffset: { input: any; output: any };
};

export type ShippingRate = {
  handle: Scalars["String"]["output"];
  price: MoneyV2;
  title: Scalars["String"]["output"];
};

export interface CalculatedDraftOrder {
  availableShippingRates: Array<ShippingRate>;
}

export interface Props {
  items: Array<SKU>;
  shipmentPolitics?: {
    label: string;
    link: string;
  };
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

function ShippingContent({
  simulation,
}: {
  simulation: Signal<CalculatedDraftOrder | null>;
}) {

  // const { cart } = useCart();

  // const methods =
  //   simulation.value?.logisticsInfo?.reduce(
  //     (initial, { slas }) => [...initial, ...slas],
  //     [] as Sla[]
  //   ) ?? [];

  // const locale = cart.value?.clientPreferencesData.locale || "pt-BR";
  // const currencyCode = cart.value?.storePreferencesData.currencyCode || "BRL";

  if (simulation.value == null) {
    return null;
  }


  if (simulation.value?.userErrors?.length > 0) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  const availableShippingRates = simulation.value?.calculatedDraftOrder?.availableShippingRates ?? []
  console.log('simulation:', simulation);
  return (
    <ul class="flex flex-col text-xs rounded-[10px]">
      {availableShippingRates.map(({
        title,
        price
      }) => (
        <li class="flex text-secondary-focus px-[20px] py-[10px] odd:bg-secondary-focus odd:bg-opacity-5 justify-between items-center first:rounded-t-[10px] last:rounded-b-[10px]">
          <span class="text-center text-secondary font-bold">
            {title}
          </span>
          <span class="text-button">
            {/* Em até {formatShippingEstimate(method.shippingEstimate)} */}
          </span>
          <span class="text-base font-bold text-right">
            {(Number(price.amount)) === 0
              ? "Grátis"
              : formatPrice(Number(price.amount), "BRL", "pt-BR")}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ShippingSimulation({ items, shipmentPolitics }: Props) {
  const postalCode = useSignal("");
  const loading = useSignal(false);
  const simulateResult = useSignal<CalculatedDraftOrder | null>(null);
  // const { simulate, cart }  =useCart()
  const { simulate, cart } = useCartShopify();

  const handleSimulation = useCallback(async () => {
    if (postalCode.value.length !== 8) {
      return;
    }

    try {
      loading.value = true;
      // simulateResult.value = await simulate({
      //   items: items,
      //   postalCode: postalCode.value,
      //   country: cart.value?.storePreferencesData?.countryCode || "BRA",
      // });

      // simulateResult.value  = await invoke.shopify.actions.order.draftOrderCalculate({
      //   input: {
      //     lineItems: items.map(({ id, quantity }) => {
      //       return {
      //         variantId: id,
      //         quantity: quantity,
      //       };
      //     }),
      //     shippingAddress: {
      //       zip: postalCode.value,
      //       countryCode: "BR",
      //     },
      //   },
      // });

      simulateResult.value = await simulate({
        input: {
          lineItems: items.map(({ id, quantity }) => {
            return {
              variantId: id,
              quantity: quantity,
            };
          }),
          shippingAddress: {
            zip: postalCode.value,
            countryCode: "BR",
          },
        }
      });

    } finally {
      loading.value = false;
    }
  }, []);

  return (
    <div class="flex flex-col mt-[10px] gap-5 p-[30px] rounded-[10px] bg-neutral-200 text-base-300">
      <p class="text-justify">
        Calcule o frete e o prazo de entrega estimados para sua região. Informe
        seu CEP:
      </p>
      <div class="flex flex-col gap-[10px]">
        <form
          class="flex gap-2 justify-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulation();
          }}
        >
          <input
            as="input"
            type="text"
            class="input input-bordered input-sm text-xs border-2 focus:outline-none w-full max-w-xs !py-4"
            placeholder="Seu cep aqui"
            value={postalCode.value}
            maxLength={8}
            onChange={(e: { currentTarget: { value: string } }) => {
              postalCode.value = e.currentTarget.value;
            }}
          />
          <Button
            type="submit"
            loading={loading.value}
            class="btn btn-secondary h-[2.25rem] px-5"
          >
            Calcular
          </Button>
        </form>
      </div>
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        class="uppercase text-emphasis text-xs"
      >
        Não sei meu CEP
      </a>
      {simulateResult.value ? (
        <ShippingContent simulation={simulateResult} />
      ) : null}
      {shipmentPolitics && (
        <a href={shipmentPolitics.link} class="uppercase text-emphasis text-xs">
          {shipmentPolitics.label}
        </a>
      )}
    </div>
  );
}

export default ShippingSimulation;
