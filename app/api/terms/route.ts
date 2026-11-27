import { NextRequest, NextResponse } from "next/server";
import { listTerms, saveContent, changeTerm, reorderTerms } from "@/lib/db";
import { ContentError } from "@/lib/content";
import { requireAdmin, readJson, respond, failure } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(request: NextRequest) {
  return respond(async () => {
    if (request.nextUrl.searchParams.get("admin") === "1") {
      await requireAdmin(request);
      return await listTerms(true);
    }
    return await listTerms();
  });
}
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const value = await readJson(request);
    if (!["save", "publish"].includes(value.mode))
      throw new ContentError("저장 방식을 확인하세요.");
    return NextResponse.json(await saveContent(value.document, value.mode));
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request);
    const value = await readJson(request);
    if (value.action === "order") {
      if (
        !Array.isArray(value.ids) ||
        !Array.isArray(value.revisions) ||
        value.ids.some((v: unknown) => typeof v !== "string") ||
        value.revisions.some((v: unknown) => !Number.isSafeInteger(v))
      )
        throw new ContentError("순서 정보를 확인하세요.");
      return NextResponse.json(await reorderTerms(value.ids, value.revisions));
    }
    if (
      typeof value.id !== "string" ||
      !Number.isSafeInteger(value.revision) ||
      !["hide", "show", "trash", "restore", "unpublish", "history"].includes(
        value.action,
      )
    )
      throw new ContentError("콘텐츠와 변경 내용을 확인하세요.");
    if (value.action === "history" && !Number.isSafeInteger(value.versionId))
      throw new ContentError("복원할 이력을 선택하세요.");
    return NextResponse.json(
      await changeTerm(value.id, value.revision, value.action, value.versionId),
    );
  } catch (error) {
    return failure(error);
  }
}
