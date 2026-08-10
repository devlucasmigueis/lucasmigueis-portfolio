"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

// Server-rendered visible and animated in with pure CSS (anim-fade-up), so
// first paint never waits for hydration. After mount, elements still below
// the viewport are hidden again and revealed on approach, keeping the
// on-scroll reveal effect without making FCP/LCP depend on the JS bundle.
export function RevealOnView({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight - 80) return;

    el.classList.add("reveal-hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        el.classList.add("reveal-shown");
        observer.disconnect();
      },
      { rootMargin: "-80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("anim-fade-up", className)}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}s` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
