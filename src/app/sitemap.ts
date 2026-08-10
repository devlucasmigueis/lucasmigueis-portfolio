import type { MetadataRoute } from "next";
import { env } from "@/env";
import { routing } from "@/i18n/routing";
import { getVisibleProjects } from "@/features/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getVisibleProjects();
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const lastModified = new Date();
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    const root = prefix || "/";

    urls.push({
      url: `${base}${root}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    });
    urls.push({
      url: `${base}${prefix}/now`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const project of projects) {
      if (!project.hasCaseStudy) continue;
      urls.push({
        url: `${base}${prefix}/projects/${project.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return urls;
}
