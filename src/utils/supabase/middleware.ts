// src/utils/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Esta respuesta se crea primero. Las cookies actualizadas por Supabase
  // se aplicarán a esta respuesta, y también a las cookies de la solicitud
  // para que estén disponibles para los Server Components.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // request.cookies.set(name, value); // Esta línea podría ser problemática o innecesaria si solo leemos
            // y la respuesta se encarga de enviar las nuevas cookies.
            // La documentación y ejemplos varían, pero @supabase/ssr
            // está diseñado para que supabase.auth.getUser() actualice
            // el estado interno y las cookies de `response`.
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANTE: Evitar escribir lógica entre createServerClient y supabase.auth.getUser().
  // Ver "Insight 8" o fuentes del informe.
  // Refrescar la sesión del usuario si es necesario.
  // Esto también actualiza las cookies en el objeto `response` si la sesión ha cambiado.
  await supabase.auth.getUser();

  // Aquí podrías añadir lógica de protección de rutas si lo deseas,
  // verificando el usuario y redirigiendo si no está autenticado y la ruta es protegida.
  // Ejemplo (adaptado de):
  // const { data: { user } } = await supabase.auth.getUser(); // Obtener de nuevo o usar el resultado anterior
  // if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  return response;
}
