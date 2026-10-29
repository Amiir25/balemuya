"use server";

import { requireRole } from "@/lib/dal";
import { getBookingById, updateBookingStatus } from "@/lib/db";
import { updateTag } from "next/cache";
import { getProviderByUserId, serviceExists, updateProviderProfile } from "@/lib/db";
import { validateProfile, type ProfileField } from "@/lib/validation";

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


// Profile update

export type ProfileState =
  | {
    errors?: Partial<Record<ProfileField, string>>;
    values?: Record<ProfileField, string>;
    formError?: string;
    saved?: boolean;
  }
  | undefined;

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  // 1. Role check
  const user = await requireRole("provider");

  // 2. Read only the fields we allow
  const read = (k: string) => String(formData.get(k) ?? "").trim();
  const values: Record<ProfileField, string> = {
    serviceId: read("serviceId"),
    address: read("address"),
    headline: read("headline"),
    bio: read("bio"),
    priceFrom: read("priceFrom"),
    priceUnit: read("priceUnit"),
  };

  // 3. Validate
  const { errors, price } = validateProfile(values);
  if (Object.keys(errors).length > 0) return { errors, values };
  if (!(await serviceExists(values.serviceId))) {
    return { errors: { serviceId: "Choose your service." }, values };
  }

  // 4. Find THIS user's provider. No id comes from the client.
  const provider = await getProviderByUserId(user.id);
  if (!provider) {
    return { formError: "Provider profile not found.", values };
  }

  // 5. Update the whitelisted fields only
  await updateProviderProfile(provider.id, {
    serviceId: values.serviceId,
    address: values.address,
    headline: values.headline,
    bio: values.bio,
    priceFrom: price,
    priceUnit: values.priceUnit,
  });

  // 6. Expire the public caches that show this provider
  updateTag("providers");
  updateTag("services");

  return { saved: true, values };
}