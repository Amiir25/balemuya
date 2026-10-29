"use server";

import { requireRole } from "@/lib/dal";
import { getBookingById, updateBookingStatus } from "@/lib/db";

export type ActionResult = { ok: true } | { ok: false; error: string };

// Not exported, so it is not a public action itself
async function respond(bookingId: string, status: "accepted" | "declined"): Promise<ActionResult> {
  // Role check
  const user = await requireRole("provider");

  // Find it
  const booking = await getBookingById(String(bookingId));

  // Ownership check. Missing and "not yours" give the same answer.
  if (!booking || booking.provider.userId !== user.id) {
    return { ok: false, error: "Booking not found." };
  }

  // State checks
  if (booking.provider.status !== "approved") {
    return { ok: false, error: "Your profile must be approved first." };
  }
  if (booking.status !== "pending") {
    return { ok: false, error: "This request was already answered." };
  }

  // Only now change anything
  await updateBookingStatus(booking.id, status);
  return { ok: true };
}

export async function acceptBooking(bookingId: string) {
  return respond(bookingId, "accepted");
}

export async function declineBooking(bookingId: string) {
  return respond(bookingId, "declined");
}