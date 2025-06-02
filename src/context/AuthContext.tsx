// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Profile, AuthContextType } from "@/types";
import { toast } from "sonner"; // Asumimos que sonner está configurado

const supabase = createClient();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // console.log('[AuthContext] Provider: Initializing. isLoading:', isLoading);

  const fetchUserProfile = useCallback(async (user: User | undefined) => {
    // console.log('[AuthContext] fetchUserProfile - Received user object:', user);
    if (!user) {
      // console.log('[AuthContext] fetchUserProfile: No user object provided, setting profile to null and isLoading to false.');
      setProfile(null);
      setIsLoading(false); // Asegura que isLoading se actualice
      return;
    }

    try {
      // console.log(`[AuthContext] fetchUserProfile: Fetching profile for user ID: ${user.id}`);
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // console.log('[AuthContext] fetchUserProfile - Supabase response:', { data, error, status });

      if (error && status !== 406) {
        console.error(
          "[AuthContext] fetchUserProfile - Error fetching profile:",
          error
        );
        setProfile(null);
      } else if (data) {
        // console.log('[AuthContext] fetchUserProfile: Profile data found:', data);
        setProfile(data as Profile);
      } else {
        // console.log('[AuthContext] fetchUserProfile: No profile data found. Setting profile to null.');
        setProfile(null);
      }
    } catch (error) {
      console.error(
        "[AuthContext] fetchUserProfile - Unexpected error:",
        error
      );
      setProfile(null);
    } finally {
      // console.log('[AuthContext] fetchUserProfile: Process finished. Setting isLoading to false.');
      setIsLoading(false); // Crucial: Asegura que isLoading se ponga en false
    }
  }, []); // Dependencias vacías porque supabase es estable y no hay otras props/estado que use de fuera del hook

  useEffect(() => {
    // console.log('[AuthContext] useEffect: Mounting. Initial isLoading:', isLoading);
    setIsLoading(true); // Inicia la carga al montar
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        // console.log('[AuthContext] getSession - currentSession:', currentSession);
        setSession(currentSession);
        if (currentSession) {
          fetchUserProfile(currentSession.user);
        } else {
          setProfile(null);
          setIsLoading(false); // Si no hay sesión, la carga inicial termina
        }
      })
      .catch((error) => {
        console.error("[AuthContext] getSession - Error:", error);
        setProfile(null);
        setIsLoading(false); // En caso de error, la carga inicial termina
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // console.log('[AuthContext] onAuthStateChange - Event:', event, 'New Session:', newSession);
        setSession(newSession);
        if (newSession) {
          // Si hay una nueva sesión (login), fetchUserProfile se encargará de setIsLoading(false)
          await fetchUserProfile(newSession.user);
        } else {
          // Si la nueva sesión es null (logout), limpiamos perfil y terminamos la carga
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      // console.log('[AuthContext] useEffect: Unmounting, unsubscribing auth listener.');
      authListener.subscription?.unsubscribe();
    };
  }, [fetchUserProfile]); // fetchUserProfile está en useCallback, por lo que es una dependencia estable

  const refreshUserProfile = useCallback(async () => {
    if (session?.user) {
      // console.log('[AuthContext] refreshUserProfile: Refreshing profile for user:', session.user.id);
      await fetchUserProfile(session.user);
    } else {
      // console.log('[AuthContext] refreshUserProfile: No active session to refresh profile.');
    }
  }, [session, fetchUserProfile]);

  const loginWithGoogle = async () => {
    console.log("[AuthContext] Attempting login with Google...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error(
        "[AuthContext] Error logging in with Google:",
        error.message
      );
      toast.error(`Error con Google: ${error.message}`);
    }
  };

  const loginWithMicrosoft = async () => {
    console.log("[AuthContext] Attempting login with Microsoft (Azure)...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error(
        "[AuthContext] Error logging in with Microsoft (Azure):",
        error.message
      );
      toast.error(`Error con Microsoft: ${error.message}`);
    }
  };

  const logout = async () => {
    console.log("[AuthContext] Attempting logout...");
    // setIsLoading(true); // Opcional: mostrar carga durante el logout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[AuthContext] Error logging out:", error.message);
      toast.error(`Error al cerrar sesión: ${error.message}`);
      // setIsLoading(false); // Si setIsLoading(true) se usó arriba
    } else {
      console.log(
        "[AuthContext] Logout successful. onAuthStateChange will handle state updates."
      );
      // No es necesario setSession(null) o setProfile(null) aquí,
      // onAuthStateChange lo hará y también setIsLoading(false).
    }
  };

  const signUpWithEmailPassword = async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName?: string;
  }) => {
    console.log(
      "[AuthContext] Attempting signup with email/password for:",
      email
    );
    // La opción `data` pasará metadatos que el trigger `handle_new_user` puede usar.
    // Nuestro trigger actual busca `full_name` en `raw_user_meta_data`.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // Pasamos fullName para que el trigger lo pueda usar
        },
        // Si tienes confirmación de email habilitada en Supabase, especifica la URL de redirección.
        // emailRedirectTo: `${window.location.origin}/auth/confirm`, // O a donde quieras que vaya post-confirmación
      },
    });

    if (error) {
      console.error("[AuthContext] Error signing up:", error.message);
      toast.error(`Error en el registro: ${error.message}`);
      return { error };
    }

    console.log(
      "[AuthContext] Signup successful (o pendiente de confirmación):",
      data
    );
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      // Esto puede indicar que la confirmación de email es necesaria.
      // Supabase devuelve user: null y session: null hasta que se confirma.
      // Si data.user existe pero session es null, es confirmación pendiente.
      toast.info(
        "¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta."
      );
    } else if (data.session) {
      // Si hay sesión, el onAuthStateChange debería manejarlo, pero un toast aquí es bueno.
      toast.success("¡Registro exitoso y sesión iniciada!");
    } else if (data.user) {
      toast.info(
        "¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta."
      );
    }
    // onAuthStateChange debería actualizar la sesión y el perfil si el signup inicia sesión automáticamente.
    return { error: null };
  };

  const loginWithEmailPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    console.log(
      "[AuthContext] Attempting login with email/password for:",
      email
    );
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(
        "[AuthContext] Error logging in with email/password:",
        error.message
      );
      toast.error(`Error al iniciar sesión: ${error.message}`);
      return { error };
    }

    console.log("[AuthContext] Login with email/password successful:", data);
    // onAuthStateChange debería actualizar la sesión y el perfil.
    // El `data.session` y `data.user` estarán aquí si el login fue exitoso.
    // El `profile` se cargará a través del listener `onAuthStateChange`.
    toast.success("¡Inicio de sesión exitoso!");
    return { error: null };
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const value = {
    session,
    profile,
    isLoading,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
    refreshUserProfile,
    signUpWithEmailPassword,
    loginWithEmailPassword,
    isMobileSidebarOpen,
    toggleMobileSidebar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
