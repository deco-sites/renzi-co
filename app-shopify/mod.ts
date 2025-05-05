import manifest from "./manifest.gen.ts";
import type { Manifest } from "./manifest.gen.ts";
import type { App, FnContext } from "@deco/deco";
import { PreviewContainer } from "apps/utils/preview.tsx";
import { Secret } from "apps/website/loaders/secret.ts";
import { createGraphqlClient } from "apps/utils/graphql.ts";
import { fetchSafe } from "apps/utils/fetch.ts";

/** @title Shopify */
export interface Props {
  /**
   * @description Shopify store name.
   */
  storeName: string;
  /**
   * @title Public store URL
   * @description Domain that is registered on License Manager (e.g: www.mystore.com.br)
   */
  publicUrl?: string;
  /**
   * @title Access Token
   * @description Shopify storefront access token.
   */
  storefrontAccessToken: string;
  /**
   * @ttile Access Token
   * @description Shopify admin access token.
   */
  adminAccessToken: Secret;
  /** @description Disable password protection on the store */
  storefrontDigestCookie?: string;
  /**
   * @description Use Shopify as backend platform
   * @default shopify
   * @hide true
   */
  platform: "shopify";
}

export interface Address {
  provinceCode: string;
}

export interface AddressLocator {
  byZipCode(zip: string): Promise<Address | null>;
}

export type AppContext = FnContext<State, Manifest>;

export interface State extends Props {
  storefront: ReturnType<typeof createGraphqlClient>;
  admin: ReturnType<typeof createGraphqlClient>;
  // address: AddressLocator;
}

export default function App(props: Props): App<Manifest, State> {
  const { storeName, storefrontAccessToken, adminAccessToken } = props;

  const stringAdminAccessToken = typeof adminAccessToken === "string"
    ? adminAccessToken
    : adminAccessToken?.get?.() ?? "";

  const storefront = createGraphqlClient({
    fetcher: fetchSafe,
    endpoint: `https://${storeName}.myshopify.com/api/2023-07/graphql.json`,
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    }),
  });

  const admin = createGraphqlClient({
    fetcher: fetchSafe,
    endpoint:
      `https://${storeName}.myshopify.com/admin/api/2023-07/graphql.json`,
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": stringAdminAccessToken,
    }),
  });

  //   const byZipCode = (zip: string) => {
  //     return Promise.resolve({
  //       provinceCode: getStateFromZip(zip),
  //     });
  //   };

  return {
    // state: { ...props, admin, storefront, address: { byZipCode } },
    state: { ...props, admin, storefront },
    manifest,
  };
}

// It is important to use the same name as the default export of the app
export const preview = () => {
  return {
    Component: PreviewContainer,
    props: {
      name: "App Shopify",
      owner: "Agência N1",
      description:
        "Loaders, actions and workflows for adding Shopify Commerce Platform to your website.",
      logo:
        "https://raw.githubusercontent.com/deco-cx/apps/main/shopify/logo.png",
      images: [
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/starting/03899f97-2ebc-48c6-8c70-1e5448bfb4db/shopify.webp",
      ],
      tabs: [],
    },
  };
};
