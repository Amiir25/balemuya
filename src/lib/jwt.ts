import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export type Role = "customer" | "provider" | "admin";
export type SessionPayload = { userId: string; role: Role };

// Create a signed token containing the payload
export async function signToken(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

// Check the signature. Returns the payload, or null of the tokenis missing, forged or expired.
export async function verifyToken(token?: string) {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}