/*
# Create the Incom clinic operations platform

1. New tables
- `profiles`: authenticated account profile, role, display name and avatar metadata.
- `doctors`: public medical team records with CRM, specialty, photo and optional linked login.
- `doctor_availability`: recurring weekly schedule blocks and appointment duration per doctor.
- `appointments`: patient appointment requests, modality, status and secure ownership by doctor.
- `blog_posts`: editable public articles managed by administrators.
- `site_content`: editable titles, introductions and body content for public pages.
- `video_sessions`: telemedicine room metadata linked to an appointment.

2. Security and access model
- Row level security is enabled on every table.
- Public visitors can read only active doctors, public availability and published content.
- Public visitors can create appointments only through the validated `create_public_appointment` function; direct appointment table writes are not granted.
- Administrators can manage doctors, schedules, appointments and content.
- Medical users can read only their own doctor record, schedule, appointments and video sessions; they cannot edit appointments or content.
- Profile roles are protected from browser updates. The first authenticated account can claim the initial administrator role through a guarded function.

3. Integrity rules
- Appointment creation validates the doctor, weekday, schedule window and conflicts server-side.
- Appointment and video-session relationships use foreign keys and safe delete behavior.
- Timestamps are maintained by database defaults and update triggers.
- Indexes support doctor, date, status and published-content queries.

4. Important notes
- Authentication uses Supabase Auth email/password accounts.
- A new account starts as `doctor`; the first authenticated account must explicitly claim the initial administrator role.
- Doctor accounts created from the administrative panel are linked to the corresponding medical record by a server-side function.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'doctor');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_type') THEN
    CREATE TYPE public.appointment_type AS ENUM ('inperson', 'online');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role public.app_role NOT NULL DEFAULT 'doctor',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  crm text NOT NULL,
  specialty text NOT NULL,
  photo_url text,
  bio text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT doctors_crm_not_blank CHECK (length(trim(crm)) > 0),
  CONSTRAINT doctors_name_not_blank CHECK (length(trim(name)) > 1)
);

CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 30 CHECK (slot_duration_minutes BETWEEN 10 AND 240),
  location_type public.appointment_type NOT NULL DEFAULT 'inperson',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT availability_time_order CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  appointment_type public.appointment_type NOT NULL,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  patient_name text NOT NULL,
  patient_birth_date date NOT NULL,
  patient_insurance text NOT NULL,
  patient_phone text NOT NULL,
  patient_email text,
  patient_notes text,
  meeting_room_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT appointments_time_order CHECK (end_time > start_time),
  CONSTRAINT appointments_patient_name_not_blank CHECK (length(trim(patient_name)) > 1),
  CONSTRAINT appointments_patient_phone_not_blank CHECK (length(trim(patient_phone)) >= 8)
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT 'Equipe Incom',
  cover_image text,
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_title_not_blank CHECK (length(trim(title)) > 2)
);

CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  intro text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  hero_image text,
  published boolean NOT NULL DEFAULT true,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  room_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'live', 'ended')),
  started_at timestamptz,
  ended_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS doctors_active_idx ON public.doctors (is_active);
CREATE INDEX IF NOT EXISTS availability_doctor_weekday_idx ON public.doctor_availability (doctor_id, weekday);
CREATE INDEX IF NOT EXISTS appointments_doctor_date_idx ON public.appointments (doctor_id, appointment_date, start_time);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON public.appointments (status, appointment_date);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON public.blog_posts (published, published_at DESC);
CREATE INDEX IF NOT EXISTS site_content_published_idx ON public.site_content (published, slug);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS doctors_set_updated_at ON public.doctors;
CREATE TRIGGER doctors_set_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS availability_set_updated_at ON public.doctor_availability;
CREATE TRIGGER availability_set_updated_at BEFORE UPDATE ON public.doctor_availability FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS appointments_set_updated_at ON public.appointments;
CREATE TRIGGER appointments_set_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_set_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS site_content_set_updated_at ON public.site_content;
CREATE TRIGGER site_content_set_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS video_sessions_set_updated_at ON public.video_sessions;
CREATE TRIGGER video_sessions_set_updated_at BEFORE UPDATE ON public.video_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.claim_initial_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'An administrator already exists';
  END IF;
  UPDATE public.profiles SET role = 'admin' WHERE id = auth.uid();
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_public_appointment(
  p_doctor_id uuid,
  p_appointment_date date,
  p_start_time time,
  p_appointment_type public.appointment_type,
  p_patient_name text,
  p_patient_birth_date date,
  p_patient_insurance text,
  p_patient_phone text,
  p_patient_email text DEFAULT NULL,
  p_patient_notes text DEFAULT NULL
)
RETURNS public.appointments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duration integer;
  v_end_time time;
  v_appointment public.appointments;
BEGIN
  IF p_appointment_date < current_date THEN
    RAISE EXCEPTION 'Appointment date must not be in the past';
  END IF;
  IF length(trim(p_patient_name)) < 2 OR length(trim(p_patient_phone)) < 8 THEN
    RAISE EXCEPTION 'Patient information is invalid';
  END IF;

  SELECT slot_duration_minutes INTO v_duration
  FROM public.doctor_availability
  WHERE doctor_id = p_doctor_id
    AND weekday = extract(dow FROM p_appointment_date)::smallint
    AND p_start_time >= start_time
    AND p_start_time < end_time
    AND p_start_time + make_interval(mins => slot_duration_minutes) <= end_time
    AND (location_type = p_appointment_type OR location_type IS NULL)
  ORDER BY slot_duration_minutes
  LIMIT 1;

  IF v_duration IS NULL THEN
    RAISE EXCEPTION 'Selected time is not available';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.doctors WHERE id = p_doctor_id AND is_active) THEN
    RAISE EXCEPTION 'Doctor is not available';
  END IF;

  v_end_time := p_start_time + make_interval(mins => v_duration);

  IF EXISTS (
    SELECT 1 FROM public.appointments
    WHERE doctor_id = p_doctor_id
      AND appointment_date = p_appointment_date
      AND status <> 'cancelled'
      AND start_time < v_end_time
      AND end_time > p_start_time
  ) THEN
    RAISE EXCEPTION 'Selected time has just been reserved';
  END IF;

  INSERT INTO public.appointments (
    doctor_id, appointment_date, start_time, end_time, appointment_type,
    patient_name, patient_birth_date, patient_insurance, patient_phone,
    patient_email, patient_notes, meeting_room_id
  ) VALUES (
    p_doctor_id, p_appointment_date, p_start_time, v_end_time, p_appointment_type,
    trim(p_patient_name), p_patient_birth_date, trim(p_patient_insurance), trim(p_patient_phone),
    NULLIF(trim(p_patient_email), ''), NULLIF(trim(p_patient_notes), ''),
    CASE WHEN p_appointment_type = 'online' THEN encode(gen_random_bytes(12), 'hex') ELSE NULL END
  ) RETURNING * INTO v_appointment;

  RETURN v_appointment;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.current_user_is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.claim_initial_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_initial_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.create_public_appointment(uuid, date, time, public.appointment_type, text, date, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_public_appointment(uuid, date, time, public.appointment_type, text, date, text, text, text, text) TO anon, authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url) ON public.profiles TO authenticated;
GRANT SELECT ON public.doctors TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT SELECT ON public.doctor_availability TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.doctor_availability TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.video_sessions TO authenticated;

DROP POLICY IF EXISTS "profiles_select_self_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_self_or_admin" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.current_user_is_admin());
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "doctors_public_read_active" ON public.doctors;
CREATE POLICY "doctors_public_read_active" ON public.doctors FOR SELECT TO anon, authenticated USING (is_active OR public.current_user_is_admin() OR user_id = auth.uid());
DROP POLICY IF EXISTS "doctors_admin_insert" ON public.doctors;
CREATE POLICY "doctors_admin_insert" ON public.doctors FOR INSERT TO authenticated WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "doctors_admin_update" ON public.doctors;
CREATE POLICY "doctors_admin_update" ON public.doctors FOR UPDATE TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "doctors_admin_delete" ON public.doctors;
CREATE POLICY "doctors_admin_delete" ON public.doctors FOR DELETE TO authenticated USING (public.current_user_is_admin());

DROP POLICY IF EXISTS "availability_public_read" ON public.doctor_availability;
CREATE POLICY "availability_public_read" ON public.doctor_availability FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND (d.is_active OR public.current_user_is_admin() OR d.user_id = auth.uid())));
DROP POLICY IF EXISTS "availability_admin_insert" ON public.doctor_availability;
CREATE POLICY "availability_admin_insert" ON public.doctor_availability FOR INSERT TO authenticated WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "availability_admin_update" ON public.doctor_availability;
CREATE POLICY "availability_admin_update" ON public.doctor_availability FOR UPDATE TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "availability_admin_delete" ON public.doctor_availability;
CREATE POLICY "availability_admin_delete" ON public.doctor_availability FOR DELETE TO authenticated USING (public.current_user_is_admin());

DROP POLICY IF EXISTS "appointments_admin_read" ON public.appointments;
CREATE POLICY "appointments_admin_read" ON public.appointments FOR SELECT TO authenticated USING (public.current_user_is_admin());
DROP POLICY IF EXISTS "appointments_doctor_read_own" ON public.appointments;
CREATE POLICY "appointments_doctor_read_own" ON public.appointments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.user_id = auth.uid()));
DROP POLICY IF EXISTS "appointments_admin_update" ON public.appointments;
CREATE POLICY "appointments_admin_update" ON public.appointments FOR UPDATE TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "appointments_admin_delete" ON public.appointments;
CREATE POLICY "appointments_admin_delete" ON public.appointments FOR DELETE TO authenticated USING (public.current_user_is_admin());

DROP POLICY IF EXISTS "blog_public_read_published" ON public.blog_posts;
CREATE POLICY "blog_public_read_published" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published OR public.current_user_is_admin());
DROP POLICY IF EXISTS "blog_admin_insert" ON public.blog_posts;
CREATE POLICY "blog_admin_insert" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "blog_admin_update" ON public.blog_posts;
CREATE POLICY "blog_admin_update" ON public.blog_posts FOR UPDATE TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "blog_admin_delete" ON public.blog_posts;
CREATE POLICY "blog_admin_delete" ON public.blog_posts FOR DELETE TO authenticated USING (public.current_user_is_admin());

DROP POLICY IF EXISTS "content_public_read_published" ON public.site_content;
CREATE POLICY "content_public_read_published" ON public.site_content FOR SELECT TO anon, authenticated USING (published OR public.current_user_is_admin());
DROP POLICY IF EXISTS "content_admin_insert" ON public.site_content;
CREATE POLICY "content_admin_insert" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "content_admin_update" ON public.site_content;
CREATE POLICY "content_admin_update" ON public.site_content FOR UPDATE TO authenticated USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());
DROP POLICY IF EXISTS "content_admin_delete" ON public.site_content;
CREATE POLICY "content_admin_delete" ON public.site_content FOR DELETE TO authenticated USING (public.current_user_is_admin());

DROP POLICY IF EXISTS "video_sessions_admin_read" ON public.video_sessions;
CREATE POLICY "video_sessions_admin_read" ON public.video_sessions FOR SELECT TO authenticated USING (public.current_user_is_admin());
DROP POLICY IF EXISTS "video_sessions_doctor_read_own" ON public.video_sessions;
CREATE POLICY "video_sessions_doctor_read_own" ON public.video_sessions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.appointments a JOIN public.doctors d ON d.id = a.doctor_id WHERE a.id = appointment_id AND d.user_id = auth.uid()));
DROP POLICY IF EXISTS "video_sessions_staff_insert" ON public.video_sessions;
CREATE POLICY "video_sessions_staff_insert" ON public.video_sessions FOR INSERT TO authenticated WITH CHECK (public.current_user_is_admin() OR EXISTS (SELECT 1 FROM public.appointments a JOIN public.doctors d ON d.id = a.doctor_id WHERE a.id = appointment_id AND d.user_id = auth.uid()));
DROP POLICY IF EXISTS "video_sessions_staff_update" ON public.video_sessions;
CREATE POLICY "video_sessions_staff_update" ON public.video_sessions FOR UPDATE TO authenticated USING (public.current_user_is_admin() OR EXISTS (SELECT 1 FROM public.appointments a JOIN public.doctors d ON d.id = a.doctor_id WHERE a.id = appointment_id AND d.user_id = auth.uid())) WITH CHECK (public.current_user_is_admin() OR EXISTS (SELECT 1 FROM public.appointments a JOIN public.doctors d ON d.id = a.doctor_id WHERE a.id = appointment_id AND d.user_id = auth.uid()));

INSERT INTO public.site_content (slug, title, intro, body)
VALUES
  ('home', 'Excelência em Ortopedia e Medicina da Dor', 'Tratamentos especializados e tecnologia avançada para sua saúde e bem-estar.', 'Nossa equipe está pronta para oferecer atendimento humanizado e cuidado especializado.'),
  ('specialties', 'Especialidades', 'Cuidado especializado para cada movimento e fase da vida.', 'Conheça as áreas de atuação da equipe Incom.'),
  ('treatments', 'Tratamentos', 'Planos terapêuticos baseados em evidências e construídos para cada paciente.', 'Conheça as opções de tratamento oferecidas pela clínica.'),
  ('insurance', 'Convênios', 'Facilitamos o acesso ao cuidado com uma rede de convênios parceiros.', 'Consulte a disponibilidade do seu convênio no momento do agendamento.')
ON CONFLICT (slug) DO NOTHING;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
