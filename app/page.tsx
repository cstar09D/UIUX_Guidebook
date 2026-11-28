import Catalog from "@/components/Catalog";
import { headers } from "next/headers";
import { isLocalRequest } from "@/lib/local-request.mjs";
import { listTerms, getTaxonomy } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Home() {
  const preview =
    process.env.NODE_ENV === "development" &&
    !process.env.VERCEL &&
    isLocalRequest(await headers());
  const terms = preview ? await listTerms(true) : await listTerms();
  return (
    <Catalog
      initialTerms={preview ? terms.filter((term) => !term.deleted) : terms}
      initialCategories={(await getTaxonomy()).categories}
      preview={preview}
    />
  );
}
