import { AppContext } from "apps/commerce/mod.ts";
import {
  loader as seoPdpV2Loader,
  Props as SeoPdpV2Props,
} from "apps/commerce/sections/Seo/SeoPDPV2.tsx";
// import { fix_data_struct_by_pix_payment } from "site/sdk/useSchema.ts";
import { SEOSection } from "apps/website/components/Seo.tsx";
import SeoBaseCustomV2 from "$store/sections/Seo/SeoBaseCustomV2.tsx";
import { type SectionProps } from "@deco/deco";

export interface Props extends SeoPdpV2Props {}

/** @title PDP Custom V2 */
export function loader(props: Props, req: Request, ctx: AppContext) {
  const pdp_seo_deco = seoPdpV2Loader(props, req, ctx);
//   const pdp_seo_with_pix_discount = pdp_seo_deco.jsonLDs.map((json_ld) => {
//     if (json_ld && json_ld.product) {
//       const new_json_ld = {
//         ...json_ld,
//         product: fix_data_struct_by_pix_payment(json_ld.product),
//       };
//       json_ld = new_json_ld;
//     }
//     return json_ld;
//   });
  delete pdp_seo_deco.canonical;
  const url_formatted = new URL(req.url);
  const has_url_query_string = url_formatted.search !== "";
  return {
    ...pdp_seo_deco,
    jsonLDs: pdp_seo_deco.jsonLDs,
    has_url_query_string,
    noIndexing: !!props.noIndexing,
    titleTemplate: (ctx.seo && ctx.seo.titleTemplate) || "",
    descriptionTemplate: (ctx.seo && ctx.seo.descriptionTemplate) || "",
  };
}

export function LoadingFallback(props: Partial<SectionProps<typeof loader>>) {
  return (
    <SeoBaseCustomV2
      {...{ ...props, has_url_query_string: !!props.has_url_query_string }}
    />
  );
}

export default function Section(
  props: SectionProps<typeof loader>,
): SEOSection {
  return <SeoBaseCustomV2 {...props} />;
}

export { default as Preview } from "apps/website/components/_seo/Preview.tsx";