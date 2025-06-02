// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Para barras de progreso en cursos
import { BookOpen, Users, PlusCircle, Newspaper } from "lucide-react"; // Iconos

// Datos simulados para los cursos del estudiante
const mockCourses = [
  {
    id: "1",
    title: "Introducción a la Albañilería Moderna",
    progress: 65,
    category: "Construcción",
    // Imagen aleatoria de Picsum Photos con un seed para que sea consistente por ID de curso
    imageUrl: "https://picsum.photos/seed/albañileria1/400/300",
  },
  {
    id: "2",
    title: "Fundamentos de Programación para Niños",
    progress: 30,
    category: "Coding",
    imageUrl: "https://picsum.photos/seed/codingkids2/400/300",
  },
  {
    id: "3",
    title: "Seguridad en Obras de Construcción",
    progress: 90,
    category: "Construcción",
    imageUrl: "https://picsum.photos/seed/seguridad3/400/300",
  },
  {
    id: "4",
    title: "Desarrollo Web Básico con HTML y CSS",
    progress: 15,
    category: "Coding",
    imageUrl: "https://picsum.photos/seed/htmlcss4/400/300",
  },
  {
    id: "5",
    title: "Gestión de Proyectos de Construcción Ágil",
    progress: 45,
    category: "Construcción",
    imageUrl: "https://picsum.photos/seed/gestionproyectos5/400/300",
  },
  {
    id: "6",
    title: "Introducción a Python para Jóvenes",
    progress: 5,
    category: "Coding",
    imageUrl: "https://picsum.photos/seed/pythonjovenes6/400/300",
  },
];

// Datos simulados para el curso "Continuar Aprendiendo"
const continueLearningCourse = mockCourses[1]; // Tomamos el segundo curso como ejemplo

export default function DashboardPage() {
  const { session, profile, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && !session) {
      router.push("/login?next=/dashboard");
    }
  }, [session, authIsLoading, router]);

  if (authIsLoading || !session) {
    // Mantenemos el loader si está cargando o si no hay sesión (aunque el useEffect redirige)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        {" "}
        {/* Ajusta min-h según necesites */}
        <p>Cargando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sección de Saludo */}
      <section>
        <h1 className="text-3xl font-bold text-foreground">
          ¡Hola de nuevo,{" "}
          <span className="text-primary">
            {profile?.full_name || session.user?.email?.split("@")[0]}
          </span>
          !
        </h1>
        <p className="mt-1 text-muted-foreground">
          Es genial verte por aquí. ¿Listo para seguir aprendiendo?
        </p>
      </section>

      {/* Sección Continuar Aprendiendo (Opcional) */}
      {continueLearningCourse && (
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Continuar Aprendiendo
          </h2>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-56"
                  src={continueLearningCourse.imageUrl}
                  alt={`Imagen del curso ${continueLearningCourse.title}`}
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="uppercase tracking-wide text-sm text-primary font-semibold">
                    {continueLearningCourse.category}
                  </div>
                  <Link
                    href={`/courses/${continueLearningCourse.id}`}
                    className="block mt-1 text-lg leading-tight font-medium text-foreground hover:underline"
                  >
                    {continueLearningCourse.title}
                  </Link>
                  <p className="mt-2 text-muted-foreground">
                    Retoma donde lo dejaste y sigue avanzando.
                  </p>
                </div>
                <div className="mt-4">
                  <Progress
                    value={continueLearningCourse.progress}
                    className="w-full h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {continueLearningCourse.progress}% completado
                  </p>
                </div>
                <Button className="mt-4 w-full sm:w-auto self-start bg-custom-coral hover:bg-custom-coral/90 text-white">
                  {/* O puedes usar variant="default" si ya mapeaste --primary a tu coral */}
                  Ir al Curso
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Sección Mis Cursos */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Mis Cursos</h2>
          <Link href="/courses/catalog">
            {" "}
            {/* Asumimos una ruta para el catálogo */}
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Explorar Cursos
            </Button>
          </Link>
        </div>
        {mockCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  className="h-40 w-full object-cover"
                  src={course.imageUrl}
                  alt={`Imagen del curso ${course.title}`}
                />
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs pt-1">
                    {course.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {course.progress}% completado
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full"
                    legacyBehavior
                  >
                    {/* Este botón usará el color --primary (tu coral) */}
                    <Button variant="default" className="w-full">
                      Ver Curso
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Aún no estás inscrito en ningún curso.
            </p>
            <Link href="/courses/catalog" className="mt-4 inline-block">
              {/* Este botón usará el color --primary (tu coral) */}
              <Button variant="default">Explorar Cursos</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Sección Feed Social (Placeholder) */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Comunidad</h2>
          <Link href="/feed">
            {" "}
            {/* Asumimos una ruta para el feed */}
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
            >
              Ver todo el Feed
              <Newspaper className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">
            Próximamente: ¡Interactúa con la comunidad aquí mismo!
          </p>
          {/* Aquí podrías mostrar los últimos 2-3 posts del feed */}
        </Card>
      </section>
    </div>
  );
}
