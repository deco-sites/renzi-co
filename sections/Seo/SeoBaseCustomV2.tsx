import { Head } from "$fresh/runtime.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { AppContext } from "apps/commerce/mod.ts";
import { stripHTML } from "apps/website/utils/html.ts";
import {
  OGType,
  renderTemplateString,
  SEOSection,
} from "apps/website/components/Seo.tsx";

export interface Props {
  title?: string;
  /**
   * @title Title template
   * @description add a %s whenever you want it to be replaced with the product name, category name or search term
   */
  titleTemplate?: string;
  description?: string;
  /**
   * @title Description template
   * @description add a %s whenever you want it to be replaced with the product name, category name or search term
   */
  descriptionTemplate?: string;
  type?: OGType;
  /** @description Recommended: 1200 x 630 px (up to 5MB) */
  image?: ImageWidget;
  /** @description Recommended: 16 x 16 px */
  favicon?: ImageWidget;
  /** @description Suggested color that browsers should use to customize the display of the page or of the surrounding user interface */
  themeColor?: string;
  /**
   * @title Disable indexing
   * @description In testing, you can use this to prevent search engines from indexing your site
   */
  noIndexing?: boolean;

  jsonLDs?: unknown[];
  
  /** @ignore true */
  currentUrl?: string;

  /** @ignore true */
  has_url_query_string: boolean;
}

/** @title Base Custom V2 */
export function loader(props: Props, req: Request, ctx: AppContext) {
  const url_formatted = new URL(req.url);
  const has_url_query_string = url_formatted.search !== "";
  const title = props.title || (ctx.seo && ctx.seo.title) || "";
  const titleTemplate = props.title
    ? props.titleTemplate ||
      (ctx.seo && ctx.seo.titleTemplate) || ""
    : "%s";
  const description = props.description || (ctx.seo && ctx.seo.description) ||
    "";
  const descriptionTemplate = props.descriptionTemplate ||
    (ctx.seo && ctx.seo.descriptionTemplate) || "";
  const type = props.type || (ctx.seo && ctx.seo.description) || "website";
  const image = props.image || (ctx.seo && ctx.seo.image) || "";
  const favicon = props.favicon || (ctx.seo && ctx.seo.favicon) || "";
  const themeColor = props.themeColor || (ctx.seo && ctx.seo.themeColor) || "";
  const noIndexing = props.noIndexing || (ctx.seo && ctx.seo.noIndexing);

  return {
    ...props,
    has_url_query_string,
    title,
    titleTemplate,
    description,
    descriptionTemplate,
    type,
    image,
    favicon,
    themeColor,
    noIndexing,
  };
}

export default function SeoBaseCustomV2({
  title,
  titleTemplate,
  description,
  descriptionTemplate,
  type,
  image,
  favicon,
  themeColor,
  noIndexing,
  has_url_query_string,
  jsonLDs = [],
  currentUrl
}: Props): SEOSection {
  const twitterCard = type === "website" ? "summary" : "summary_large_image";
  const description_html = stripHTML(description || "");
  const title_html = stripHTML(title || "");

  return (
    <>
      <Head>
        <title>{renderTemplateString(titleTemplate || "", title_html)}</title>
        <meta
          name="description"
          content={renderTemplateString(
            descriptionTemplate || "",
            description_html,
          )}
        />
        <meta name="theme-color" content={themeColor} />
        <link rel="icon" href={favicon} />

        {/* Twitter tags */}
        <meta property="twitter:title" content={title_html} />
        <meta property="twitter:description" content={description_html} />
        <meta property="twitter:image" content={image} />
        <meta property="twitter:card" content={twitterCard} />

        {/* OpenGraph tags */}
        <meta property="og:title" content={title_html} />
        <meta property="og:description" content={description_html} />
        <meta property="og:type" content={type} />
        <meta property="og:image" content={image} />

        <link rel="canonical" href={currentUrl} />

        {/* No index, no follow */}
        <meta
          name="robots"
          content={`${
            noIndexing || has_url_query_string ? "noindex" : "index"
          }, ${noIndexing ? "nofollow" : "follow"}`}
        />

        {
          jsonLDs.map((json) => (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  // @ts-expect-error Trust me, I'm an engineer
                  ...json,
                }),
              }}
            />
          ))}
      </Head>
    </>
  );
}