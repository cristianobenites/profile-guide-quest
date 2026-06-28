import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Project } from "@/types/takeaways";

const listProjectsInput = z.object({
  status: z.enum(["ALL", "DRAFT", "PROCESSING", "READY", "FAILED"]).default("ALL"),
  q: z.string().default(""),
});

export const getProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => listProjectsInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    let query = supabase.from("projects").select("*").eq("owner_id", userId);

    if (data.status !== "ALL") {
      query = query.eq("status", data.status);
    }

    const { data: projects, error } = await query.order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);

    const result = (projects ?? []) as Project[];

    if (!data.q) return result;

    const q = data.q.toLowerCase();
    return result.filter((p) => p.name.toLowerCase().includes(q));
  });
