import { NextRequest, NextResponse } from "next/server";
import {
  authConfigured,
  createSession,
  sessionCookie,
  sessionSeconds,
  verifyPassword,
} from "@/lib/admin-session.mjs";
import { requireSameOrigin } from "@/lib/admin-access";
import { consumeLoginAttempt, clearLoginAttempts } from "@/lib/db";
import { ContentError } from "@/lib/content";
import { failure } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    if (!authConfigured())
      throw new ContentError("관리자 로그인 환경 변수를 먼저 설정하세요.", 503);
    if (Number(request.headers.get("content-length")) > 4096)
      throw new ContentError("입력 길이를 확인하세요.", 413);
    const body = await request.text();
    if (Buffer.byteLength(body) > 4096)
      throw new ContentError("입력 길이를 확인하세요.", 413);
    if (!(await consumeLoginAttempt()))
      throw new ContentError(
        "로그인 시도가 많습니다. 15분 후 다시 시도하세요.",
        429,
      );
    let value;
    try {
      value = JSON.parse(body);
    } catch {
      throw new ContentError("입력 내용을 확인하세요.");
    }
    if (
      !(await verifyPassword(value?.password, process.env.ADMIN_PASSWORD_HASH))
    )
      throw new ContentError("비밀번호를 확인하세요.", 401);
    await clearLoginAttempts();
    const response = NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(sessionCookie, await createSession(), {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:" || !!process.env.VERCEL,
      sameSite: "strict",
      path: "/",
      maxAge: sessionSeconds,
    });
    return response;
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const response = NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(sessionCookie, "", {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:" || !!process.env.VERCEL,
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    return failure(error);
  }
}
