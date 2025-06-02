// src/app/signup/page.tsx
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

export default function SignupPage() {
  const {
    session,
    loginWithGoogle,
    loginWithMicrosoft,
    signUpWithEmailPassword,
    isLoading,
  } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && session) {
      router.push("/dashboard"); // Redirige si ya está logueado
    }
  }, [session, isLoading, router]);

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    toast.loading("Creando tu cuenta...");

    if (!fullName.trim()) {
      toast.dismiss();
      toast.error("Por favor, ingresa tu nombre completo.");
      setIsSubmitting(false);
      return;
    }

    // Podrías añadir validación de fortaleza de contraseña aquí si lo deseas

    const { error } = await signUpWithEmailPassword({
      email,
      password,
      fullName,
    });

    toast.dismiss(); // Cierra el toast de "cargando"
    if (error) {
      // El toast de error específico ya se maneja dentro de signUpWithEmailPassword en AuthContext
      // pero podríamos añadir uno más genérico aquí o dejar que el AuthContext lo maneje.
      // toast.error(`Error en el registro: ${error.message}`);
    } else {
      // El toast de éxito o "revisa tu email" ya se maneja en AuthContext
      // Podríamos redirigir aquí si la confirmación de email está desactivada
      // y el usuario ya tiene una sesión, o mostrar un mensaje genérico.
      // Por ahora, AuthContext muestra "Revisa tu email" o "Registro exitoso".
      // Si hay sesión inmediata (confirmación desactivada), el useEffect de arriba redirigirá.
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
    <div className="flex items-center justify-center py-2 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Crea tu Cuenta
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Únete a nuestra plataforma. Elige tu método preferido.
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
              Registrarse con Google
            </Button>
            <Button
              onClick={loginWithMicrosoft}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
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

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Tu Nombre Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Correo Electrónico <span className="text-red-500">*</span>
              </Label>
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
              <Label htmlFor="password">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••• (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} // Supabase requiere mín. 6 caracteres por defecto
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta..." : "Crear Cuenta con Correo"}
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
