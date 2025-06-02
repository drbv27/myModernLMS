// src/middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware"; // Asegúrate que la ruta al import sea correcta

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, si no quieres que el middleware las procese)
     * - auth (rutas de autenticación como /login, /signup, /auth/callback, si las quieres excluir)
     * Feel free to modify this pattern to include more paths or exclude others.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
