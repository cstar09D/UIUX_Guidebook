import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isLocalRequest } from "./local-request.mjs";
export async function requireLocalPage() {
  if (!isLocalRequest(await headers())) notFound();
}
