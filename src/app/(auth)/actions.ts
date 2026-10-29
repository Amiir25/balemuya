"use server"

import { ADDRESSES, PRICE_UNITS } from "@/lib/constants";
import { createProviderAccount, createUser, getUserByEmail, serviceExists } from "@/lib/db";
import type { Role } from "@/lib/jwt";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Signup
export type SignupState =
    | {
        errors?: { name?: string; email?: string; password?: string; phone?: string };
        values?: { name: string; email: string; phone: string };
    }
    | undefined;

// Login
export type LoginState =
    | { error?: string; values?: { email: string } }
    | undefined;

// Provider Signup
type PField =
    | "name" | "email" | "phone" | "password" | "serviceId"
    | "address" | "headline" | "bio" | "priceFrom" | "priceUnit";

export type ProviderSignupState =
    | { errors?: Partial<Record<PField, string>>; values?: Partial<Record<Exclude<PField, "password">, string>> }
    | undefined;

// A throwaway hash, used so a missing user costs the same time as a wrong password
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10)

// ============== SIGNUP ============== //
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


// Only allow paths inside our own site
function safeNext(raw: string) {
    return raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : null;
}


// ============== LOGIN ============== //
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

    // Redirect each role to the right place
    const next = safeNext(String(formData.get("next") ?? ""));
    redirect(next ?? (user.role === "admin" ? "/admin" : "/dashboard"));
}


// ============== LOGOUT ============== //
export async function logout() {
    await deleteSession();
    redirect("/login");
}


// ============== PROVIDER SIGNUP ============== //
export async function signupProvider(
    prevState: ProviderSignupState,
    formData: FormData
): Promise<ProviderSignupState> {
    const read = (k: string) => String(formData.get(k) ?? "").trim();
    const values = {
        name: read("name"),
        email: read("email").toLowerCase(),
        phone: read("phone").replace(/[\s-]/g, ""),
        serviceId: read("serviceId"),
        address: read("address"),
        headline: read("headline"),
        bio: read("bio"),
        priceFrom: read("priceFrom"),
        priceUnit: read("priceUnit"),
    };
    const password = String(formData.get("password") ?? "");
    const price = Number(values.priceFrom);

    const errors: NonNullable<ProviderSignupState>["errors"] = {};
    if (values.name.length < 2) errors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Please enter a valid email.";
    if (!/^(\+251|0)[79]\d{8}$/.test(values.phone)) errors.phone = "Enter a valid Ethiopian number, like 0911223344.";
    if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    if (!values.serviceId) errors.serviceId = "Choose your service.";
    if (!(ADDRESSES as readonly string[]).includes(values.address)) errors.address = "Choose your area.";
    if (values.headline.length < 5 || values.headline.length > 80) errors.headline = "Headline must be 5 to 80 characters.";
    if (values.bio.length < 20 || values.bio.length > 600) errors.bio = "Bio must be 20 to 600 characters.";
    if (!Number.isInteger(price) || price < 50 || price > 100000) errors.priceFrom = "Enter a whole price between 50 and 100,000 ETB.";
    if (!(PRICE_UNITS as readonly string[]).includes(values.priceUnit)) errors.priceUnit = "Choose a unit.";

    if (Object.keys(errors).length > 0) return { errors, values };

    if (await getUserByEmail(values.email)) {
        return { errors: { email: "This email is already registered." }, values };
    }
    if (!(await serviceExists(values.serviceId))) {
        return { errors: { serviceId: "Choose your service." }, values };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createProviderAccount({
        user: { name: values.name, email: values.email, phone: values.phone, passwordHash },
        provider: {
            serviceId: values.serviceId,
            headline: values.headline,
            bio: values.bio,
            priceFrom: price,
            priceUnit: values.priceUnit,
            address: values.address,
        },
    });

    await createSession(user.id, "provider");
    redirect("/dashboard");
}