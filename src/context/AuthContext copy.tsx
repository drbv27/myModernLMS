// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client"; // Asegúrate que esta ruta sea correcta
import { Profile, AuthContextType } from "@/types"; // Asegúrate que esta ruta sea correcta

const supabase = createClient();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Comienza en true

  //console.log("[AuthContext] Provider: Initializing. isLoading:", isLoading);

  useEffect(() => {
    console.log(
      "[AuthContext] useEffect: Mounting. Initial isLoading:",
      isLoading
    );
    // setIsLoading(true); // Ya está true inicialmente

    // Intenta obtener la sesión activa al cargar
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        console.log(
          "[AuthContext] getSession - currentSession:",
          currentSession
        );
        setSession(currentSession); // Actualiza la sesión
        if (currentSession) {
          console.log(
            "[AuthContext] getSession: Session found, fetching profile for user:",
            currentSession.user.id
          );
          fetchUserProfile(currentSession.user); // fetchUserProfile se encargará de setIsLoading(false)
        } else {
          console.log("[AuthContext] getSession: No active session found.");
          setProfile(null); // Asegúrate de limpiar el perfil si no hay sesión
          setIsLoading(false); // IMPORTANTE: Si no hay sesión, terminamos de cargar
        }
      })
      .catch((error) => {
        console.error("[AuthContext] getSession - Error:", error);
        setProfile(null);
        setIsLoading(false); // IMPORTANTE: En caso de error, terminamos de cargar
      });

    // Escucha los cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(
          "[AuthContext] onAuthStateChange - Event:",
          event,
          "New Session:",
          newSession
        );
        setSession(newSession); // Actualiza la sesión con la nueva sesión
        if (newSession) {
          console.log(
            "[AuthContext] onAuthStateChange: Session changed/received, fetching profile for user:",
            newSession.user.id
          );
          await fetchUserProfile(newSession.user); // fetchUserProfile se encargará de setIsLoading(false)
        } else {
          console.log(
            "[AuthContext] onAuthStateChange: Session is now null (e.g., logout)."
          );
          setProfile(null); // Limpia el perfil si no hay sesión
          setIsLoading(false); // IMPORTANTE: Si la sesión es null, terminamos de cargar
        }
      }
    );

    // Limpia el listener cuando el componente se desmonta
    return () => {
      console.log(
        "[AuthContext] useEffect: Unmounting, unsubscribing auth listener."
      );
      authListener.subscription?.unsubscribe();
    };
  }, []); // El array de dependencias vacío asegura que esto se ejecute solo al montar y desmontar

  const fetchUserProfile = async (user: User | undefined) => {
    console.log("[AuthContext] fetchUserProfile - Received user object:", user);
    if (!user) {
      console.log(
        "[AuthContext] fetchUserProfile: No user object provided, setting profile to null and isLoading to false."
      );
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // setIsLoading(true); // Comentado porque la carga principal ya está activa
    // Podríamos activarlo si queremos un indicador de carga específico para el perfil

    try {
      console.log(
        `[AuthContext] fetchUserProfile: Fetching profile for user ID: ${user.id}`
      );
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("[AuthContext] fetchUserProfile - Supabase response:", {
        data,
        error,
        status,
      });

      if (error && status !== 406) {
        // 406 significa que no encontró la fila, lo cual es posible para un nuevo usuario sin perfil aún
        console.error(
          "[AuthContext] fetchUserProfile - Error fetching profile (and not status 406):",
          error
        );
        setProfile(null);
      } else if (data) {
        console.log(
          "[AuthContext] fetchUserProfile: Profile data found:",
          data
        );
        setProfile(data as Profile);
      } else {
        console.log(
          "[AuthContext] fetchUserProfile: No profile data found (e.g., new user or status 406). Setting profile to null."
        );
        setProfile(null); // Asegúrate de limpiar el perfil si no se encuentra o es un nuevo usuario sin perfil aún
      }
    } catch (error) {
      console.error(
        "[AuthContext] fetchUserProfile - Unexpected error in try-catch block:",
        error
      );
      setProfile(null);
    } finally {
      console.log(
        "[AuthContext] fetchUserProfile: Process finished. Setting isLoading to false."
      );
      setIsLoading(false); // CRUCIAL: Asegurar que isLoading se ponga en false al final de esta operación
    }
  };

  const loginWithGoogle = async () => {
    console.log("[AuthContext] Attempting login with Google...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error)
      console.error(
        "[AuthContext] Error logging in with Google:",
        error.message
      );
  };

  const loginWithMicrosoft = async () => {
    console.log("[AuthContext] Attempting login with Microsoft (Azure)...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error)
      console.error(
        "[AuthContext] Error logging in with Microsoft (Azure):",
        error.message
      );
  };

  const logout = async () => {
    console.log("[AuthContext] Attempting logout...");
    // setIsLoading(true); // Podríamos poner isLoading a true aquí para mostrar un feedback inmediato
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[AuthContext] Error logging out:", error.message);
      // setIsLoading(false); // Si activamos isLoading arriba, hay que desactivarlo aquí en caso de error
    } else {
      console.log(
        "[AuthContext] Logout successful. onAuthStateChange should handle state updates."
      );
      // El listener onAuthStateChange se encargará de limpiar session y profile,
      // y de actualizar isLoading a false.
    }
  };

  const value = {
    session,
    profile,
    isLoading,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
  };

  // console.log('[AuthContext] Provider: Rendering with value:', value); // Loguea mucho, opcional para depuración profunda

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
