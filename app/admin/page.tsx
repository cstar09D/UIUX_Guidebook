import { requireAdminPage } from "@/lib/admin-access";
import Admin from "@/components/Admin";
import { getAdminState } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  await requireAdminPage();
  return (
    <Admin
      cloud={!!process.env.TURSO_DATABASE_URL}
      loginEnabled={!!process.env.ADMIN_PASSWORD_HASH}
      initialState={await getAdminState()}
    />
  );
}
