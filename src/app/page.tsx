// src/app/page.tsx
import CourseThemesSection from "@/components/landing/CourseThemesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection"; // Importa el nuevo componente
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export default function LandingPage() {
  return (
    // El div raíz con flex flex-col y min-h-[calc(100vh-4rem)] se mantiene
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        {" "}
        {/* main ahora ocupa el espacio flexible */}
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CourseThemesSection />
        {/* Aquí irían las futuras secciones de la Landing Page:
            <CallToActionSection />
        */}
      </main>

      <footer className="flex items-center justify-center w-full h-20 sm:h-24 border-t dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} Mi LMS Moderno. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
