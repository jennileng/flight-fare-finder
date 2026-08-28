import { Link } from "react-router-dom";
import { BellRing, MailCheck, Plane, Target, Wallet } from "lucide-react";

import heroImage from "@/assets/hero-flight.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useDocumentHead } from "@/hooks/use-document-head";

const TITLE = "Flight price notifier — Fare alerts from San Jose (SJC)";
const DESCRIPTION =
  "Set a route from San Jose and a target price. We watch the cheapest fare and email you the moment it drops to or below your budget.";

const steps = [
  {
    icon: Plane,
    title: "Pick a route from SJC",
    body: "Choose from popular nonstop and one-stop routes leaving San Jose Mineta.",
  },
  {
    icon: Target,
    title: "Name your price",
    body: "Tell us the number that makes the trip worth it. No dates required.",
  },
  {
    icon: MailCheck,
    title: "Get the email, book it",
    body: "When the cheapest fare hits or dips below your target, an email lands in your inbox.",
  },
];

const routes = [
  { city: "Los Angeles", code: "LAX", typical: 98, watch: 59 },
  { city: "Las Vegas", code: "LAS", typical: 112, watch: 69 },
  { city: "Seattle", code: "SEA", typical: 148, watch: 89 },
  { city: "Honolulu", code: "HNL", typical: 358, watch: 249 },
  { city: "Austin", code: "AUS", typical: 236, watch: 149 },
  { city: "New York", code: "JFK", typical: 312, watch: 199 },
];

export default function Landing() {
  useDocumentHead({ title: TITLE, description: DESCRIPTION });

  return (
    <div className="min-h-screen bg-cabin">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Airplane wing above golden sunset clouds"
              width={1600}
              height={1008}
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>

          <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <BellRing className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Watching fares out of San Jose
            </span>

            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              <span className="text-sunrise">Flight price notifier</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Set a route and a target price — we email you when the fare drops. Flexible on dates,
              strict on budget: that's the whole idea.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/auth">Start watching fares</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>

            <dl className="mt-16 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-3">
              {[
                { k: "Checks per day", v: "24" },
                { k: "Routes from SJC", v: "40+" },
                { k: "Dates needed", v: "None" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">{s.k}</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Three steps, then stop refreshing
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <article key={step.title} className="surface-panel rounded-2xl p-6 shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Routes */}
        <section id="routes" className="mx-auto max-w-6xl px-5 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Popular routes travelers watch
            </h2>
            <p className="text-sm text-muted-foreground">
              Typical fare vs. a target worth waiting for.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((r) => (
              <div
                key={r.code}
                className="surface-panel flex items-center justify-between rounded-2xl px-5 py-4"
              >
                <div>
                  <p className="font-display text-lg font-semibold">
                    SJC <span className="text-muted-foreground">→</span> {r.code}
                  </p>
                  <p className="text-sm text-muted-foreground">{r.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Typical ${r.typical}
                  </p>
                  <p className="font-display text-2xl font-semibold text-primary">${r.watch}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="surface-panel flex flex-col items-start gap-6 rounded-3xl p-10 shadow-lift sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold">Fly when it's cheap, not when it's convenient</h2>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
                Free while we watch. You only pay the airline.
              </p>
            </div>
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-5 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Flight price notifier · Fare alerts out of San Jose, CA
        </div>
      </footer>
    </div>
  );
}
