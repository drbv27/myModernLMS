// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // CardFooter no se estaba usando, lo quité de aquí
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  bio: string;
  linkedinUrl: string;
  twitterUrl: string;
  githubUrl: string;
}

export default function ProfilePage() {
  const {
    session,
    profile,
    isLoading: authIsLoading,
    refreshUserProfile,
  } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    phoneNumber: "",
    bio: "",
    linkedinUrl: "",
    twitterUrl: "",
    githubUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authIsLoading) {
      if (!session) {
        router.push("/login?next=/profile");
      } else if (profile) {
        setFormData({
          fullName: profile.full_name || "",
          phoneNumber: profile.phone_number || "",
          bio: profile.bio || "",
          linkedinUrl: profile.social_links?.linkedin || "",
          twitterUrl: profile.social_links?.twitter || "",
          githubUrl: profile.social_links?.github || "",
        });
      }
    }
  }, [session, profile, authIsLoading, router, refreshUserProfile]); // Añadí refreshUserProfile aquí por si cambia y queremos recargar

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Error de autenticación. Por favor, inicia sesión de nuevo.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("El número de teléfono es obligatorio.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Guardando cambios...");

    const socialLinksPayload: Record<string, string | null> = {};
    if (formData.linkedinUrl.trim())
      socialLinksPayload.linkedin = formData.linkedinUrl.trim();
    else socialLinksPayload.linkedin = null; // Asegura enviar null si está vacío

    if (formData.twitterUrl.trim())
      socialLinksPayload.twitter = formData.twitterUrl.trim();
    else socialLinksPayload.twitter = null; // Asegura enviar null si está vacío

    if (formData.githubUrl.trim())
      socialLinksPayload.github = formData.githubUrl.trim();
    else socialLinksPayload.github = null; // Asegura enviar null si está vacío

    // Solo incluye social_links en updates si hay algún link, de lo contrario manda null
    // para borrar todos los links si el usuario los ha vaciado.
    const finalSocialLinks = Object.values(socialLinksPayload).some(
      (val) => val !== null && val.trim() !== "" // Chequea que al menos uno no sea null ni string vacío
    )
      ? socialLinksPayload
      : null;

    const updates = {
      full_name: formData.fullName.trim(),
      phone_number: formData.phoneNumber.trim(),
      bio: formData.bio.trim(),
      social_links: finalSocialLinks,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id)
        .select()
        .single();

      toast.dismiss(loadingToastId);

      if (error) {
        console.error("Error updating profile:", error);
        if (error.code === "PGRST116") {
          toast.error(
            "No se pudo actualizar el perfil. Verifica tus permisos (RLS) o si el perfil existe."
          );
        } else {
          toast.error(`Error al actualizar: ${error.message}`);
        }
      } else if (data) {
        console.log("Profile updated successfully:", data);
        toast.success("¡Perfil actualizado con éxito!");
        if (refreshUserProfile) {
          await refreshUserProfile();
        }
      } else {
        // Esto podría suceder si .single() no devuelve datos pero tampoco un error explícito
        toast.warning(
          "La actualización del perfil no devolvió datos, pero no hubo error explícito. Revisa los permisos RLS."
        );
      }
    } catch (e: any) {
      toast.dismiss(loadingToastId);
      console.error("Unexpected error in handleSubmit:", e);
      toast.error(`Error inesperado: ${e.message || "Ocurrió un problema."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Cargando Perfil...</p>
      </div>
    );
  }

  if (!session) {
    // El useEffect ya debería haber redirigido, esto es un fallback.
    return null;
  }

  return (
    <div className="container mx-auto py-2 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Tu Perfil
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Actualiza tu información personal y de contacto. El campo de
            teléfono es obligatorio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={session.user?.email || ""}
                disabled
                className="bg-muted/50" // Un fondo ligeramente diferente para campos deshabilitados
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Número de Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Tu número de teléfono"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Cuéntanos un poco sobre ti..."
                value={formData.bio}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <h3 className="text-lg font-medium border-t border-border pt-6 mt-6">
              Redes Sociales
            </h3>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/tuperfil"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter/X URL</Label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                type="url"
                placeholder="https://x.com/tuusuario"
                value={formData.twitterUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/tuusuario"
                value={formData.githubUrl}
                onChange={handleInputChange}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pt-6">
          {" "}
          {/* <--- AÑADIMOS CardFooter */}
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
