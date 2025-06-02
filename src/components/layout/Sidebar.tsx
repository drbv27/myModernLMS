// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Para resaltar el enlace activo
import {
  Home,
  BookMarked,
  Users,
  Compass,
  UserCircle,
  Settings,
  LogOutIcon,
  XIcon,
} from "lucide-react"; // Iconos
import { cn } from "@/lib/utils"; // Utilidad de Shadcn para classnames condicionales (si la tienes)
// Si no la tienes, puedes instalarla o usar template literals.
// Para instalar: npx shadcn-ui@latest add utils (si no se añadió con init)
import { useAuth } from "@/context/AuthContext"; // <--- IMPORTA useAuth
import { Button } from "@/components/ui/button"; // Para el botón de cerrar

// Definimos los enlaces de la sidebar
const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Mis Cursos", href: "/my-courses", icon: BookMarked },
  { title: "Comunidad", href: "/feed", icon: Users }, // Feed Social
  { title: "Explorar Cursos", href: "/courses", icon: Compass },
  { title: "Mi Perfil", href: "/profile", icon: UserCircle },
  // { title: "Configuración", href: "/settings", icon: Settings }, // Para el futuro
];

export default function Sidebar() {
  const pathname = usePathname(); // Hook para obtener la ruta actual
  const { isMobileSidebarOpen, toggleMobileSidebar } = useAuth();

  return (
    <>
      {/* Overlay para cerrar la sidebar en móvil al hacer clic fuera */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm sm:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-60 h-screen bg-card border-r border-border transition-transform duration-300 ease-in-out sm:translate-x-0",
          // Si está abierta en móvil, se muestra. Si no, se oculta.
          // En pantallas 'sm' y mayores (sm:translate-x-0), siempre está visible y en su sitio.
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          // La clase sm:translate-x-0 asegura que en pantallas grandes esté siempre visible
          // independientemente del estado de isMobileSidebarOpen (que es para móviles).
          // Para que la sidebar esté debajo de la navbar fija, ajustamos top y h:
          // "fixed top-16 left-0 z-40 w-60 h-[calc(100vh-4rem)] ..."
        )}
        // Corrección para que la sidebar esté debajo de la navbar y no ocupe toda la altura desde el top 0
        // cuando está en modo móvil y se desliza desde la izquierda.
        // Mantenemos h-screen para el overlay, pero la sidebar visual debe estar debajo de la navbar.
        // Haremos el ajuste en el layout para que el 'pt-16' afecte al contenedor de sidebar+main.
        // Y la sidebar, si se muestra en móvil, debe tener su propio padding superior o posicionarse debajo.

        // Vamos a ajustar el top y height para que la sidebar en móvil también empiece debajo de la navbar
        style={{ top: "4rem", height: "calc(100vh - 4rem)" }} // 4rem es h-16
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Botón para cerrar la sidebar en móvil, visible solo en la sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 sm:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Cerrar menú de navegación"
          >
            <XIcon className="h-6 w-6 text-muted-foreground" />
          </Button>

          <nav className="space-y-2 mt-10 sm:mt-0">
            {" "}
            {/* Margen superior en móvil para el botón X */}
            {sidebarNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => {
                  // Cierra la sidebar al hacer clic en un enlace en móvil
                  if (isMobileSidebarOpen) {
                    toggleMobileSidebar();
                  }
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
