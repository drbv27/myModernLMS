// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Importa la utilidad del servidor

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Si se proporciona 'next' en los parámetros de búsqueda, úsalo para la redirección;
  // de lo contrario, redirige a la raíz.
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient(); // Crea el cliente Supabase del lado del servidor
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Construye la URL de redirección segura
      let redirectUrl = `${origin}/dashboard`; // Valor por defecto seguro es /dashboard

      if (next.startsWith("/")) {
        // Si 'next' es una ruta relativa, la concatenamos al origen.
        redirectUrl = `${origin}${next}`;
      } else {
        // Si 'next' podría ser una URL absoluta, la validamos.
        try {
          const nextUrl = new URL(next);
          if (nextUrl.origin === origin) {
            // Es una URL absoluta pero del mismo origen, es segura.
            redirectUrl = nextUrl.toString();
          }
          // Si no es del mismo origen, se mantiene el redirectUrl por defecto (raíz).
        } catch (e) {
          // Si 'next' no es una URL válida, se mantiene el redirectUrl por defecto.
          console.warn(
            `Parámetro 'next' inválido o malformado para redirección: ${next}`
          );
        }
      }
      return NextResponse.redirect(redirectUrl);
    }

    // Loguear el error específico de Supabase si lo hay
    console.error("OAuth callback Supabase error:", error.message, error);
  } else {
    // Loguear si no se encuentra el código
    console.error("OAuth callback error: Missing code in searchParams.");
  }

  // Si hay un error en el intercambio de código o no hay código, redirigir a una página de error
  const errorDescription =
    searchParams.get("error_description") ||
    "OAuth callback failed due to missing code or an exchange error.";
  const errorRedirectUrl = new URL("/auth/auth-code-error", origin); // Página de error personalizada
  errorRedirectUrl.searchParams.set("error_description", errorDescription);
  return NextResponse.redirect(errorRedirectUrl.toString());
}
