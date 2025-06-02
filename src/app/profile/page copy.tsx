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
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Añadiremos textarea para el bio
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // <--- IMPORTA toast
import { createClient } from "@/utils/supabase/client";
// Considera añadir 'sonner' para notificaciones toast: npx shadcn-ui@latest add sonner
// import { toast } from "sonner";

// Definimos un tipo para los datos del formulario del perfil
interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  bio: string;
  // Para social_links, podríamos empezar simple o con campos específicos
  // socialLinks: string; // Ejemplo simple: string JSON
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
  } = useAuth(); // Asumimos que refreshUserProfile se añadirá a AuthContext
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

  // Protección de la ruta y carga inicial de datos del formulario
  useEffect(() => {
    if (!authIsLoading) {
      if (!session) {
        router.push("/login?next=/profile");
      } else if (profile) {
        // Cargar datos del perfil en el formulario cuando el perfil esté disponible
        setFormData({
          fullName: profile.full_name || "",
          phoneNumber: profile.phone_number || "",
          bio: profile.bio || "",
          linkedinUrl: profile.social_links?.linkedin || "",
          twitterUrl: profile.social_links?.twitter || "",
          githubUrl: profile.social_links?.github || "",
        });
      } else if (session && !profile) {
        // Si hay sesión pero no perfil (podría ser un instante mientras se carga el perfil inicial)
        // O si el perfil realmente es nulo después de la carga, forzar refetch o manejar
        console.warn(
          "Sesión activa pero perfil no disponible en ProfilePage. Intentando refetch si es necesario."
        );
        // Aquí podríamos llamar a refreshUserProfile si sospechamos que el perfil debería estar.
        // Por ahora, el useEffect de AuthContext debería manejar la carga inicial.
      }
    }
  }, [session, profile, authIsLoading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) {
      // toast.error("No estás autenticado.");
      console.error("No hay sesión de usuario para actualizar el perfil.");
      return;
    }
    if (!formData.phoneNumber) {
      // Validación simple para el campo obligatorio
      // toast.error("El número de teléfono es obligatorio.");
      alert("El número de teléfono es obligatorio."); // Usamos alert por ahora
      return;
    }

    setIsSubmitting(true);

    const socialLinksPayload: Record<string, string> = {};
    if (formData.linkedinUrl)
      socialLinksPayload.linkedin = formData.linkedinUrl;
    if (formData.twitterUrl) socialLinksPayload.twitter = formData.twitterUrl;
    if (formData.githubUrl) socialLinksPayload.github = formData.githubUrl;

    const updates = {
      id: session.user.id, // Asegúrate de que el ID se incluya para la cláusula .eq() y RLS
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
      bio: formData.bio,
      social_links:
        Object.keys(socialLinksPayload).length > 0 ? socialLinksPayload : null,
      updated_at: new Date().toISOString(), // Actualizar la marca de tiempo
    };

    // Aquí iría la llamada a Supabase para actualizar
    // const { data, error } = await supabase
    //   .from('profiles')
    //   .update(updates)
    //   .eq('id', session.user.id)
    //   .select()
    //   .single();

    // if (error) {
    //   console.error("Error updating profile:", error);
    //   // toast.error(`Error al actualizar: ${error.message}`);
    // } else if (data) {
    //   console.log("Profile updated successfully:", data);
    //   // toast.success("Perfil actualizado con éxito!");
    //   if (refreshUserProfile) await refreshUserProfile(); // Refresca el perfil en AuthContext
    // }
    console.log("Formulario enviado (simulado):", updates);
    alert(
      "Perfil actualizado (simulado). La lógica de Supabase se implementará a continuación."
    );
    // Simulación de refresco del AuthContext para pruebas UI
    // if (refreshUserProfile) await refreshUserProfile();

    setIsSubmitting(false);
  };

  // Muestra un estado de carga mientras se verifica la sesión o se cargan los datos
  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Cargando Perfil...</p>
      </div>
    );
  }

  // Si no hay sesión (ya debería haber redirigido, pero como fallback)
  if (!session) {
    return null; // O un mensaje indicando que debe iniciar sesión
  }

  // Si hay sesión, muestra el formulario del perfil
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Tu Perfil</CardTitle>
          <CardDescription>
            Actualiza tu información personal y de contacto. El campo de
            teléfono es obligatorio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico (de la sesión)</Label>
              <Input
                id="email"
                type="email"
                value={session.user?.email || ""}
                disabled
                className="bg-slate-100 dark:bg-slate-800"
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
                required // HTML5 validation
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

            <h3 className="text-lg font-medium border-t pt-4 mt-6">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
