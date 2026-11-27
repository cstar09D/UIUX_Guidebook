import { NextRequest, NextResponse } from "next/server";
import { gunzipSync } from "node:zlib";
import { ContentError } from "./content";
export { requireAdmin } from "./admin-access";
export async function readJson(request: NextRequest) {
  const encoding = request.headers.get("content-encoding");
  if (encoding && encoding !== "gzip" && encoding !== "identity")
    throw new ContentError("지원하지 않는 압축 형식입니다.", 415);
  const bytes = Buffer.from(await request.arrayBuffer());
  const maximum = 25 * 1024 * 1024;
  if (bytes.length > maximum)
    throw new ContentError("파일은 25MB 이하로 선택하세요.", 413);
  let text: string;
  try {
    text = (
      encoding === "gzip"
        ? gunzipSync(bytes, { maxOutputLength: maximum })
        : bytes
    ).toString("utf8");
  } catch {
    throw new ContentError("압축 파일이 손상되었거나 25MB를 초과합니다.", 413);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new ContentError("JSON 형식을 확인하세요.");
  }
}
export async function respond(operation: () => unknown): Promise<NextResponse> {
  try {
    return NextResponse.json(await operation(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}
export function failure(error: unknown): NextResponse {
  return NextResponse.json(
    {
      error:
        error instanceof ContentError
          ? error.message
          : "요청을 처리하지 못했습니다. 잠시 후 다시 시도하세요.",
    },
    { status: error instanceof ContentError ? error.status : 500 },
  );
}
