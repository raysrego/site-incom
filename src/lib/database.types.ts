export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = 'admin' | 'doctor';
export type AppointmentType = 'inperson' | 'online';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: AppRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          role?: AppRole;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      doctors: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          crm: string;
          specialty: string;
          photo_url: string | null;
          bio: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string | null;
          name: string;
          crm: string;
          specialty: string;
          photo_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
        };
        Update: {
          user_id?: string | null;
          name?: string;
          crm?: string;
          specialty?: string;
          photo_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      doctor_availability: {
        Row: {
          id: string;
          doctor_id: string;
          weekday: number;
          start_time: string;
          end_time: string;
          slot_duration_minutes: number;
          location_type: AppointmentType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          doctor_id: string;
          weekday: number;
          start_time: string;
          end_time: string;
          slot_duration_minutes?: number;
          location_type: AppointmentType;
        };
        Update: {
          weekday?: number;
          start_time?: string;
          end_time?: string;
          slot_duration_minutes?: number;
          location_type?: AppointmentType;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          doctor_id: string;
          appointment_date: string;
          start_time: string;
          end_time: string;
          appointment_type: AppointmentType;
          status: AppointmentStatus;
          patient_name: string;
          patient_birth_date: string;
          patient_insurance: string;
          patient_phone: string;
          patient_email: string | null;
          patient_notes: string | null;
          meeting_room_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: {
          status?: AppointmentStatus;
          meeting_room_id?: string | null;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          author_name: string;
          cover_image: string | null;
          tags: string[];
          published: boolean;
          published_at: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          title: string;
          excerpt?: string;
          content?: string;
          author_name?: string;
          cover_image?: string | null;
          tags?: string[];
          published?: boolean;
          published_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          author_name?: string;
          cover_image?: string | null;
          tags?: string[];
          published?: boolean;
          published_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          slug: string;
          title: string;
          intro: string;
          body: string;
          hero_image: string | null;
          published: boolean;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          title: string;
          intro?: string;
          body?: string;
          hero_image?: string | null;
          published?: boolean;
          updated_by?: string | null;
        };
        Update: {
          title?: string;
          intro?: string;
          body?: string;
          hero_image?: string | null;
          published?: boolean;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      video_sessions: {
        Row: {
          id: string;
          appointment_id: string;
          room_id: string;
          status: 'waiting' | 'live' | 'ended';
          started_at: string | null;
          ended_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          appointment_id: string;
          room_id: string;
          status?: 'waiting' | 'live' | 'ended';
          started_at?: string | null;
          ended_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          status?: 'waiting' | 'live' | 'ended';
          started_at?: string | null;
          ended_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      claim_initial_admin: { Args: Record<string, never>; Returns: boolean };
      current_user_is_admin: { Args: Record<string, never>; Returns: boolean };
      create_public_appointment: {
        Args: {
          p_doctor_id: string;
          p_appointment_date: string;
          p_start_time: string;
          p_appointment_type: AppointmentType;
          p_patient_name: string;
          p_patient_birth_date: string;
          p_patient_insurance: string;
          p_patient_phone: string;
          p_patient_email?: string | null;
          p_patient_notes?: string | null;
        };
        Returns: Database['public']['Tables']['appointments']['Row'];
      };
    };
    Enums: {
      app_role: AppRole;
      appointment_type: AppointmentType;
      appointment_status: AppointmentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Doctor = Database['public']['Tables']['doctors']['Row'];
export type Availability = Database['public']['Tables']['doctor_availability']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type SiteContent = Database['public']['Tables']['site_content']['Row'];
