import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            Flight price notifier
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            How it works
          </a>
          <a
            href="#routes"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Routes
          </a>
          <Button asChild size="sm">
            <Link to="/auth">Sign in</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
