import type { HTMLWidget as HTML } from "apps/admin/widgets.ts";

export interface Props {
  /**
   * @description Content will be rendered as markdown.
   */
  content: HTML;
  title: string;
}

export function AccordionItem({ title, content }: Props) {
  return (
    <div tabIndex={0} class="collapse collapse-plus">
      <input type="checkbox" class="hidden" />
      <div class="collapse-title px-0 border-b border-base-200 h-11 min-h-0 py-[10.5px] after:!right-1 after:!top-1 after:scale-150">
        {title}
      </div>
      <div class="collapse-content px-0 !pb-0">
        <div class="pt-5">
          {content.replace(/<p>|<\/p>/g, "\n")}
        </div>
      </div>
    </div>
  );
}