import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create admin user
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: "admin@medibook.com",
      password: "admin123",
      email_confirm: true,
      user_metadata: { full_name: "Admin" },
    });

    if (createError) {
      // User might already exist
      if (createError.message.includes("already")) {
        return new Response(JSON.stringify({ message: "Admin user already exists" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw createError;
    }

    // Add admin role
    await supabaseAdmin.from("user_roles").insert({
      user_id: user.user.id,
      role: "admin",
    });

    return new Response(JSON.stringify({ message: "Admin user created", email: "admin@medibook.com" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
