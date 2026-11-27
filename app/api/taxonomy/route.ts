import { NextRequest, NextResponse } from "next/server";
import { changeTaxonomy } from "@/lib/db";
import { requireAdmin, readJson, failure } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    return NextResponse.json(await changeTaxonomy(await readJson(request)));
  } catch (error) {
    return failure(error);
  }
}
