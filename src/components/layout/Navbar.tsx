// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOutIcon,
  UserCircle,
  Settings,
  Menu as MenuIcon,
} from "lucide-react"; // Iconos

export default function Navbar() {
  const {
    session,
    profile,
    logout,
    isLoading,
    toggleMobileSidebar,
    isMobileSidebarOpen,
  } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirige a la Landing Page después del logout
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto flex justify-between items-center h-full px-4">
          <div className="text-xl font-semibold text-transparent bg-muted animate-pulse rounded-md w-24 h-6"></div>
          <div className="animate-pulse h-8 w-8 bg-muted rounded-full"></div>{" "}
          {/* Placeholder para avatar */}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 dark:bg-custom-eggplant/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        {/* Botón Hamburguesa para Móvil (a la izquierda del logo) */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden mr-2" // Se muestra solo en pantallas pequeñas (antes de 'sm')
          onClick={toggleMobileSidebar}
          aria-label="Abrir menú de navegación"
        >
          <MenuIcon className="h-6 w-6 text-foreground" />
        </Button>

        <Link
          href="/"
          className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
        >
          Mi LMS
        </Link>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* ... (lógica para mostrar DropdownMenu o botones de Login/Signup se mantiene igual) ... */}
          {session && profile ? (
            <DropdownMenu>
              {/* ... DropdownMenuTrigger y DropdownMenuContent ... */}
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <AvatarImage
                      src={profile.avatar_url || undefined}
                      alt={profile.full_name || "Avatar"}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {(profile.full_name || session.user?.email || "U")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {profile.full_name || "Usuario"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/dashboard");
                    if (isMobileSidebarOpen) toggleMobileSidebar();
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/profile");
                    if (isMobileSidebarOpen) toggleMobileSidebar();
                  }}
                >
                  <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => { router.push('/settings'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}>
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Configuración</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 hover:!text-red-600 dark:hover:!text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" legacyBehavior>
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/signup" legacyBehavior>
                <Button variant="default" size="sm">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
