// src/types/index.ts
import { AuthError, Session, User } from "@supabase/supabase-js";

// Define la estructura de tu tabla 'profiles'
export interface Profile {
  id: string; // UUID
  full_name?: string | null;
  avatar_url?: string | null;
  role: "student" | "teacher" | "admin";
  bio?: string | null;
  phone_number?: string | null;
  is_phone_public: boolean;
  social_links?: Record<string, string> | null; // Ej: { linkedin: 'url', website: 'url' }
  // created_at y updated_at se manejan automáticamente
}

export interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  // loginWithEmail: (credentials: { email: string, password: string }) => Promise<any>; // Lo implementaremos en las páginas
  // signUpWithEmail: (credentials: { email: string, password: string, options?: any }) => Promise<any>; // Lo implementaremos en las páginas
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  signUpWithEmailPassword: (credentials: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<{ error: AuthError | null }>;
  loginWithEmailPassword: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ error: AuthError | null }>;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}
