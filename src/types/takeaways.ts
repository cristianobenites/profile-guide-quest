/* eslint-disable @typescript-eslint/no-explicit-any */
export type ProjectStatus = "DRAFT" | "PROCESSING" | "READY" | "FAILED";
export type ModelProvider = "GEMINI" | "OPENAI";
export type OutputMode = "PPT_EDITABLE" | "PPT_EDITABLE_STYLED_BETA";
export type StylePreset = "CLEAN" | "COLORFUL" | "GRADIENT_MODERN" | "MINIMAL_BW";
export type Aggressiveness = "CONSERVATIVE" | "EXECUTIVE" | "BRUTAL";
export type Role = "normann_admin" | "tenant_manager" | "viewer";
export type EvidenceStatus = "OK" | "NO_EVIDENCE";
export type AssetType = "SLIDE_RENDER" | "CHART" | "TABLE" | "IMAGE" | "ICON";
export type AssetRole = "NORMAL" | "HIGHLIGHT";
export type PipelineStep = "INGESTION" | "EVIDENCE_CATALOG" | "TAKEAWAYS" | "GROUPING" | "CURATION" | "DECK_BUILD" | "OUTLINE" | "EXPORT_PPT";
export type PipelineRunStatus = "PROCESSING" | "READY" | "WAITING" | "FAILED";

export interface Profile {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
  mfa_enabled: boolean;
  preferences: Record<string, any>;
  tenant_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  status: ProjectStatus;
  context: Record<string, any>;
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

export interface Slide {
  id: string;
  project_id: string;
  index: number;
  title_guess?: string | null;
  preview_image_url?: string | null;
  extracted_text?: string | null;
  created_at: string;
}

export interface ExtractedAsset {
  id: string;
  project_id: string;
  slide_id?: string | null;
  type: AssetType;
  role: AssetRole;
  label?: string | null;
  storage_url?: string | null;
  x?: number | null;
  y?: number | null;
  w?: number | null;
  h?: number | null;
  meta: Record<string, any>;
  created_at: string;
}

export interface Takeaway {
  id: string;
  project_id: string;
  slide_id?: string | null;
  text: string;
  score: number;
  evidence_status: EvidenceStatus;
  flags: Record<string, any>;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  project_id: string;
  title: string;
  order: number;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GroupItem {
  id: string;
  group_id: string;
  takeaway_id: string;
  order: number;
}

export interface DeckSlide {
  id: string;
  project_id: string;
  order: number;
  title: string;
  takeaway_text: string;
  bullets?: any[];
  evidence_status: EvidenceStatus;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PipelineRun {
  id: string;
  project_id: string;
  status: PipelineRunStatus;
  current_step: PipelineStep;
  progress: number;
  error?: string | null;
  step_history: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  label: string;
  summary?: string | null;
  snapshot: Record<string, any>;
  created_at: string;
}

export interface ExportArtifact {
  id: string;
  project_id: string;
  pipeline_run_id?: string | null;
  type: "PPTX" | "TAKEAWAYS_TXT" | "NARRATIVE_MD" | "AUDIT_JSON";
  status: "PROCESSING" | "READY" | "FAILED";
  file_name: string;
  storage_url?: string | null;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CurationSuggestion {
  id: string;
  project_id: string;
  group_id: string;
  from_takeaway_ids: string[];
  proposed_text: string;
  status: "SUGGESTED" | "APPLIED" | "REJECTED";
  applied_takeaway_id?: string | null;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AuditEvent {
  id: string;
  project_id: string;
  entity_type: string;
  entity_id?: string | null;
  action: string;
  reason?: string | null;
  payload: Record<string, any>;
  redacted: boolean;
  created_at: string;
}
