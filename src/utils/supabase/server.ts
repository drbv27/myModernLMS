// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies(); // Obtiene la instancia del almacén de cookies de Next.js

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); // Devuelve todas las cookies del almacén
        },
        setAll(cookiesToSet) {
          try {
            // Itera sobre las cookies a establecer y las aplica al almacén
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Este error puede ocurrir si `setAll` se llama desde un Server Component.
            // Puede ignorarse si se tiene un middleware que refresca las sesiones de usuario.
            // En el contexto de un Route Handler (como el callback de OAuth),
            // esta rama `catch` es menos probable que sea relevante para errores de "solo lectura",
            // ya que los Route Handlers sí pueden modificar cookies.
            // Sin embargo, es una buena práctica mantenerlo por consistencia con la documentación oficial.
            console.error("Error setting cookies in server client:", error);
          }
        },
      },
    }
  );
}
