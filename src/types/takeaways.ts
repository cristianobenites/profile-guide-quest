export type ProjectStatus = "DRAFT" | "PROCESSING" | "READY" | "FAILED";
export type ModelProvider = "GEMINI" | "OPENAI";
export type OutputMode = "PPT_EDITABLE" | "PPT_EDITABLE_STYLED_BETA";
export type StylePreset = "CLEAN" | "COLORFUL" | "GRADIENT_MODERN" | "MINIMAL_BW";
export type Aggressiveness = "CONSERVATIVE" | "EXECUTIVE" | "BRUTAL";
export type Role = "normann_admin" | "tenant_manager" | "viewer";

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  status: ProjectStatus;
  context: Record<string, unknown>;
  confidential: boolean;
  model_provider: ModelProvider;
  output_mode: OutputMode;
  style_preset?: StylePreset | null;
  aggressiveness: Aggressiveness;
  last_opened_tab?: string | null;
  last_selected_slide?: number | null;
  current_version_id?: string | null;
  current_pipeline_run_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
  mfa_enabled: boolean;
  preferences: Record<string, unknown>;
  tenant_id?: string | null;
  created_at: string;
  updated_at: string;
}
