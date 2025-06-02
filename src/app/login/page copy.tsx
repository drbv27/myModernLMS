// src/app/login/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// Para iconos, puedes usar lucide-react. Ej: import { Mail, Lock, Chrome, Landmark } from 'lucide-react';
// Por ahora usaremos texto para los botones de OAuth.

export default function LoginPage() {
  const { session, loginWithGoogle, loginWithMicrosoft, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && session) {
      router.push("/dashboard"); // Redirige a la página principal o dashboard si ya está logueado
    }
  }, [session, isLoading, router]);

  if (isLoading || (!isLoading && session)) {
    // Muestra un loader o nada mientras se verifica la sesión o se redirige
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p> {/* O un spinner/loader más elegante */}
      </div>
    );
  }

  return (
    // Fondo general de la página, usa el --background de globals.css
    <div className="flex items-center justify-center p-4">
      {/* Card usa --card y --card-foreground de globals.css */}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          {/* Título principal puede usar el foreground general o un color específico */}
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Accede a tu Cuenta
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Elige tu método preferido para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {/* Botones de OAuth (variant="outline") usarán los colores de borde/texto definidos */}
            <Button
              onClick={loginWithGoogle}
              variant="outline"
              className="w-full"
            >
              Continuar con Google
            </Button>
            <Button
              onClick={loginWithMicrosoft}
              variant="outline"
              className="w-full"
            >
              Continuar con Microsoft
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" /> {/* Usa --border */}
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {" "}
                {/* bg-card para que coincida con el fondo de la tarjeta */}O
                inicia sesión con tu correo
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* ... Labels usan --foreground, Inputs usan --input y --ring ... */}
            <Button type="submit" className="w-full" disabled>
              {" "}
              {/* Botón deshabilitado */}
              Iniciar Sesión con Correo
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            ¿No tienes una cuenta? {/* Enlace usa --primary */}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
