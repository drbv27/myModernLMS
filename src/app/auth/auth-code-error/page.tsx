// src/app/auth/auth-code-error/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react"; // Icono opcional

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorDescription = searchParams.get("error_description");
  const message = searchParams.get("message"); // Alternativa por si no hay 'error_description'

  const displayMessage =
    errorDescription ||
    message ||
    "Ha ocurrido un error desconocido durante la autenticación.";

  return (
    <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 dark:bg-red-900 p-3 rounded-full w-fit">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-red-700 dark:text-red-400">
            Error de Autenticación
          </CardTitle>
          <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
            Lo sentimos, no hemos podido completar el proceso de autenticación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-800/30 p-3 rounded-md border border-red-200 dark:border-red-700">
            <p className="text-sm text-red-700 dark:text-red-300 text-center">
              {displayMessage}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Intentar Iniciar Sesión de Nuevo
            </Button>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
          >
            Volver a la Página Principal
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
