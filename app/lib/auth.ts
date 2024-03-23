import { createClient } from "@/.server/supabase";
import { redirect } from "@vercel/remix";

export async function checkSession(request: Request) {
  const { supabase, headers } = createClient(request);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  if (!session?.access_token || !session?.refresh_token) {
    throw redirect("/login", { headers });
  }
  return session;
}
