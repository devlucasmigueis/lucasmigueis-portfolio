import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Vercel Global Config connection string (created by "Connect Project";
    // EDGE_CONFIG is the pre-rename legacy name). Absent locally, so project
    // visibility flags fall back to "all visible".
    GLOBAL_CONFIG: z.string().url().optional(),
    EDGE_CONFIG: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
