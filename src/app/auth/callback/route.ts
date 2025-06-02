// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // CAMBIO AQUÍ: Destino por defecto es /dashboard
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // CAMBIO AQUÍ: Valor por defecto seguro es /dashboard
      let redirectUrl = `${origin}/dashboard`;

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
          // Si no es del mismo origen, se mantiene el redirectUrl a /dashboard (establecido arriba).
        } catch (e) {
          // Si 'next' no es una URL válida, se mantiene el redirectUrl a /dashboard.
          console.warn(
            `Parámetro 'next' inválido o malformado para redirección: ${next}, usando /dashboard`
          );
        }
      }
      return NextResponse.redirect(redirectUrl);
    }

    console.error("OAuth callback Supabase error:", error.message, error);
  } else {
    console.error("OAuth callback error: Missing code in searchParams.");
  }

  const errorDescription =
    searchParams.get("error_description") ||
    "OAuth callback failed due to missing code or an exchange error.";
  const errorRedirectUrl = new URL("/auth/auth-code-error", origin);
  errorRedirectUrl.searchParams.set("error_description", errorDescription);
  return NextResponse.redirect(errorRedirectUrl.toString());
}
