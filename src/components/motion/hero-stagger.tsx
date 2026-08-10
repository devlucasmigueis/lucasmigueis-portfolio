import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Pure-CSS staggered entrance (see globals.css): the hero paints as soon as
// the stylesheet arrives instead of waiting for JS to hydrate.
export function HeroStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("hero-stagger", className)}>{children}</div>;
}

export function HeroStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
