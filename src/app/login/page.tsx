// src/app/login/page.tsx
"use client";

import { useEffect, useState } from "react"; // Añade useState
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
import { toast } from "sonner"; // Para notificaciones

export default function LoginPage() {
  const {
    session,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithEmailPassword,
    isLoading,
  } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && session) {
      router.push("/dashboard"); // Redirige a la página de dashboard si ya está logueado
    }
  }, [session, isLoading, router]);

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    toast.loading("Iniciando sesión...");

    const { error } = await loginWithEmailPassword({ email, password });

    toast.dismiss(); // Cierra el toast de "cargando"
    if (error) {
      // El toast de error específico ya se maneja dentro de loginWithEmailPassword en AuthContext
      // No es necesario añadir otro aquí a menos que quieras un mensaje más genérico.
    } else {
      // Si el login es exitoso, el useEffect de arriba debería manejar la redirección al dashboard
      // ya que la sesión cambiará y activará el efecto.
      // AuthContext también muestra un toast de éxito.
    }
    setIsSubmitting(false);
  };

  if (isLoading || (!isLoading && session)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Accede a tu Cuenta
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Elige tu método preferido para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button
              onClick={loginWithGoogle}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Continuar con Google
            </Button>
            <Button
              onClick={loginWithMicrosoft}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Continuar con Microsoft
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O inicia sesión con tu correo
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Iniciando sesión..."
                : "Iniciar Sesión con Correo"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
          {/* Podríamos añadir un enlace de "¿Olvidaste tu contraseña?" aquí más adelante */}
        </CardFooter>
      </Card>
    </div>
  );
}
