// src/app/courses/[courseId]/page.tsx
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, BarChart3, Users, MonitorPlay } from "lucide-react";

// Interfaz para el objeto normalizado que usará el componente
interface NormalizedCourseDetails {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_free: boolean;
  created_at: string;
  categoryName: string | null;
  teacherName: string | null;
}

// Tipo para los datos crudos que vienen de Supabase
interface RawSupabaseCourse {
  id: any;
  title: any;
  description: any;
  image_url: any;
  is_free: any;
  created_at: any;
  categories: { name: any } | { name: any }[] | null; // Puede ser objeto, array o null
  profiles: { full_name: any } | { full_name: any }[] | null; // Puede ser objeto, array o null
}

async function getCourseDetails(
  courseId: string
): Promise<NormalizedCourseDetails | null> {
  const supabase = createClient();
  console.log(`[CourseDetailPage] Fetching details for course ID: ${courseId}`);

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      description,
      image_url,
      is_free,
      created_at,
      categories ( name ),
      profiles ( full_name )
    `
    )
    .eq("id", courseId)
    .eq("status", "published")
    .maybeSingle(); // Usamos maybeSingle() que devuelve null si no hay filas, o un objeto si hay una.

  if (error) {
    console.error(
      `[CourseDetailPage] Error fetching course ${courseId}:`,
      error.message
    );
    return null;
  }
  if (!data) {
    console.log(`[CourseDetailPage] No course found with ID: ${courseId}`);
    return null;
  }

  const rawCourse = data as RawSupabaseCourse; // Hacemos un cast al tipo de datos crudos

  // Normalizamos los datos relacionados
  let categoryName: string | null = null;
  if (rawCourse.categories) {
    if (Array.isArray(rawCourse.categories)) {
      categoryName =
        rawCourse.categories.length > 0 ? rawCourse.categories[0].name : null;
    } else {
      // Es un objeto
      categoryName = rawCourse.categories.name;
    }
  }

  let teacherName: string | null = null;
  if (rawCourse.profiles) {
    if (Array.isArray(rawCourse.profiles)) {
      teacherName =
        rawCourse.profiles.length > 0 ? rawCourse.profiles[0].full_name : null;
    } else {
      // Es un objeto
      teacherName = rawCourse.profiles.full_name;
    }
  }

  console.log(
    `[CourseDetailPage] Successfully fetched and normalized course: ${rawCourse.title}`
  );
  return {
    id: String(rawCourse.id),
    title: String(rawCourse.title),
    description: rawCourse.description ? String(rawCourse.description) : null,
    image_url: rawCourse.image_url ? String(rawCourse.image_url) : null,
    is_free: Boolean(rawCourse.is_free),
    created_at: String(rawCourse.created_at),
    categoryName: categoryName ? String(categoryName) : null,
    teacherName: teacherName ? String(teacherName) : null,
  };
}

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const course = await getCourseDetails(params.courseId);

  if (!course) {
    notFound();
  }

  const estimatedDuration = "8 horas"; // Simulado
  const studentCount = "1,234 estudiantes"; // Simulado
  const level = "Principiante"; // Simulado

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="lg:flex lg:space-x-12">
        <div className="lg:w-2/5 xl:w-1/3 mb-8 lg:mb-0">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-6">
            <Image
              src={course.image_url || "/images/course-placeholder.png"}
              alt={`Imagen del curso ${course.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 33vw"
            />
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            {course.teacherName && (
              <p>
                <strong>Instructor:</strong> {course.teacherName}
              </p>
            )}
            {course.categoryName && (
              <p>
                <strong>Categoría:</strong>{" "}
                <Badge variant="secondary">{course.categoryName}</Badge>
              </p>
            )}
            <p>
              <strong>Nivel:</strong> {level}
            </p>
            <p>
              <strong>Duración Estimada:</strong> {estimatedDuration}
            </p>
            <p>
              <strong>Inscritos:</strong> {studentCount}
            </p>
            <p>
              <strong>Publicado:</strong>{" "}
              {new Date(course.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Precio:</strong>{" "}
              {course.is_free ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Gratis
                </Badge>
              ) : (
                "De Pago"
              )}
            </p>
          </div>
          <Button size="lg" className="w-full mt-6 text-lg">
            Inscribirse Ahora
          </Button>
        </div>

        <div className="lg:w-3/5 xl:w-2/3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            {course.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {course.description || "Descripción no disponible."}
          </p>

          <div className="mt-10 pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Contenido del Curso
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-md bg-card">
                <h3 className="font-medium text-foreground">
                  Módulo 1: Introducción
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Lección 1.1: Bienvenida al curso (Video - 5 min)</li>
                  <li>Lección 1.2: Herramientas necesarias (PDF - 2 pág)</li>
                  <li>Lección 1.3: Conceptos clave (Video - 12 min)</li>
                </ul>
              </div>
              <div className="p-4 border border-border rounded-md bg-card">
                <h3 className="font-medium text-foreground">
                  Módulo 2: Fundamentos Prácticos
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Lección 2.1: Tu primer proyecto (Video - 25 min)</li>
                  <li>
                    Lección 2.2: Errores comunes y cómo evitarlos (Artículo)
                  </li>
                </ul>
              </div>
              <p className="text-center text-muted-foreground italic mt-6">
                (Más módulos y lecciones se mostrarán aquí...)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
