// src/app/signup/page.tsx
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

export default function SignupPage() {
  const { session, loginWithGoogle, loginWithMicrosoft, isLoading } = useAuth(); // Reutilizamos los logins OAuth
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && session) {
      router.push("/dashboard"); // Redirige si ya está logueado
    }
  }, [session, isLoading, router]);

  if (isLoading || (!isLoading && session)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  // Aquí iría la lógica de signup con email/password en el futuro
  // const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   // Lógica de signup...
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Crea tu Cuenta
          </CardTitle>
          <CardDescription className="mt-2">
            Únete a nuestra plataforma. Elige tu método preferido.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button
              onClick={loginWithGoogle} // OAuth también sirve para registrarse
              variant="outline"
              className="w-full"
            >
              Registrarse con Google
            </Button>
            <Button
              onClick={loginWithMicrosoft} // OAuth también sirve para registrarse
              variant="outline"
              className="w-full"
            >
              Registrarse con Microsoft
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O regístrate con tu correo
              </span>
            </div>
          </div>

          {/* Formulario de Email/Contraseña para Registro (lógica pendiente) */}
          {/* <form onSubmit={handleEmailSignup} className="space-y-4"> */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Tu Nombre Completo"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled
              />
            </div>
            <Button type="submit" className="w-full" disabled>
              Crear Cuenta con Correo
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia Sesión aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
