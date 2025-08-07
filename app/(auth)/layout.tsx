import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/layout/MobileHeader";
import { getCurrentUser } from "@/lib/getSession";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getCurrentUser()
  if (!user) {
    // Optional: Redirect to login
    return <div>Redirecting...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-x-hidden">
        <MobileHeader user={user} />
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
