// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Asumimos que ya tienes el botón de Shadcn/ui

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-8 md:px-16 lg:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-white">
          Bienvenido a{" "}
          <span className="text-custom-eggplant dark:text-blue-400">
            Mi LMS Moderno
          </span>
        </h1>

        <p className="mt-3 text-lg sm:text-xl text-slate-600 dark:text-slate-300">
          Tu nueva plataforma para aprender y crecer.
        </p>
        <p className="mt-1 text-md text-slate-500 dark:text-slate-400">
          (Landing Page en Construcción)
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full gap-4">
          <Link href="/login" legacyBehavior>
            <Button variant="outline" size="lg">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/signup" legacyBehavior>
            <Button variant="default" size="lg">
              Registrarse
            </Button>
          </Link>
          {/* Más adelante podríamos añadir un enlace a explorar cursos si no se requiere login */}
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} Mi LMS Moderno. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
