import "server-only";
import { cookies } from "next/headers";
import { signToken, verifyToken, type Role } from "@/lib/jwt";

const COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7;   // 7 days in seconds

// Called after a successful sign-up or login
export async function createSession(userId: string, role: Role) {
    const token = await signToken({ userId, role });
    const store = await cookies();
    store.set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE,
    });
}

// Called on logout
export async function deleteSession() {
    const store = await cookies();
    store.delete(COOKIE);
}

// Called anywhere to know the visitor. Returns { userId, role } or null
export async function getSession() {
    const store = await cookies();
    return verifyToken(store.get(COOKIE)?.value);
}