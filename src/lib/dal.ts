import { cache } from "react";
import "server-only";
import { getSession } from "./session";
import { getBookingsByCustomer, getBookingsByProvider, getProviderById, getProviderByUserId, getUserById } from "./db";
import { Role } from "./jwt";
import { redirect } from "next/navigation";

// dal (data access layer): helper function to get current user data
// Returns { id, name, role } for the logged-in user, or null
// cache() = computed once per request, however many components call it

export const getCurrentUser = cache(async () => {
    const session = await getSession();
    if (!session)return null;

    const user = await getUserById(session.userId);
    if (!user) return null;     // token is valid, but the user no longer exists

    return { id: user.id, name: user.name, role: user.role as Role };
});


// Require role for pages and Server Actions. Returns the user or redirects away.
export async function requireRole(...allowed: Role[]) {
    const user = await getCurrentUser();

    if (!user) redirect("/login");   // not logged in
    if (!allowed.includes(user.role)) redirect("/");   // wrong role

    return user;
}

// ============= Safe functions =============

// Provider's own bookings
export async function getMyProviderBookings() {
    const user = await requireRole("provider");
    const provider = await getProviderByUserId(user.id);

    if (!provider) return [];
    return getBookingsByProvider(provider.id);
}

// Customer's own bookings
export async function getMyCustomerBookings() {
    const user = await requireRole("customer");
    return getBookingsByCustomer(user.id);
}