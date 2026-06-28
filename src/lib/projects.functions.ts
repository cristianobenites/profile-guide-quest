import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Project } from "@/types/takeaways";

const listProjectsInput = z.object({
  status: z.enum(["ALL", "DRAFT", "PROCESSING", "READY", "FAILED"]).default("ALL"),
  q: z.string().default(""),
});

const createProjectInput = z.object({
  name: z.string().min(1),
  context: z.record(z.any()).default({}),
  confidential: z.boolean().default(false),
  output_mode: z.enum(["PPT_EDITABLE", "PPT_EDITABLE_STYLED_BETA"]).default("PPT_EDITABLE"),
  style_preset: z.enum(["CLEAN", "COLORFUL", "GRADIENT_MODERN", "MINIMAL_BW"]).nullable().optional(),
  aggressiveness: z.enum(["CONSERVATIVE", "EXECUTIVE", "BRUTAL"]).default("EXECUTIVE"),
  model_provider: z.enum(["GEMINI", "OPENAI"]).default("GEMINI"),
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

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => createProjectInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        owner_id: userId,
        name: data.name,
        context: data.context,
        confidential: data.confidential,
        output_mode: data.output_mode,
        style_preset: data.style_preset,
        aggressiveness: data.aggressiveness,
        model_provider: data.model_provider,
        status: "DRAFT",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return project as Project;
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("projects").delete().eq("id", data.id).eq("owner_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
