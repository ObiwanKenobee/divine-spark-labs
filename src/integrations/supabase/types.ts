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
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          event_hash: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          previous_hash: string | null
          resource_id: string | null
          resource_type: string | null
          status: string | null
          tenant_id: string | null
          user_agent: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          event_hash: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          previous_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          status?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          event_hash?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          previous_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          status?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          location: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fellowship_applications: {
        Row: {
          applicant_name: string
          created_at: string
          email: string
          experience: string | null
          fellowship_id: string
          goals: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          user_id: string
          why_apply: string
        }
        Insert: {
          applicant_name: string
          created_at?: string
          email: string
          experience?: string | null
          fellowship_id: string
          goals?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          user_id: string
          why_apply: string
        }
        Update: {
          applicant_name?: string
          created_at?: string
          email?: string
          experience?: string | null
          fellowship_id?: string
          goals?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
          why_apply?: string
        }
        Relationships: [
          {
            foreignKeyName: "fellowship_applications_fellowship_id_fkey"
            columns: ["fellowship_id"]
            isOneToOne: false
            referencedRelation: "fellowships"
            referencedColumns: ["id"]
          },
        ]
      }
      fellowships: {
        Row: {
          cohort_size: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          program_type: string
          requirements: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cohort_size?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          program_type: string
          requirements?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cohort_size?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          program_type?: string
          requirements?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      forums: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          metadata: Json | null
          name: string
          organization: string | null
          plan: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          metadata?: Json | null
          name: string
          organization?: string | null
          plan: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          name?: string
          organization?: string | null
          plan?: string
          status?: string | null
        }
        Relationships: []
      }
      investment_opportunities: {
        Row: {
          created_at: string
          currency: string | null
          deadline: string | null
          description: string
          founder_id: string | null
          founder_name: string
          funding_goal: number | null
          funding_raised: number | null
          id: string
          impact_metrics: Json | null
          location: string | null
          project_name: string
          sector: string
          stage: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description: string
          founder_id?: string | null
          founder_name: string
          funding_goal?: number | null
          funding_raised?: number | null
          id?: string
          impact_metrics?: Json | null
          location?: string | null
          project_name: string
          sector: string
          stage: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string
          founder_id?: string | null
          founder_name?: string
          funding_goal?: number | null
          funding_raised?: number | null
          id?: string
          impact_metrics?: Json | null
          location?: string | null
          project_name?: string
          sector?: string
          stage?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          plan: string | null
          subscribed_at: string
          tenant_id: string | null
          unsubscribe_token: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          plan?: string | null
          subscribed_at?: string
          tenant_id?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          plan?: string | null
          subscribed_at?: string
          tenant_id?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_consents: {
        Row: {
          accepted: boolean | null
          accepted_at: string | null
          consent_text: string
          consent_type: Database["public"]["Enums"]["consent_type"]
          consent_version: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted?: boolean | null
          accepted_at?: string | null
          consent_text: string
          consent_type: Database["public"]["Enums"]["consent_type"]
          consent_version: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted?: boolean | null
          accepted_at?: string | null
          consent_text?: string
          consent_type?: Database["public"]["Enums"]["consent_type"]
          consent_version?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_consents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          joined_at: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          contact_email: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          region: string
          sector: string
          status: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          region: string
          sector: string
          status?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          region?: string
          sector?: string
          status?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          onboarding_step: number | null
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      program_members: {
        Row: {
          id: string
          joined_at: string
          program_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          program_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          program_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_members_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          seats: number | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          seats?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          seats?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      research_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      research_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "research_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          role: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          billing_plan: string | null
          compliance_flags: Json | null
          created_at: string | null
          created_by: string | null
          data_residency: string | null
          domain: string | null
          id: string
          metadata: Json | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          billing_plan?: string | null
          compliance_flags?: Json | null
          created_at?: string | null
          created_by?: string | null
          data_residency?: string | null
          domain?: string | null
          id?: string
          metadata?: Json | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          billing_plan?: string | null
          compliance_flags?: Json | null
          created_at?: string | null
          created_by?: string | null
          data_residency?: string | null
          domain?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transformation_journal: {
        Row: {
          content: string
          created_at: string
          entry_type: string
          id: string
          is_private: boolean | null
          milestone_date: string | null
          mood: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          entry_type?: string
          id?: string
          is_private?: boolean | null
          milestone_date?: string | null
          mood?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_type?: string
          id?: string
          is_private?: boolean | null
          milestone_date?: string | null
          mood?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      women_pioneers: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          contact_email: string | null
          country: string
          created_at: string
          created_by: string | null
          focus_areas: string[] | null
          id: string
          is_verified: boolean | null
          lat: number | null
          linkedin_url: string | null
          lng: number | null
          name: string
          projects: string[] | null
          region: string
          title: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          contact_email?: string | null
          country: string
          created_at?: string
          created_by?: string | null
          focus_areas?: string[] | null
          id?: string
          is_verified?: boolean | null
          lat?: number | null
          linkedin_url?: string | null
          lng?: number | null
          name: string
          projects?: string[] | null
          region: string
          title?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          contact_email?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          focus_areas?: string[] | null
          id?: string
          is_verified?: boolean | null
          lat?: number | null
          linkedin_url?: string | null
          lng?: number | null
          name?: string
          projects?: string[] | null
          region?: string
          title?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          permissions: Json | null
          role: Database["public"]["Enums"]["workspace_role"] | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["workspace_role"] | null
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["workspace_role"] | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          created_by: string
          data_classification:
            | Database["public"]["Enums"]["data_classification"]
            | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          provisioned_at: string | null
          resource_quota: Json | null
          slug: string
          status: Database["public"]["Enums"]["workspace_status"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          data_classification?:
            | Database["public"]["Enums"]["data_classification"]
            | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          provisioned_at?: string | null
          resource_quota?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["workspace_status"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          data_classification?:
            | Database["public"]["Enums"]["data_classification"]
            | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          provisioned_at?: string | null
          resource_quota?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["workspace_status"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_event_hash: {
        Args: {
          p_action: string
          p_actor_id: string
          p_event_type: string
          p_metadata: Json
          p_previous_hash: string
          p_timestamp: string
        }
        Returns: string
      }
      get_user_admin_tenant_ids: {
        Args: { _user_id: string }
        Returns: string[]
      }
      get_user_tenant_ids: { Args: { _user_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_tenant_admin: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
      is_tenant_member: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          _action: string
          _metadata?: Json
          _resource_id?: string
          _resource_type?: string
        }
        Returns: string
      }
      log_audit_event_immutable: {
        Args: {
          p_action: string
          p_event_type: string
          p_metadata?: Json
          p_resource_id?: string
          p_resource_type?: string
          p_tenant_id?: string
          p_workspace_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "member" | "viewer"
      consent_type:
        | "terms_of_service"
        | "privacy_policy"
        | "data_processing"
        | "research_ethics"
      data_classification: "public" | "restricted" | "sacred"
      workspace_role:
        | "owner"
        | "admin"
        | "project_lead"
        | "fellow"
        | "researcher"
        | "observer"
      workspace_status:
        | "provisioning"
        | "active"
        | "suspended"
        | "archived"
        | "deleted"
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
      app_role: ["admin", "member", "viewer"],
      consent_type: [
        "terms_of_service",
        "privacy_policy",
        "data_processing",
        "research_ethics",
      ],
      data_classification: ["public", "restricted", "sacred"],
      workspace_role: [
        "owner",
        "admin",
        "project_lead",
        "fellow",
        "researcher",
        "observer",
      ],
      workspace_status: [
        "provisioning",
        "active",
        "suspended",
        "archived",
        "deleted",
      ],
    },
  },
} as const
