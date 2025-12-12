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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_automation_settings: {
        Row: {
          auto_publish: boolean | null
          categories: string[] | null
          created_at: string | null
          enabled: boolean | null
          frequency: string | null
          id: string
          last_generated_at: string | null
          updated_at: string | null
        }
        Insert: {
          auto_publish?: boolean | null
          categories?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          last_generated_at?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_publish?: boolean | null
          categories?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          last_generated_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string
          id: string
          image_url: string | null
          image_urls: string[] | null
          job_site_url: string | null
          published: boolean | null
          scheduled_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string
          content: string
          created_at?: string | null
          excerpt: string
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          job_site_url?: string | null
          published?: boolean | null
          scheduled_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          job_site_url?: string | null
          published?: boolean | null
          scheduled_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      interview_sessions: {
        Row: {
          answers: Json
          company_name: string | null
          completed_at: string | null
          created_at: string
          feedback: Json
          id: string
          job_application_id: string | null
          job_title: string
          overall_score: number | null
          questions: Json
          user_id: string
        }
        Insert: {
          answers?: Json
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          feedback?: Json
          id?: string
          job_application_id?: string | null
          job_title: string
          overall_score?: number | null
          questions?: Json
          user_id: string
        }
        Update: {
          answers?: Json
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          feedback?: Json
          id?: string
          job_application_id?: string | null
          job_title?: string
          overall_score?: number | null
          questions?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_job_application_id_fkey"
            columns: ["job_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_date: string | null
          company_name: string
          contact_email: string | null
          contact_name: string | null
          created_at: string
          deadline: string | null
          id: string
          job_description: string | null
          job_title: string
          job_url: string | null
          location: string | null
          notes: string | null
          salary_max: number | null
          salary_min: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_date?: string | null
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          job_description?: string | null
          job_title: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_date?: string | null
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          job_description?: string | null
          job_title?: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_profiles: {
        Row: {
          certifications: string[] | null
          contact: Json
          created_at: string | null
          education: Json | null
          experience_snippets: Json
          id: string
          skills: Json
          summary: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certifications?: string[] | null
          contact: Json
          created_at?: string | null
          education?: Json | null
          experience_snippets: Json
          id?: string
          skills: Json
          summary: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certifications?: string[] | null
          contact?: Json
          created_at?: string | null
          education?: Json | null
          experience_snippets?: Json
          id?: string
          skills?: Json
          summary?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          job_spec: string
          processed_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          job_spec: string
          processed_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          job_spec?: string
          processed_at?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
