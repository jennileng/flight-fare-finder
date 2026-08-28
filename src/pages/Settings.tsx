import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { useDocumentHead } from "@/hooks/use-document-head";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  useDocumentHead({
    title: "Settings — Flight price notifier",
    description: "Your account and notification email for fare alerts.",
  });

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return (
    <AppShell title="Settings" description="Where we send your fare drop alerts.">
      <div className="surface-panel max-w-lg rounded-2xl p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Alert email</p>
        <p className="mt-2 font-display text-lg font-semibold">{email ?? "…"}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Alerts go to the email on your account. Every watch is checked around the clock and we
          email you as soon as the cheapest fare from San Jose reaches your target price.
        </p>
      </div>
    </AppShell>
  );
}
