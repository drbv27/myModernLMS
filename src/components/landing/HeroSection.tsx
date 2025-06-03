// src/components/landing/HeroSection.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="container mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between py-10 md:py-16 lg:py-20 px-4 sm:px-6">
      {/* Contenedor para el texto y la imagen móvil (se apilan verticalmente por defecto) */}
      <div className="lg:w-1/2 text-center lg:text-left">
        {/* Imagen solo para móvil y tablet pequeña, arriba del texto */}
        <div className="lg:hidden mb-8 flex justify-center">
          <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/hero-image.png" // O una versión optimizada para móvil
              alt="Plataforma LMS moderna"
              fill // Nueva prop booleana
              className="object-cover" // Reemplaza objectFit
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Ejemplo de sizes
              priority
            />
          </div>
        </div>

        <h1 className="text-3xl xxs:text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          Transforma tu Futuro:{" "}
          <span className="text-primary">Aprende, Construye, Conecta.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
          Cursos especializados para profesionales de la construcción y jóvenes
          programadores. Únete a una comunidad vibrante y lleva tus habilidades
          al siguiente nivel.
        </p>
        <div className="mt-8 flex flex-col xxs:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
          <Link href="/signup" legacyBehavior passHref>
            <Button size="lg" variant="default" className="w-full xxs:w-auto">
              Regístrate Gratis
            </Button>
          </Link>
          <Link href="/#about" legacyBehavior passHref>
            <Button
              size="lg"
              variant="outline"
              className="w-full xxs:w-auto mt-2 xxs:mt-0"
            >
              Conoce Más
            </Button>
          </Link>
        </div>
      </div>

      {/* Imagen para desktop, oculta en pantallas más pequeñas que lg */}
      <div className="hidden lg:flex lg:w-1/2 justify-center lg:justify-end mt-10 lg:mt-0">
        <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="/images/hero-image.png"
            alt="Plataforma LMS moderna con estudiantes colaborando y aprendiendo."
            fill // Nueva prop booleana
            className="object-cover" // Reemplaza objectFit
            sizes="(max-width: 1024px) 50vw, 33vw" // Ejemplo de sizes (ajusta según tu layout)
            priority
          />
        </div>
      </div>
    </section>
  );
}
