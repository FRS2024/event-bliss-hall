export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          admin_id: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          login_at: string
          logout_at: string | null
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          login_at?: string
          logout_at?: string | null
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          login_at?: string
          logout_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          admin_id: string
          content: string
          created_at: string
          id: string
          is_published: boolean | null
          sent_at: string | null
          target_audience: string | null
          target_users: string[] | null
          title: string
        }
        Insert: {
          admin_id: string
          content: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          sent_at?: string | null
          target_audience?: string | null
          target_users?: string[] | null
          title: string
        }
        Update: {
          admin_id?: string
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          sent_at?: string | null
          target_audience?: string | null
          target_users?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          end_time: string | null
          event_date: string
          guest_count: number
          guest_id: string
          host_id: string
          id: string
          special_requests: string | null
          start_time: string | null
          status: string | null
          total_price: number
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          event_date: string
          guest_count: number
          guest_id: string
          host_id: string
          id?: string
          special_requests?: string | null
          start_time?: string | null
          status?: string | null
          total_price: number
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          event_date?: string
          guest_count?: number
          guest_id?: string
          host_id?: string
          id?: string
          special_requests?: string | null
          start_time?: string | null
          status?: string | null
          total_price?: number
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          admin_email_id: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
          user_email_id: string | null
        }
        Insert: {
          admin_email_id?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
          user_email_id?: string | null
        }
        Update: {
          admin_email_id?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
          user_email_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          booking_id: string | null
          created_at: string
          guest_id: string
          host_id: string
          id: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          guest_id: string
          host_id: string
          id?: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          guest_id?: string
          host_id?: string
          id?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      flagged_content: {
        Row: {
          admin_id: string | null
          content_id: string
          content_type: string
          created_at: string
          description: string | null
          flagged_by: string | null
          id: string
          reason: string
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          admin_id?: string | null
          content_id: string
          content_type: string
          created_at?: string
          description?: string | null
          flagged_by?: string | null
          id?: string
          reason: string
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          admin_id?: string | null
          content_id?: string
          content_type?: string
          created_at?: string
          description?: string | null
          flagged_by?: string | null
          id?: string
          reason?: string
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flagged_content_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          business_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      venue_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean | null
          notes: string | null
          venue_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          venue_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_availability_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_features: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_features_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_images_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string
          capacity: number
          category: string
          city: string
          created_at: string
          description: string
          event_types: string[] | null
          host_id: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          price_per_day: number | null
          price_per_event: number | null
          price_per_hour: number | null
          updated_at: string
        }
        Insert: {
          address: string
          capacity: number
          category: string
          city: string
          created_at?: string
          description: string
          event_types?: string[] | null
          host_id: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          price_per_day?: number | null
          price_per_event?: number | null
          price_per_hour?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          capacity?: number
          category?: string
          city?: string
          created_at?: string
          description?: string
          event_types?: string[] | null
          host_id?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          price_per_day?: number | null
          price_per_event?: number | null
          price_per_hour?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
