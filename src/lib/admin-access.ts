import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { ContentError } from "./content";
import { isLocalRequest } from "./local-request.mjs";
import {
  authConfigured,
  sessionCookie,
  validSession,
} from "./admin-session.mjs";
export function localAdminAllowed(requestHeaders: Headers) {
  return (
    !process.env.VERCEL &&
    !process.env.TURSO_DATABASE_URL &&
    !process.env.ADMIN_PASSWORD_HASH &&
    !process.env.ADMIN_SESSION_SECRET &&
    isLocalRequest(requestHeaders)
  );
}
export function requireSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host=request.headers.get("host");
  const expectedOrigin=`${process.env.VERCEL ? "https:" : request.nextUrl.protocol}//${host}`;
  if (!host || (origin && origin !== expectedOrigin))
    throw new ContentError("같은 사이트에서 다시 요청하세요.", 403);
  if (!["GET", "HEAD"].includes(request.method) && !origin)
    throw new ContentError("요청 출처를 확인할 수 없습니다.", 403);
}
export async function requireAdmin(request: NextRequest) {
  if (localAdminAllowed(request.headers)) return;
  if (!authConfigured())
    throw new ContentError("관리자 로그인이 설정되지 않았습니다.", 503);
  requireSameOrigin(request);
  if (!(await validSession(request.cookies.get(sessionCookie)?.value)))
    throw new ContentError("관리자 로그인이 필요합니다.", 401);
}
export async function requireAdminPage() {
  if (localAdminAllowed(await headers())) return;
  if (
    !authConfigured() ||
    !(await validSession((await cookies()).get(sessionCookie)?.value))
  )
    redirect("/admin/login");
}
