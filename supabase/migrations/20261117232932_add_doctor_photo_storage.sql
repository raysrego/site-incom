/*
# Add secure medical profile photo storage

1. New storage resource
- `doctor-photos`: public-read bucket for the clinic's professional profile images.
- The bucket accepts JPEG, PNG and WebP images up to 5 MB.

2. Application connection
- The `doctors.photo_url` column continues to store the public URL returned after a successful upload.
- The administrative doctor form uploads the selected file first to storage, then saves that URL on the doctor record.
- The agenda uses the same doctor record, so the name, CRM, specialty and photo are immediately available when a doctor is selected.

3. Security
- Anyone may read a professional doctor photo because it is public website content.
- Only authenticated administrators may insert, update or delete objects in this bucket.
- The database's existing administrator predicate is reused for storage policies.
- File type and size are enforced both by the bucket configuration and by the upload form.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('doctor-photos', 'doctor-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "doctor_photos_public_read" ON storage.objects;
CREATE POLICY "doctor_photos_public_read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'doctor-photos');

DROP POLICY IF EXISTS "doctor_photos_admin_insert" ON storage.objects;
CREATE POLICY "doctor_photos_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'doctor-photos' AND public.current_user_is_admin());

DROP POLICY IF EXISTS "doctor_photos_admin_update" ON storage.objects;
CREATE POLICY "doctor_photos_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'doctor-photos' AND public.current_user_is_admin())
WITH CHECK (bucket_id = 'doctor-photos' AND public.current_user_is_admin());

DROP POLICY IF EXISTS "doctor_photos_admin_delete" ON storage.objects;
CREATE POLICY "doctor_photos_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'doctor-photos' AND public.current_user_is_admin());
