import { requireAdminPage } from "@/lib/admin-access";
import Catalog from "@/components/Catalog";
import { listTerms, getTaxonomy } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Preview() {
  await requireAdminPage();
  return (
    <Catalog
      initialTerms={(await listTerms(true)).filter((term) => !term.deleted)}
      initialCategories={(await getTaxonomy()).categories}
      preview
    />
  );
}
