/*
# Restore the policy authorization check

1. Purpose
- Restore execution of the internal administrator predicate used by row-level policies.

2. Security
- `current_user_is_admin()` remains a SECURITY DEFINER function with a fixed search path.
- The function returns only a boolean and reads the role for the current authenticated identity.
- It is callable by the API roles only as a predicate; all table rows remain protected by RLS.
- No table privileges are changed.
*/

GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO anon, authenticated;
