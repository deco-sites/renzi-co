
import type { HTMLWidget as HTML } from "apps/admin/widgets.ts";

export interface Props {
  /**
   * @description Content will be rendered as markdown.
   */
  content: HTML;
}

function TextContent({ content }: Props) {
  return (
    <div class="mb-12 lg:mb-20">
      {content.replace(/<p>|<\/p>/g, "\n")}
    </div>
  );
}

export default TextContent;