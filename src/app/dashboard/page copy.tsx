// src/app/dashboard/page.tsx
"use client"; // Necesario para usar hooks

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { session, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando la sesión y no hay sesión (usuario no logueado),
    // redirigir a la página de login.
    if (!isLoading && !session) {
      router.push("/login?next=/dashboard"); // Opcional: 'next' para redirigir de vuelta al dashboard después del login
    }
  }, [session, isLoading, router]);

  // Muestra un estado de carga mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        {" "}
        {/* Altura menos la navbar */}
        <p>Cargando Dashboard...</p> {/* O un spinner */}
      </div>
    );
  }

  // Si no hay sesión después de cargar (aunque el useEffect ya debería haber redirigido),
  // no mostrar nada o un mensaje para evitar flash de contenido.
  if (!session) {
    // Este return es un fallback, el useEffect debería manejar la redirección antes.
    return null;
  }

  // Si hay sesión, muestra el contenido del dashboard
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        ¡Bienvenido de nuevo, {profile?.full_name || session.user?.email}! Aquí
        encontrarás tus cursos y tu actividad.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        (Dashboard en Construcción)
      </p>

      {/* Contenido del dashboard irá aquí */}
    </div>
  );
}
