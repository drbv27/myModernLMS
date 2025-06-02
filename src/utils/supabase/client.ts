// src/utils/supabase/client.ts
"use client"; // Indica que es para uso del lado del cliente

import { createBrowserClient } from "@supabase/ssr";

// La función que crea el cliente para el navegador
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
