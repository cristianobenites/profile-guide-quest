export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      extracted_assets: {
        Row: {
          created_at: string
          h: number | null
          id: string
          label: string | null
          meta: Json
          project_id: string
          role: string
          slide_id: string | null
          storage_url: string | null
          type: string
          w: number | null
          x: number | null
          y: number | null
        }
        Insert: {
          created_at?: string
          h?: number | null
          id?: string
          label?: string | null
          meta?: Json
          project_id: string
          role?: string
          slide_id?: string | null
          storage_url?: string | null
          type: string
          w?: number | null
          x?: number | null
          y?: number | null
        }
        Update: {
          created_at?: string
          h?: number | null
          id?: string
          label?: string | null
          meta?: Json
          project_id?: string
          role?: string
          slide_id?: string | null
          storage_url?: string | null
          type?: string
          w?: number | null
          x?: number | null
          y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "extracted_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_assets_slide_id_fkey"
            columns: ["slide_id"]
            isOneToOne: false
            referencedRelation: "slides"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_runs: {
        Row: {
          created_at: string
          current_step: string
          error: string | null
          id: string
          progress: number
          project_id: string
          status: string
          step_history: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: string
          error?: string | null
          id?: string
          progress?: number
          project_id: string
          status?: string
          step_history?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: string
          error?: string | null
          id?: string
          progress?: number
          project_id?: string
          status?: string
          step_history?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          mfa_enabled: boolean
          mfa_secret: string | null
          name: string | null
          preferences: Json
          role: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          mfa_enabled?: boolean
          mfa_secret?: string | null
          name?: string | null
          preferences?: Json
          role?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          mfa_enabled?: boolean
          mfa_secret?: string | null
          name?: string | null
          preferences?: Json
          role?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_versions: {
        Row: {
          created_at: string
          id: string
          label: string
          project_id: string
          snapshot: Json
          summary: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          project_id: string
          snapshot?: Json
          summary?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          project_id?: string
          snapshot?: Json
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          aggressiveness: string
          confidential: boolean
          context: Json
          created_at: string
          current_pipeline_run_id: string | null
          current_version_id: string | null
          id: string
          last_opened_tab: string | null
          last_selected_slide: number | null
          model_provider: string
          name: string
          output_mode: string
          owner_id: string
          status: string
          style_preset: string | null
          updated_at: string
        }
        Insert: {
          aggressiveness?: string
          confidential?: boolean
          context?: Json
          created_at?: string
          current_pipeline_run_id?: string | null
          current_version_id?: string | null
          id?: string
          last_opened_tab?: string | null
          last_selected_slide?: number | null
          model_provider?: string
          name: string
          output_mode?: string
          owner_id: string
          status?: string
          style_preset?: string | null
          updated_at?: string
        }
        Update: {
          aggressiveness?: string
          confidential?: boolean
          context?: Json
          created_at?: string
          current_pipeline_run_id?: string | null
          current_version_id?: string | null
          id?: string
          last_opened_tab?: string | null
          last_selected_slide?: number | null
          model_provider?: string
          name?: string
          output_mode?: string
          owner_id?: string
          status?: string
          style_preset?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      slides: {
        Row: {
          created_at: string
          extracted_text: string | null
          id: string
          index: number
          preview_image_url: string | null
          project_id: string
          title_guess: string | null
        }
        Insert: {
          created_at?: string
          extracted_text?: string | null
          id?: string
          index: number
          preview_image_url?: string | null
          project_id: string
          title_guess?: string | null
        }
        Update: {
          created_at?: string
          extracted_text?: string | null
          id?: string
          index?: number
          preview_image_url?: string | null
          project_id?: string
          title_guess?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slides_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      takeaways: {
        Row: {
          created_at: string
          evidence_status: string
          flags: Json
          id: string
          meta: Json
          project_id: string
          score: number
          slide_id: string | null
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          evidence_status?: string
          flags?: Json
          id?: string
          meta?: Json
          project_id: string
          score?: number
          slide_id?: string | null
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          evidence_status?: string
          flags?: Json
          id?: string
          meta?: Json
          project_id?: string
          score?: number
          slide_id?: string | null
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "takeaways_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takeaways_slide_id_fkey"
            columns: ["slide_id"]
            isOneToOne: false
            referencedRelation: "slides"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
