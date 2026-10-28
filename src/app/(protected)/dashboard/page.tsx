import { requireRole, getMyProviderBookings } from "@/lib/dal";
import MyBookings from "@/components/MyBookings";

export default async function DashboardPage() {
  const user = await requireRole("customer", "provider");

  if (user.role === "provider") {
    const bookings = await getMyProviderBookings();
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Provider dashboard</h1>
        <p className="mt-2 text-gray-600">
          Signed in as {user.name}. {bookings.length} requests. (Stage 9 builds this list.)
        </p>
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