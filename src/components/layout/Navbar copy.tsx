// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// Para el futuro Dropdown y Avatar (necesitarías añadirlos con Shadcn/ui)
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { LayoutDashboard, LogOutIcon, UserCircle } from 'lucide-react'; // Iconos de ejemplo

export default function Navbar() {
  const { session, profile, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Estado de carga de la Navbar
  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 dark:bg-custom-eggplant/80 backdrop-blur-md border-b dark:border-custom-plum/50 shadow-sm transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center h-full px-4">
          <Link
            href="/"
            className="text-xl font-semibold text-slate-900 dark:text-white"
          >
            Mi LMS
          </Link>
          <div className="animate-pulse h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 dark:bg-custom-eggplant/80 backdrop-blur-md border-b dark:border-custom-plum/50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        <Link
          href="/"
          className="text-xl font-semibold text-foreground hover:text-primary dark:hover:text-primary transition-colors"
        >
          Mi LMS
        </Link>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {session && profile ? (
            <>
              {/* Versión simple por ahora, luego podríamos usar DropdownMenu */}
              <span className="text-sm font-medium text-foreground/80 hidden sm:inline">
                Hola,{" "}
                {profile.full_name ||
                  session.user?.email?.split("@")[0] ||
                  "Usuario"}
              </span>
              <Link href="/dashboard" legacyBehavior>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  {/* <LayoutDashboard className="h-4 w-4 mr-2" /> */}
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                {/* <LogOutIcon className="h-4 w-4 sm:mr-2" /> */}
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </Button>

              {/* Ejemplo de DropdownMenu para el futuro (necesita 'npx shadcn-ui@latest add avatar dropdown-menu'):
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || "Avatar"} />
                      <AvatarFallback>{(profile.full_name || session.user.email || "U").substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.full_name || "Usuario"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile/settings')}> // Ruta de ejemplo
                     <UserCircle className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              */}
            </>
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
