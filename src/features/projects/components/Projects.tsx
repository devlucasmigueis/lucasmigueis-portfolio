import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { RevealOnView } from "@/components/motion/reveal-on-view";
import { LiftCard } from "@/components/motion/lift-card";
import { Link } from "@/i18n/navigation";
import { getVisibleProjects } from "../visibility";
import type { ProjectAccent } from "../types";

const ACCENT_VARS: Record<ProjectAccent, string> = {
  green: "var(--success)",
  blue: "var(--syntax-tag)",
  amber: "var(--syntax-string)",
  violet: "var(--syntax-class)",
  orange: "var(--syntax-arbitrary)",
};

export async function Projects() {
  const t = await getTranslations("projects");
  const projects = await getVisibleProjects();

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8"
    >
      <RevealOnView>
        <header className="mb-10">
          <p className="text-syntax-tag font-mono text-sm">02.</p>
          <h2
            id="projects-title"
            className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-2 font-mono text-xs uppercase tracking-wider">
            └ {t("itemsCount", { count: projects.length })}
          </p>
          <div className="bg-border mt-6 h-px" aria-hidden />
        </header>

        <ul className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {projects.map((project, i) => {
            const index = String(i + 1).padStart(2, "0");
            const accentStyle = {
              ["--project-accent" as string]: ACCENT_VARS[project.accent],
            } as CSSProperties;
            const description = t(
              `items.${project.slug}.description` as "items.chave-movel-digital.description",
            );
            const category = t(
              `items.${project.slug}.category` as "items.chave-movel-digital.category",
            );

            const card = (
              <LiftCard
                style={accentStyle}
                className="border-border bg-editor-bg flex flex-col gap-5 rounded-2xl border p-5"
              >
                <div className="text-muted-foreground flex items-center justify-between font-mono text-xs">
                  <span>{index}</span>
                  <span>
                    {category} · {project.endYear}
                  </span>
                </div>

                <Preview
                  index={index}
                  name={project.name}
                  previewLabel={t("previewLabel")}
                  noPreviewLabel={t("noPreview")}
                  previewImage={project.previewImage}
                />

                <div className="flex flex-col gap-2">
                  <h3 className="text-foreground inline-flex items-center gap-2 text-xl font-semibold">
                    {project.name}
                    {project.hasCaseStudy ? (
                      <ArrowRight className="size-5" aria-hidden />
                    ) : null}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-border text-muted-foreground inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </LiftCard>
            );

            return (
              <li key={project.slug}>
                {project.hasCaseStudy ? (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </li>
            );
          })}
        </ul>
      </RevealOnView>
    </section>
  );
}

function Preview({
  index,
  name,
  previewLabel,
  noPreviewLabel,
  previewImage,
}: {
  index: string;
  name: string;
  previewLabel: string;
  noPreviewLabel: string;
  previewImage?: string;
}) {
  return (
    <div
      aria-hidden
      className="border-border bg-editor-bg-elevated relative aspect-video overflow-hidden rounded-xl border"
    >
      {previewImage ? (
        <Image
          src={previewImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0, transparent 18px, var(--border) 18px, var(--border) 19px)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 75% 25%, color-mix(in oklch, var(--project-accent) 22%, transparent), transparent 65%)",
            }}
          />
          <p className="text-muted-foreground absolute inset-0 flex items-center justify-center text-center font-mono text-xs uppercase tracking-wider">
            {noPreviewLabel}
          </p>
        </>
      )}

      <span
        className="bg-editor-bg/70 absolute right-3 top-3 inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs backdrop-blur-sm"
        style={{
          color: "var(--project-accent)",
          borderColor:
            "color-mix(in oklch, var(--project-accent) 45%, transparent)",
        }}
      >
        {previewLabel}
      </span>
      <span
        className="bg-editor-bg/70 absolute bottom-3 left-3 inline-flex items-center rounded px-2 py-0.5 font-mono text-xs uppercase tracking-wider backdrop-blur-sm"
        style={{ color: "var(--project-accent)" }}
      >
        {index} · {name}
      </span>
    </div>
  );
}
