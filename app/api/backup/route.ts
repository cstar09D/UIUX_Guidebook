import { NextRequest, NextResponse } from "next/server";
import {
  exportBackup,
  checkpointContents,
  previewImport,
  importBackup,
} from "@/lib/db";
import { ContentError } from "@/lib/content";
import { requireAdmin, readJson, failure } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const checkpoint = request.nextUrl.searchParams.get("checkpoint");
    const text = checkpoint
      ? await checkpointContents(checkpoint)
      : JSON.stringify(await exportBackup(), null, 2);
    const bytes = new TextEncoder().encode(text);
    let offset = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (offset >= bytes.length) {
          controller.close();
          return;
        }
        const end = Math.min(offset + 64 * 1024, bytes.length);
        controller.enqueue(bytes.subarray(offset, end));
        offset = end;
      },
    });
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="ui-notes-${checkpoint ? "checkpoint" : new Date().toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const value = await readJson(request);
    if (value.operation === "preview")
      return NextResponse.json(await previewImport(value.backup, value.mode));
    if (value.operation === "import" && typeof value.token === "string")
      return NextResponse.json(
        await importBackup(value.backup, value.mode, value.token),
      );
    throw new ContentError("가져오기 작업을 확인하세요.");
  } catch (error) {
    return failure(error);
  }
}
