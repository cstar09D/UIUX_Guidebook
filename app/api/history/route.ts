import { NextRequest } from "next/server";
import { getHistory } from "@/lib/db";
import { requireAdmin, respond } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(request: NextRequest) {
  return respond(async () => {
    await requireAdmin(request);
    return await getHistory(request.nextUrl.searchParams.get("id") || "");
  });
}
