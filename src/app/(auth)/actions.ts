"use server"

import { createUser, getUserByEmail } from "@/lib/db";
import type { Role } from "@/lib/jwt";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export type SignupState =
    | {
        errors?: { name?: string; email?: string; password?: string; phone?: string };
        values?: { name: string; email: string; phone: string };
    }
    | undefined;

export type LoginState =
    | { error?: string; values?: { email: string } }
    | undefined;

// A throwaway hash, used so a missing user costs the same time as a wrong password
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10)

// Signup
export async function signup(
    prevState: SignupState,
    formData: FormData
): Promise<SignupState> {
    // Read the values
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const phone = String(formData.get("phone") ?? "").replace(/[\s-]/g, "");

    // Validate
    const errors: NonNullable<SignupState>["errors"] = {};
    if (name.length < 2) errors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Please enter a valid email.";
    if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    if (!/^(\+251|0)[79]\d{8}$/.test(phone)) {
        errors.phone = "Enter a valid Ethiopian number, like 0911223344.";
    }

    // Send the typed values back, so the form doesn't wipe them
    const values = { name, email, phone };
    if (Object.keys(errors).length > 0) return { errors, values };

    // Is the email already taken?
    const existing = await getUserByEmail(email);
    if (existing) {
        return { errors: { email: "This email is already registered." }, values };
    }

    // Hash the password and create the user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash, role: "customer", phone });

    // Log them in
    await createSession(user.id, "customer");

    // Go home
    redirect("/");
}


// Login
export async function Login(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    // Read the values
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const values = { email };

    // Both fields are required
    if (!email || !password) {
        return { error: "Please enter your email and password.", values };
    }

    // Look up the user, then compare. Always run one compare.
    const user = await getUserByEmail(email);
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    // One vague message for every failure
    if (!user || !valid) {
        return { error: "Incorrect email or password.", values };
    }

    // Log them in
    await createSession(user.id, user.role as Role);

    // 7. Redirect each role to the right place
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
}


// Logout
export async function logout() {
    await deleteSession();
    redirect("/login");
}