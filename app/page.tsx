import Catalog from "@/components/Catalog";
import { listTerms, getTaxonomy } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Home() {
  return (
    <Catalog
      initialTerms={await listTerms()}
      initialCategories={(await getTaxonomy()).categories}
    />
  );
}
