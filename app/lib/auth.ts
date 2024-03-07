import { createClient } from "@/.server/supabase";
import { redirect } from "@vercel/remix";
import { Session } from "@supabase/supabase-js";

export async function checkSession(request: Request): Promise<Session | null> {
  const { supabase, headers } = createClient(request);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session?.access_token) {
    redirect("/login", { headers });
  }
  return session;
}
