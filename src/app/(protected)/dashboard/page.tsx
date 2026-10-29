import { requireRole, getMyProviderBookings } from "@/lib/dal";
import MyBookings from "@/components/MyBookings";
import ProviderRequests from "@/app/(public)/providers/components/ProviderRequests";
import { getProviderByUserId } from "@/lib/db";

export default async function DashboardPage() {
  const user = await requireRole("customer", "provider");

  if (user.role === "provider") {
  const provider = await getProviderByUserId(user.id);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">Provider dashboard</h1>

      {provider?.status === "pending" && (
        <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Your profile is awaiting admin approval. Customers can't see it yet.
        </p>
      )}
      {provider?.status === "suspended" && (
        <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          Your profile is suspended and hidden from customers.
        </p>
      )}

      <h2 className="mt-8 text-lg font-semibold">Booking requests</h2>
      <ProviderRequests userId={user.id} />
    </main>
  );
}

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">My bookings</h1>
      <p className="mt-1 text-gray-600">Requests you've sent to providers.</p>
      <MyBookings userId={user.id} />
    </main>
  );
}