import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "authed" | "guest";

// Replaces TanStack Router's `beforeLoad` session guard on `/_authenticated`.
// Client-only check: verifies the Supabase session before rendering nested routes.
export function ProtectedRoute() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setStatus(data.session ? "authed" : "guest");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setStatus(session ? "authed" : "guest");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") return null;
  if (status === "guest") return <Navigate to="/auth" replace />;
  return <Outlet />;
}
