import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/dal";
import { createBooking, getBookableProvider, getBookingsByCustomer } from "@/lib/db";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// POST
export async function POST(request: Request) {
  // Who is asking, and are they allowed?
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to book." }, { status: 401 });
  }
  if (user.role !== "customer") {
    return NextResponse.json({ error: "Only customers can book." }, { status: 403 });
  }

  // Is the body valid JSON?
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const providerId = str(body.providerId);
  const date = str(body.date);       // "2026-11-02"
  const time = str(body.time);       // "14:30"
  const address = str(body.address);
  const notes = str(body.notes);

  // 4. Validate every field
  const errors: Record<string, string> = {};

  // "Today" in Addis Ababa, as YYYY-MM-DD
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Addis_Ababa" });
  const realDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;

  if (!realDate) errors.date = "Choose a valid date.";
  else if (date < today) errors.date = "The date can't be in the past.";

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) errors.time = "Choose a valid time.";
  if (address.length < 5 || address.length > 200) {
    errors.address = "Enter an address (5 to 200 characters).";
  }
  if (notes.length > 500) errors.notes = "Notes can be at most 500 characters.";
  if (!providerId) errors.providerId = "Missing provider.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // Is the provider real and approved?
  const provider = await getBookableProvider(providerId);
  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }

  // Save. customerId comes from the session, never from the body.
  const booking = await createBooking({
    customerId: user.id,
    providerId: provider.id,
    scheduledDate: new Date(`${date}T00:00:00Z`),
    scheduledTime: time,
    address,
    notes: notes || undefined,
  });

  return NextResponse.json({ id: booking.id, status: booking.status }, { status: 201 });
}

// GET
export async function GET() {
  // Who is asking, and are they allowed?
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }
  if (user.role !== "customer") {
    return NextResponse.json({ error: "Only customers have bookings here." }, { status: 403 });
  }

  // Only THIS customer's bookings. The id comes from the session.
  const bookings = await getBookingsByCustomer(user.id);

  // Send only what the UI needs
  return NextResponse.json(
    bookings.map((b) => ({
      id: b.id,
      status: b.status,
      scheduledDate: b.scheduledDate.toISOString().slice(0, 10),
      scheduledTime: b.scheduledTime,
      address: b.address,
      notes: b.notes,
      createdAt: b.createdAt.toISOString(),
      provider: {
        id: b.provider.id,
        name: b.provider.user.name,
        service: b.provider.service.name,
      },
    }))
  );
}