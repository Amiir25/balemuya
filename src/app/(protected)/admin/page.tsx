// src/app/admin/page.tsx
import { requireRole } from "@/lib/dal";

export default async function AdminPage() {
  const user = await requireRole("admin");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-2 text-gray-600">Signed in as {user.name}.</p>
    </main>
  );
}