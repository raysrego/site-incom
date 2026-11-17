/*
# Tighten Incom Data API privileges

1. Purpose
- Remove inherited table privileges that exposed write verbs to the anonymous role.
- Keep the public booking flow available only through its validated RPC function.

2. Privilege changes
- `profiles`: authenticated users can read profiles allowed by RLS and update only their display name and avatar.
- `doctors`: anonymous and authenticated visitors can read allowed public doctors; only administrators can reach write verbs through RLS.
- `doctor_availability`: anonymous and authenticated visitors can read allowed public schedules; only administrators can reach write verbs through RLS.
- `appointments`: only authenticated staff can reach read/update/delete verbs; RLS restricts those verbs to administrators for writes and administrators or the assigned doctor for reads.
- `blog_posts` and `site_content`: public read access is retained for published content; only authenticated administrators can reach write verbs.
- `video_sessions`: only authenticated staff can reach room metadata.

3. Function access
- `create_public_appointment` remains callable by anonymous visitors because it is the public booking boundary, but is removed from authenticated callers.
- `current_user_is_admin` is kept for internal policy evaluation and removed as a remotely callable function.
- `claim_initial_admin` remains available to authenticated users for the one-time initial setup.

4. Security note
- RLS policies remain the final row-level control. These grants now also enforce the least-privilege boundary before policy evaluation.
*/

REVOKE ALL ON TABLE public.profiles, public.doctors, public.doctor_availability, public.appointments, public.blog_posts, public.site_content, public.video_sessions FROM anon, authenticated;

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

REVOKE EXECUTE ON FUNCTION public.current_user_is_admin() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.create_public_appointment(uuid, date, time, public.appointment_type, text, date, text, text, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_public_appointment(uuid, date, time, public.appointment_type, text, date, text, text, text, text) TO anon;
