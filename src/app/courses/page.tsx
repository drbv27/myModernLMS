// src/app/courses/page.tsx
import { createClient } from "@/utils/supabase/server"; // Usaremos el cliente de servidor
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Para mostrar la categoría

// Definimos un tipo para los datos del curso que esperamos
// Podrías mover esto a src/types/index.ts si lo vas a reutilizar mucho
interface Course {
  id: string; // o number, dependiendo de tu DB
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: number | null; // Asumiendo que category_id es number
  // Podríamos hacer un JOIN para obtener el nombre de la categoría directamente
  // o cargarlo por separado si es necesario. Por ahora, solo el ID.
  categories: { name: string } | null; // Para el nombre de la categoría si hacemos JOIN
  is_free: boolean;
  // Añade más campos si los necesitas mostrar (ej. teacher_name, etc.)
}

async function fetchCourses(): Promise<Course[]> {
  const supabase = createClient(); // Desde src/utils/supabase/server.ts
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      description,
      image_url,
      is_free,
      categories ( name ) 
    `
    ) // Seleccionamos el nombre de la categoría relacionada
    .eq("status", "published"); // Solo cursos publicados

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
  // Mapeamos para asegurar que la estructura coincida con nuestra interfaz Course
  // y manejar el caso de que categories sea un array (aunque con .select() debería ser objeto o null)
  return data.map((course) => ({
    ...course,
    categories: Array.isArray(course.categories)
      ? course.categories[0]
      : course.categories,
  })) as Course[];
}

export default async function CoursesCatalogPage() {
  const courses = await fetchCourses();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Nuestro Catálogo de <span className="text-primary">Cursos</span>
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Encuentra la formación que necesitas para impulsar tu carrera y
          expandir tus conocimientos.
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg"
            >
              <div className="relative w-full aspect-[16/9]">
                {" "}
                {/* Para la imagen */}
                <Image
                  src={course.image_url || "/images/course-placeholder.png"} // Usa un placeholder si no hay imagen
                  alt={`Imagen del curso ${course.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Ajusta estos sizes
                />
              </div>
              <CardHeader className="p-4">
                {course.categories && (
                  <Badge
                    variant="outline"
                    className="mb-2 text-primary border-primary/50 w-fit"
                  >
                    {course.categories.name}
                  </Badge>
                )}
                <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description || "No hay descripción disponible."}
                </p>
              </CardContent>
              <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/30">
                {" "}
                {/* Fondo sutil para el footer */}
                <Link href={`/courses/${course.id}`} legacyBehavior passHref>
                  <Button variant="default" className="w-full">
                    Ver Detalles del Curso
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            Actualmente no hay cursos publicados. ¡Vuelve pronto!
          </p>
        </div>
      )}
    </div>
  );
}
