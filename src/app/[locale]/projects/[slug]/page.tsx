"use cache";

import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/social";
import { RevealOnView } from "@/components/motion/reveal-on-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildAlternates } from "@/lib/metadata";
import { cn } from "@/lib/cn";
import {
  FLAGS_CACHE_LIFE,
  getVisibleProjects,
  projects,
} from "@/features/projects";
import type { ProjectAccent, ProjectStat } from "@/features/projects/types";

const ACCENT_VARS: Record<ProjectAccent, string> = {
  green: "var(--success)",
  blue: "var(--syntax-tag)",
  amber: "var(--syntax-string)",
  violet: "var(--syntax-class)",
  orange: "var(--syntax-arbitrary)",
};

type ProjectStatTranslation = {
  label: string;
  value: string;
  unit?: string;
  description: string;
};

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    for (const project of projects) {
      if (project.hasCaseStudy) params.push({ locale, slug: project.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  cacheLife(FLAGS_CACHE_LIFE);
  const visibleProjects = await getVisibleProjects();
  const project = visibleProjects.find((p) => p.slug === slug);
  if (!project) return {};
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const description = t(
    `items.${project.slug}.description` as "items.chave-movel-digital.description",
  );
  return {
    title: project.name,
    description,
    alternates: buildAlternates(`/projects/${slug}`, locale),
    openGraph: {
      title: project.name,
      description,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  cacheLife(FLAGS_CACHE_LIFE);

  const visibleProjects = await getVisibleProjects();
  const projectIndex = visibleProjects.findIndex((p) => p.slug === slug);
  const project = projectIndex >= 0 ? visibleProjects[projectIndex] : undefined;
  if (!project || !project.hasCaseStudy) notFound();

  const t = await getTranslations("projects");
  const indexLabel = String(projectIndex + 1).padStart(2, "0");
  const yearsCount = project.endYear - project.startYear;

  const category = t(
    `items.${project.slug}.category` as "items.chave-movel-digital.category",
  );
  const role = t(
    `items.${project.slug}.caseStudy.role` as "items.chave-movel-digital.caseStudy.role",
  );

  const accentStyle = {
    ["--project-accent" as string]: ACCENT_VARS[project.accent],
  } as CSSProperties;

  const sections = [
    {
      label: t("caseStudy.problem"),
      body: t(
        `items.${project.slug}.caseStudy.problem` as "items.chave-movel-digital.caseStudy.problem",
      ),
    },
    {
      label: t("caseStudy.solution"),
      body: t(
        `items.${project.slug}.caseStudy.solution` as "items.chave-movel-digital.caseStudy.solution",
      ),
    },
    ...(project.hasImpact
      ? [
          {
            label: t("caseStudy.impact"),
            body: t(
              `items.${project.slug}.caseStudy.impact` as "items.chave-movel-digital.caseStudy.impact",
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        style={accentStyle}
      >
        <RevealOnView>
          <Link
            href="/#projects"
            className="text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm font-medium transition-colors motion-reduce:transition-none"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("backToHome")}
          </Link>

          <header className="mb-10">
            <p className="text-syntax-tag inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider">
              <span className="bg-syntax-tag inline-block h-px w-8" aria-hidden />
              {t("caseStudyLabel")} · {indexLabel}
            </p>
            <h1 className="text-hero-name mt-6 font-semibold leading-none tracking-tight">
              {project.name}
            </h1>
            <ul className="text-muted-foreground mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs">
              <MetaItem>{category}</MetaItem>
              <MetaItem>
                {project.startYear === project.endYear
                  ? project.startYear
                  : `${project.startYear} — ${project.endYear}`}
              </MetaItem>
              {yearsCount > 0 ? (
                <MetaItem>{t("yearsSpan", { count: yearsCount })}</MetaItem>
              ) : null}
              <MetaItem>{role}</MetaItem>
            </ul>
            <div className="bg-border mt-10 h-px" aria-hidden />
          </header>

          <StatsGrid project={project} />

          <div className="bg-border my-12 h-px" aria-hidden />

          <Overview slug={project.slug} />

          {project.liveUrl || project.sourceUrl ? (
            <div className="mt-12 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-border text-foreground hover:bg-accent inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors motion-reduce:transition-none"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  {t("viewLive")}
                </a>
              ) : null}
              {project.sourceUrl ? (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-border text-foreground hover:bg-accent inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors motion-reduce:transition-none"
                >
                  <GithubIcon className="size-4" />
                  {t("viewSource")}
                </a>
              ) : null}
            </div>
          ) : null}

          <ul className="mt-12 flex flex-col">
            {sections.map((section, i) => (
              <li
                key={section.label}
                className={cn(
                  "grid grid-cols-1 gap-4 py-6 lg:grid-cols-[12rem_1fr] lg:gap-10 lg:py-8",
                  i > 0 && "border-border border-t",
                )}
              >
                <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                  └ {section.label}
                </p>
                <p className="text-foreground text-pretty leading-relaxed">
                  {section.body}
                </p>
              </li>
            ))}
          </ul>
        </RevealOnView>
      </main>
      <SiteFooter />
    </>
  );
}

function MetaItem({ children }: { children: ReactNode }) {
  return (
    <li className="inline-flex items-center gap-2">
      <span className="text-syntax-tag" aria-hidden>
        └
      </span>
      <span>{children}</span>
    </li>
  );
}

async function StatsGrid({
  project,
}: {
  project: { slug: string; stats: ReadonlyArray<ProjectStat> };
}) {
  const t = await getTranslations("projects");

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {project.stats.map((stat, i) => {
        const data = (t.raw as (key: string) => unknown)(
          `items.${project.slug}.stats.${stat.id}`,
        ) as ProjectStatTranslation;
        return (
          <li
            key={stat.id}
            className={cn(
              "flex flex-col gap-3 px-6 py-6",
              i > 0 && "sm:border-l border-border",
              i === 2 && "sm:border-l-0 lg:border-l",
            )}
          >
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
              {data.label}
            </p>
            <p className="flex items-baseline gap-1.5 leading-none">
              <span
                className={cn(
                  "text-5xl font-bold sm:text-6xl",
                  stat.highlight && "text-[color:var(--project-accent)]",
                )}
              >
                {data.value}
              </span>
              {data.unit ? (
                <span className="text-muted-foreground text-xl font-medium">
                  {data.unit}
                </span>
              ) : null}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {data.description}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

async function Overview({ slug }: { slug: string }) {
  const t = await getTranslations("projects");
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[12rem_1fr] lg:gap-10">
      <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
        └ {t("overviewLabel")}
      </p>
      <p className="text-foreground text-pretty text-2xl font-medium leading-snug sm:text-3xl">
        {t.rich(`items.${slug}.overview` as "items.chave-movel-digital.overview", {
          emphasis: (chunks) => (
            <em className="text-syntax-tag font-medium italic">{chunks}</em>
          ),
        })}
      </p>
    </div>
  );
}
