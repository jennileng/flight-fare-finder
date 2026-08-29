import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { PLANS, fetchSubscriptions, subscribe, type SubscriptionRow } from "@/lib/flight-api";

export function PlanSubscribe() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const [targets, setTargets] = useState<Record<string, string>>({});

  useQuery({
    queryKey: ["auth-email"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      const e = data.user?.email ?? null;
      setEmail(e);
      return e;
    },
  });

  const subs = useQuery({
    queryKey: ["flight-subscriptions", email],
    queryFn: () => fetchSubscriptions(email as string),
    enabled: !!email,
  });

  const rows: SubscriptionRow[] = subs.data ?? [];
  const byPlan = Object.fromEntries(rows.map((r) => [r.plan_name, r]));

  const doSubscribe = useMutation({
    mutationFn: async ({ plan_name, target_price }: { plan_name: string; target_price: number }) => {
      if (!email) throw new Error("You need to be signed in.");
      return subscribe(email, plan_name, target_price);
    },
    onSuccess: () => {
      toast.success("已訂閱！降價時我們會寄信通知你。");
      queryClient.invalidateQueries({ queryKey: ["flight-subscriptions", email] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PLANS.map((plan) => {
        const existing = byPlan[plan.plan_name];
        const value = targets[plan.plan_name] ?? (existing ? String(existing.target_price) : "");
        return (
          <div key={plan.plan_name} className="surface-panel rounded-2xl p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold">{plan.label}</p>
              {existing ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  已訂閱
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              目前最低約 NT${plan.hint.toLocaleString()}
            </p>

            <div className="mt-4 space-y-2">
              <Label htmlFor={`target-${plan.plan_name}`}>目標價格（TWD）</Label>
              <Input
                id={`target-${plan.plan_name}`}
                type="number"
                min={1}
                step={1}
                value={value}
                onChange={(e) =>
                  setTargets((t) => ({ ...t, [plan.plan_name]: e.target.value }))
                }
                placeholder={String(plan.hint)}
              />
            </div>

            <Button
              className="mt-4 w-full"
              disabled={!email || doSubscribe.isPending || !value}
              onClick={() =>
                doSubscribe.mutate({ plan_name: plan.plan_name, target_price: Number(value) })
              }
            >
              {existing ? "更新目標價" : "開始追蹤"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
