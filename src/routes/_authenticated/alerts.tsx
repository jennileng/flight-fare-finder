import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Flight price notifier" },
      { name: "description", content: "Fare drop emails sent for your San Jose routes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Alerts,
});

function Alerts() {
  const watches = useQuery({
    queryKey: ["fare-watches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fare_watches")
        .select("id, destination, destination_code, target_price, last_seen_price, is_active");
      if (error) throw error;
      return data;
    },
  });

  const active = (watches.data ?? []).filter((w) => w.is_active);

  return (
    <AppShell
      title="Alerts"
      description="A record of the fare drop emails we've sent, and what we're currently watching."
    >
      <div className="surface-panel rounded-2xl p-6">
        <p className="font-display text-lg font-semibold">
          {active.length} active {active.length === 1 ? "watch" : "watches"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          No fare drop emails yet. As soon as a cheapest fare hits your target, the alert shows up
          here and in your inbox.
        </p>
      </div>

      {active.length > 0 && (
        <ul className="mt-6 space-y-3">
          {active.map((w) => (
            <li
              key={w.id}
              className="surface-panel flex items-center justify-between rounded-2xl px-5 py-4"
            >
              <span className="font-display font-semibold">
                SJC <span className="text-muted-foreground">→</span> {w.destination_code}
              </span>
              <span className="text-sm text-muted-foreground">
                Emails you at or below{" "}
                <span className="text-primary">${Number(w.target_price).toFixed(0)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
