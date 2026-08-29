// Base URL for the M1 flight-price-checker API (API Gateway HTTP API).
// The browser only ever talks to this endpoint — no AWS credentials ever
// reach the client. Override via VITE_FLIGHT_API_URL if the API is redeployed.
export const FLIGHT_API_URL =
  (import.meta.env["VITE_FLIGHT_API_URL"] as string | undefined) ??
  "https://yqbdu64gi8.execute-api.us-east-1.amazonaws.com";

export type Plan = {
  plan_name: "tokyo" | "seoul";
  label: string;
  origin: string;
  destination: string;
  route: string;
  hint: number;
};

export const PLANS: Plan[] = [
  { plan_name: "tokyo", label: "台北 ✈ 東京", origin: "TPE", destination: "TYO", route: "TPE-TYO", hint: 9325 },
  { plan_name: "seoul", label: "台北 ✈ 首爾", origin: "TPE", destination: "SEL", route: "TPE-SEL", hint: 5989 },
];

export type SubscriptionRow = {
  email: string;
  route: string;
  plan_name: "tokyo" | "seoul";
  origin: string;
  destination: string;
  target_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export async function fetchSubscriptions(email: string): Promise<SubscriptionRow[]> {
  const res = await fetch(`${FLIGHT_API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(`Failed to load subscriptions (${res.status})`);
  const body = await res.json();
  return body.items ?? [];
}

export async function subscribe(email: string, plan_name: string, target_price: number) {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, plan_name, target_price }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error ?? `Failed to subscribe (${res.status})`);
  return body;
}
