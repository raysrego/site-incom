import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DoctorRequest {
  name: string;
  crm: string;
  specialty: string;
  email: string;
  password: string;
}

const jsonResponse = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return jsonResponse({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) return jsonResponse({ error: "Service unavailable" }, 503);

    const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: callerData, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !callerData.user) return jsonResponse({ error: "Unauthorized" }, 401);

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: profile, error: profileError } = await adminClient.from("profiles").select("role").eq("id", callerData.user.id).maybeSingle();
    if (profileError || profile?.role !== "admin") return jsonResponse({ error: "Forbidden" }, 403);

    const payload = await req.json() as DoctorRequest;
    const name = payload.name?.trim();
    const crm = payload.crm?.trim();
    const specialty = payload.specialty?.trim();
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password;
    if (!name || !crm || !specialty || !email || !password || password.length < 6) return jsonResponse({ error: "Invalid data" }, 400);

    const { data: createdUser, error: userError } = await adminClient.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: name } });
    if (userError || !createdUser.user) return jsonResponse({ error: "Unable to create account" }, 400);

    const { error: profileUpdateError } = await adminClient.from("profiles").update({ full_name: name, role: "doctor" }).eq("id", createdUser.user.id);
    const { data: doctor, error: doctorError } = await adminClient.from("doctors").insert({ user_id: createdUser.user.id, name, crm, specialty }).select("*").maybeSingle();
    if (profileUpdateError || doctorError || !doctor) {
      await adminClient.auth.admin.deleteUser(createdUser.user.id);
      return jsonResponse({ error: "Unable to create doctor" }, 400);
    }

    return jsonResponse({ doctor });
  } catch (error) {
    console.error("create doctor failed", error);
    return jsonResponse({ error: "Unable to create doctor" }, 500);
  }
});
