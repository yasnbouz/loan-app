import { createClient } from "@/.server/supabase";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createClient(request);

  const { error } = await supabase.auth.signOut();
  if (error) {
    return json({ error: error.message }, { headers });
  }

  return redirect("/login", { headers });
}
