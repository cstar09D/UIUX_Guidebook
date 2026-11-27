import { NextRequest } from "next/server";
import { getAdminState } from "@/lib/db";
import { requireAdmin, respond } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(request: NextRequest) {
  return respond(async () => {
    await requireAdmin(request);
    return await getAdminState();
  });
}
