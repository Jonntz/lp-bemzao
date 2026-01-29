// src/middleware.ts (ou middleware.ts na raiz)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    // 1. Verifica se a rota é protegida (/admin)
    if (request.nextUrl.pathname.startsWith("/admin")) {

        // 2. Tenta pegar o cookie da sessão
        const sessionCookie = request.cookies.get("session")?.value;

        // 3. Se não tem cookie, manda pro login
        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // 4. Se tem cookie, verifica se é válido
        try {
            await decrypt(sessionCookie);
            return NextResponse.next(); // Tudo ok, pode passar
        } catch (error) {
            // Cookie inválido ou expirado
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"], // Protege tudo que começa com /admin
};