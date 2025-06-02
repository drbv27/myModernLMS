// src/components/layout/AuthenticatedAppShell.tsx
"use client";

import Sidebar from "./Sidebar"; // Importa tu componente Sidebar
import { useAuth } from "@/context/AuthContext";

export default function AuthenticatedAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading } = useAuth();

  // Si la sesión aún está cargando, podríamos mostrar un loader global aquí
  // o simplemente no hacer nada y dejar que las páginas individuales manejen su estado de carga.
  // Por ahora, si está cargando o no hay sesión, simplemente renderizamos los children
  // sin la estructura de Sidebar + Main.
  if (isLoading || !session) {
    // Para páginas como Login, Signup, Landing, que no necesitan la Sidebar,
    // simplemente se renderizarán ellas mismas.
    // Para páginas protegidas que intenten renderizar sin sesión,
    // su propia lógica de redirección (como en DashboardPage o ProfilePage) actuará.
    return <>{children}</>;
  }

  // Si hay una sesión y la carga ha terminado, renderizamos la Sidebar
  // y el contenido principal (<main>) con el margen izquierdo apropiado.
  return (
    <div className="flex flex-1 overflow-hidden">
      {" "}
      {/* Este div ocupa el espacio debajo de la Navbar */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 ml-0 sm:ml-60">
        {/* ml-0 sm:ml-60: Margen izquierdo en pantallas 'sm' y mayores para dejar espacio a la Sidebar (w-60) */}
        {children}
      </main>
    </div>
  );
}
