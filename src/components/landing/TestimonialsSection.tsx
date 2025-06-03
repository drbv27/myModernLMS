// src/components/landing/TestimonialsSection.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // CardFooter no es necesario aquí
import { Quote } from "lucide-react"; // Icono para las citas

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  avatarSrc?: string; // Opcional, usaremos fallback si no se provee
  avatarFallback: string;
}

const TestimonialCard = ({
  quote,
  name,
  role,
  avatarSrc,
  avatarFallback,
}: TestimonialProps) => (
  <Card className="flex flex-col justify-between h-full bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="pb-4">
      <Quote className="h-8 w-8 text-primary/50 mb-2" />{" "}
      {/* Icono de cita con color primario sutil */}
      <p className="text-muted-foreground italic">"{quote}"</p>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center mt-4">
        <Avatar className="h-12 w-12 mr-4 border-2 border-primary/30">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const testimonialsData: TestimonialProps[] = [
  {
    quote:
      "Los cursos de técnicas avanzadas me han permitido mejorar la calidad de mis proyectos y conseguir mejores clientes. ¡Totalmente recomendado!",
    name: "Carlos Pérez",
    role: "Contratista Independiente",
    avatarFallback: "CP",
    avatarSrc: "/images/TESTIMONIAL1.JPG", // Placeholder
  },
  {
    quote:
      "¡Aprender Python fue súper divertido! Las explicaciones son claras y ahora puedo crear mis propios juegos pequeños. La comunidad también es genial.",
    name: "Sofía L.",
    role: "Estudiante de Programación (14 años)",
    avatarFallback: "SL",
    avatarSrc: "/images/TESTIMONIAL2.JPG", // Placeholder
  },
  {
    quote:
      "Lo que más me gusta es la comunidad. Siempre hay alguien dispuesto a ayudar y compartir ideas. He hecho contactos muy valiosos.",
    name: "Diego Rodríguez",
    role: "Ingeniero Civil",
    avatarFallback: "DR",
    avatarSrc: "/images/TESTIMONIAL3.JPG", // Placeholder
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      {" "}
      {/* Mismo fondo que el body o un custom-peach muy sutil */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Lo Que <span className="text-primary">Nuestra Comunidad</span> Opina
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Historias reales de personas que están transformando su futuro con
            nosotros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {" "}
          {/* items-stretch para que las tarjetas tengan la misma altura si el contenido varía */}
          {testimonialsData.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              avatarSrc={testimonial.avatarSrc}
              avatarFallback={testimonial.avatarFallback}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
