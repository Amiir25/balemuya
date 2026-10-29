import Link from "next/link";
import { requireRole } from "@/lib/dal";
import { getProviderByUserId, getServices } from "@/lib/db";
import ProfileEditForm from "@/app/(public)/providers/components/ProfileEditForm";

export const metadata = { title: "Edit profile | Fixer" };

const statusStyle = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
} as const;

export default async function ProfilePage() {
  const user = await requireRole("provider");
  const [provider, services] = await Promise.all([
    getProviderByUserId(user.id),
    getServices(), // cached
  ]);

  if (!provider) {
    return <main className="p-8">No provider profile found for this account.</main>;
  }

  const status = provider.status as keyof typeof statusStyle;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Edit profile</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle[status]}`}>
          {provider.status}
        </span>
      </div>

      {provider.status === "approved" && (
        <Link href={`/providers/${provider.id}`} className="mt-1 inline-block text-sm underline">
          View public profile
        </Link>
      )}

      <div className="mt-6">
        <ProfileEditForm
          services={services.map((s) => ({ id: s.id, name: s.name }))}
          initial={{
            serviceId: provider.serviceId,
            address: provider.address,
            headline: provider.headline,
            bio: provider.bio,
            priceFrom: String(provider.priceFrom),
            priceUnit: provider.priceUnit,
          }}
        />
      </div>
    </main>
  );
}