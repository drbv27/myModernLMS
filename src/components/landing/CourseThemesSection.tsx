// src/components/landing/CourseThemesSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ThemeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  linkHref: string;
  imageAlt: string;
}

const ThemeCard = ({
  title,
  description,
  imageUrl,
  linkHref,
  imageAlt,
}: ThemeCardProps) => (
  // Contenedor principal de la tarjeta:
  // - 'group' para efectos hover en elementos hijos.
  // - 'relative' para que la imagen con 'fill' y el contenido superpuesto se posicionen correctamente.
  // - 'overflow-hidden' para los bordes redondeados y el efecto de escala de la imagen.
  // - 'aspect-[4/3]' (o el que prefieras) para dar dimensiones al contenedor para la imagen 'fill'.
  <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out aspect-[4/3] sm:aspect-video md:aspect-[4/3]">
    <Link href={linkHref} legacyBehavior passHref>
      <a className="block w-full h-full">
        {" "}
        {/* El enlace debe ocupar todo el espacio de la tarjeta */}
        {/* Contenedor para la Imagen:
            - 'absolute inset-0' para que la imagen (con fill) ocupe todo el espacio de su padre ('ThemeCard' div).
        */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill // Prop booleana para que la imagen llene el contenedor padre.
            className="object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out" // 'object-cover' para el ajuste.
            // La prop 'sizes' es importante para el rendimiento con 'fill'.
            // Debes ajustarla según cómo se comporte tu grid en diferentes breakpoints.
            // Ejemplo: (max-width: 768px) 100vw indica que en pantallas de hasta 768px, la imagen puede ocupar hasta el 100% del ancho del viewport.
            // (max-width: 1200px) 50vw indica que en pantallas hasta 1200px, podría ocupar el 50%.
            // 33vw es el fallback.
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {/* Overlay oscuro para mejorar la legibilidad del texto sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent z-10 group-hover:from-black/85 transition-all duration-300 ease-in-out"></div>
        {/* Contenido de Texto y Botón, superpuesto a la imagen */}
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 z-20 w-full">
          {" "}
          {/* w-full para asegurar que el contenido se distribuya correctamente */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-slate-100 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {" "}
            {/* line-clamp-2 para limitar descripción */}
            {description}
          </p>
          <Button
            variant="default" // Usará tu color primario
            size="sm"
            className="group-hover:bg-primary/90 transition-colors duration-300 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 h-auto" // Ajuste de tamaño y padding
          >
            Explorar Área{" "}
            <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </a>
    </Link>
  </div>
);

const themesData: ThemeCardProps[] = [
  {
    title: "Formación en Construcción",
    description:
      "Desde fundamentos hasta técnicas avanzadas para profesionales del sector.",
    imageUrl: "/images/theme-construction.jpg", // Asegúrate que esta imagen exista en public/images/
    linkHref: "/courses?category=construccion",
    imageAlt:
      "Profesionales de la construcción trabajando en un proyecto moderno",
  },
  {
    title: "Desarrollo y Programación",
    description:
      "Impulsa la creatividad y lógica de los jóvenes con nuestros cursos de coding.",
    imageUrl: "/images/theme-coding.jpg", // Asegúrate que esta imagen exista en public/images/
    linkHref: "/courses?category=programacion",
    imageAlt: "Jóvenes aprendiendo a programar en computadoras",
  },
  // Puedes añadir una tercera temática aquí si lo deseas, siguiendo la misma estructura.
  // Si añades una tercera, ajusta la clase del grid en el componente principal a lg:grid-cols-3
];

export default function CourseThemesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Nuestras <span className="text-primary">Áreas de Enfoque</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Sumérgete en el conocimiento que transformará tu carrera y
            potenciará tus habilidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Si tienes 3 items en themesData, podrías cambiar a lg:grid-cols-3 */}
          {themesData.map((theme) => (
            <ThemeCard
              key={theme.title}
              title={theme.title}
              description={theme.description}
              imageUrl={theme.imageUrl}
              linkHref={theme.linkHref}
              imageAlt={theme.imageAlt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
