"use cache";

import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { buildAlternates } from "@/lib/metadata";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PersonJsonLd } from "@/components/json-ld";
import { Hero } from "@/features/hero";
import { About } from "@/features/about";
import { FLAGS_CACHE_LIFE, Projects } from "@/features/projects";
import { Skills } from "@/features/skills";
import { GithubActivity } from "@/features/github";
import { Experience } from "@/features/experience";
import { Contact } from "@/features/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return {
    alternates: buildAlternates("/", locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // Project visibility flags (Global Config) must propagate without a deploy.
  cacheLife(FLAGS_CACHE_LIFE);

  return (
    <>
      <PersonJsonLd />
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <GithubActivity />
        <Experience />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
