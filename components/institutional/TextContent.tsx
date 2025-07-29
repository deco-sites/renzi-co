
import type { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import { Head } from "$fresh/runtime.ts";

export interface Props {
  /**
   * @description Content will be rendered as markdown.
   */
  content: HTML;
}

function TextContent({ content }: Props) {
  return (
    <>
      <Head>
         <style
            dangerouslySetInnerHTML={{
              __html: `
                .textContent ul,
                .textContent ol {
                  list-style: initial;
                  margin: initial;
                  padding-left: 23px;
                  margin-bottom: 18px;
                }

                .textContent li {
                  margin-left: 14px;
                }
              `,
            }}
          />
      </Head>
      <div class="mb-12 lg:mb-20 textContent" dangerouslySetInnerHTML={{ __html: content }}>
        {/* {content.replace(/<p>|<\/p>/g, "\n")} */}
      </div>
    </>
  );
}

export default TextContent;