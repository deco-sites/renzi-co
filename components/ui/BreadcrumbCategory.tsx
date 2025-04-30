import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import type { ProductListingPage } from "apps/commerce/types.ts";
import { type LoaderReturnType } from "@deco/deco";
export interface Props {
    page: LoaderReturnType<ProductListingPage | null>;
}
function BreadcrumbCategory({ page }: Props) {
    if (!page?.breadcrumb) {
        return <div />;
    }
    return <Breadcrumb itemListElement={page.breadcrumb.itemListElement}/>;
}
export default BreadcrumbCategory;