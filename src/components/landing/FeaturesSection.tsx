// src/components/landing/FeaturesSection.tsx
"use client";

import { Lightbulb, MessageSquareText, Laptop, Wrench } from "lucide-react";
import { ReactNode } from "react";

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);

const features = [
  {
    icon: <Lightbulb size={28} />,
    title: "Contenido Experto y Relevante",
    description:
      "Accede a cursos cuidadosamente diseñados para profesionales de la construcción y la nueva generación de programadores, siempre actualizados con las últimas tendencias.",
  },
  {
    icon: <MessageSquareText size={28} />,
    title: "Comunidad Vibrante",
    description:
      "Conecta, comparte conocimientos y colabora con otros estudiantes y profesionales en nuestro feed social integrado. Aprender juntos es mejor.",
  },
  {
    icon: <Laptop size={28} />,
    title: "Aprende a Tu Ritmo, Donde Quieras",
    description:
      "Disfruta de una interfaz intuitiva y totalmente responsive. Accede a tus cursos y materiales desde cualquier dispositivo, cuando te sea más conveniente.",
  },
  {
    icon: <Wrench size={28} />,
    title: "Habilidades para el Mundo Real",
    description:
      "Enfócate en adquirir conocimientos y habilidades prácticas que puedas aplicar directamente en tus proyectos y carrera profesional.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-custom-plum/5">
      {/* Fondo sutil para diferenciar la sección, usando un tono de tu paleta para el modo oscuro */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            ¿Por Qué Elegir <span className="text-primary">Mi LMS Moderno</span>
            ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Te ofrecemos una experiencia de aprendizaje completa, diseñada para
            tu éxito profesional y personal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
