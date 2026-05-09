import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-sea opacity-95" />
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-coral/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-primary-foreground">
        <span className="inline-block px-3 py-1 rounded-full bg-coral/20 text-coral border border-coral/30 text-xs font-semibold tracking-widest uppercase">
          {eyebrow}
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-black text-balance leading-[0.95]">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl opacity-80 text-balance">{subtitle}</p>
      </div>
    </section>
  );
}
