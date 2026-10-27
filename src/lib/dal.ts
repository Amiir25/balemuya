import { cache } from "react";
import "server-only";
import { getSession } from "./session";
import { getUserById } from "./db";
import { Role } from "./jwt";

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