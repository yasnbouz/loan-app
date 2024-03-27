import { createClient } from "@/.server/supabase";

export async function checkSession(request: Request) {
  const { supabase } = createClient(request);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session?.access_token || !session?.refresh_token) {
    throw new Error("Usuario no encontrado");
  }
  return session;
}
