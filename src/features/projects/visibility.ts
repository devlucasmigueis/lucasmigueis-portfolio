import { getAll } from "@vercel/global-config";
import { env } from "@/env";
import { projects } from "./data";
import type { Project } from "./types";

// cacheLife profile for pages that render visibility flags: revalidate keeps
// flag flips propagating within a minute, while the long expire means
// visitors are always served from cache with regeneration in the background —
// a short expire was causing blocking renders (15s+ FCP) on low traffic.
export const FLAGS_CACHE_LIFE = {
  stale: 300,
  revalidate: 60,
  expire: 60 * 60 * 24 * 30,
} as const;

// Per-project visibility flags live in Vercel Global Config (formerly Edge
// Config), one boolean per project under the key `show_<slug>` (e.g.
// `show_eiri-petsitter`). Flipping a flag in the Vercel dashboard hides/shows
// the project without a deploy — pages using this pick it up on their next
// revalidation.
//
// Fail-open by design: a missing key, no store connection (local dev) or a
// failed read all mean "visible", so the site never loses projects by
// accident.
export async function getVisibleProjects(): Promise<ReadonlyArray<Project>> {
  if (!env.GLOBAL_CONFIG && !env.EDGE_CONFIG) return projects;
  try {
    const flags = await getAll<Record<string, boolean>>();
    return projects.filter((p) => flags?.[`show_${p.slug}`] !== false);
  } catch {
    return projects;
  }
}
