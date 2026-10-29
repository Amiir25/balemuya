import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/dal";
import { getBookingsByProvider, getProviderByUserId } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (user.role !== "provider") {
    return NextResponse.json({ error: "Providers only." }, { status: 403 });
  }

  const provider = await getProviderByUserId(user.id);
  if (!provider) return NextResponse.json([]);

  const bookings = await getBookingsByProvider(provider.id);

  return NextResponse.json(
    bookings.map((b) => ({
      id: b.id,
      status: b.status,
      scheduledDate: b.scheduledDate.toISOString().slice(0, 10),
      scheduledTime: b.scheduledTime,
      address: b.address,
      notes: b.notes,
      createdAt: b.createdAt.toISOString(),
      customer: {
        name: b.customer.name,
        // phone is shared only after the provider accepts
        phone: b.status === "accepted" ? b.customer.phone : null,
      },
    }))
  );
}