import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Project, Slide, Takeaway, ExtractedAsset, PipelineRun } from "@/types/takeaways";

const projectIdInput = z.object({ projectId: z.string().uuid() });

export const getProjectById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => projectIdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", data.projectId)
      .eq("owner_id", userId)
      .single();
    if (error) throw new Error(error.message);
    return project as Project;
  });

export const getProjectSlides = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => projectIdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: slides, error } = await supabase
      .from("slides")
      .select("*")
      .eq("project_id", data.projectId)
      .order("index", { ascending: true });
    if (error) throw new Error(error.message);
    return (slides ?? []) as Slide[];
  });

export const getProjectTakeaways = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => projectIdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: takeaways, error } = await supabase
      .from("takeaways")
      .select("*")
      .eq("project_id", data.projectId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (takeaways ?? []) as Takeaway[];
  });

export const getProjectAssets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => projectIdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: assets, error } = await supabase
      .from("extracted_assets")
      .select("*")
      .eq("project_id", data.projectId);
    if (error) throw new Error(error.message);
    return (assets ?? []) as ExtractedAsset[];
  });

export const getProjectPipelineRun = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => projectIdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: run, error } = await supabase
      .from("pipeline_runs")
      .select("*")
      .eq("project_id", data.projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (run ?? null) as PipelineRun | null;
  });
