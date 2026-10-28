import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Read and verify the token
    const token = request.cookies.get("session")?.value;
    const session = await verifyToken(token);

    // Not logged in (or forged/expired token): go to login
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Non-admins go to /
    if (pathname.startsWith("/admin") && session.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
    }

    // Everything is fine
    return NextResponse.next();
}

// Matcher (Run the middleware on these paths only)
export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};