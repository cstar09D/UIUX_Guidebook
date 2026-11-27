import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLogin from "@/components/AdminLogin";
import {
  authConfigured,
  sessionCookie,
  validSession,
} from "@/lib/admin-session.mjs";
export const dynamic = "force-dynamic";
export default async function LoginPage() {
  if (await validSession((await cookies()).get(sessionCookie)?.value))
    redirect("/admin");
  return <AdminLogin configured={authConfigured()} />;
}
