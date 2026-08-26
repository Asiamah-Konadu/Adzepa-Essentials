import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

// Route protection for /admin/** (except /admin/login) happens in
// src/middleware.ts, which redirects unauthenticated requests before this
// layout ever renders. This layout just decides whether to show the sidebar.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = await getAdminSession();

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-paper">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 min-w-0 p-5 md:p-8">{children}</div>
    </div>
  );
}
