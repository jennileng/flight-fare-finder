import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { PlanSubscribe } from "@/components/PlanSubscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDocumentHead } from "@/hooks/use-document-head";
import { supabase } from "@/integrations/supabase/client";

type FareWatch = {
  id: string;
  destination: string;
  destination_code: string;
  origin_code: string;
  target_price: number;
  is_active: boolean;
  last_seen_price: number | null;
  created_at: string;
};

export default function Dashboard() {
  useDocumentHead({
    title: "Fare watches — Flight price notifier",
    description: "Manage the San Jose routes and target prices we watch for you.",
  });

  const queryClient = useQueryClient();
  const [destination, setDestination] = useState("");
  const [code, setCode] = useState("");
  const [target, setTarget] = useState("");

  const watches = useQuery({
    queryKey: ["fare-watches"],
    queryFn: async (): Promise<FareWatch[]> => {
      const { data, error } = await supabase
        .from("fare_watches")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as FareWatch[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["fare-watches"] });

  const create = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("You need to be signed in.");
      const { error } = await supabase.from("fare_watches").insert({
        user_id: auth.user.id,
        destination: destination.trim(),
        destination_code: code.trim().toUpperCase(),
        target_price: Number(target),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setDestination("");
      setCode("");
      setTarget("");
      toast.success("Watch added. We'll email you when the fare drops.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("fare_watches").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fare_watches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Watch removed.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = watches.data ?? [];

  return (
    <AppShell
      title="Fare watches"
      description="Every watch tracks the cheapest fare from San Jose (SJC). We email you when it hits your target."
    >
      <div className="mb-8 space-y-3">
        <div>
          <h2 className="font-display text-xl font-semibold">機票降價通知</h2>
          <p className="text-sm text-muted-foreground">
            選擇路線並設定目標價格（TWD），達標時我們會寄信通知你。
          </p>
        </div>
        <PlanSubscribe />
      </div>

      <form
        className="surface-panel grid gap-4 rounded-2xl p-6 shadow-lift sm:grid-cols-[1fr_120px_140px_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="destination">Destination city</Label>
          <Input
            id="destination"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Las Vegas"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Airport</Label>
          <Input
            id="code"
            required
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="LAS"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target">Target price ($)</Label>
          <Input
            id="target"
            type="number"
            min={20}
            step={1}
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="69"
          />
        </div>
        <Button type="submit" disabled={create.isPending}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add watch
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        {watches.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading your watches…</p>
        ) : rows.length === 0 ? (
          <div className="surface-panel rounded-2xl p-10 text-center">
            <p className="font-display text-lg font-semibold">No watches yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a route above and a price you'd happily pay. We'll take it from here.
            </p>
          </div>
        ) : (
          rows.map((w) => (
            <div
              key={w.id}
              className="surface-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4"
            >
              <div>
                <p className="font-display text-lg font-semibold">
                  {w.origin_code} <span className="text-muted-foreground">→</span>{" "}
                  {w.destination_code}
                </p>
                <p className="text-sm text-muted-foreground">{w.destination}</p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Target</p>
                <p className="font-display text-2xl font-semibold text-primary">
                  ${Number(w.target_price).toFixed(0)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`active-${w.id}`}
                    checked={w.is_active}
                    onCheckedChange={(v) => toggle.mutate({ id: w.id, is_active: v })}
                  />
                  <Label htmlFor={`active-${w.id}`} className="text-sm text-muted-foreground">
                    {w.is_active ? "Watching" : "Paused"}
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove watch for ${w.destination}`}
                  onClick={() => remove.mutate(w.id)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
