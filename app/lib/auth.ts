import { createClient } from "@/.server/supabase";
import { redirect } from "@remix-run/node";

export async function checkSession(request: Request) {
  const { supabase, headers } = createClient(request);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session?.access_token) {
    return redirect("/login", { headers });
  }
  return session;
}
