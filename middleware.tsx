import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAccessToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return NextResponse.redirect(new URL('/connexion', request.url));
    }
    else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/",
        "/profil/:path*",
        "/taches/:path*",
    ]
}