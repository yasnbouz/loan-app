import { createClient } from "@/.server/supabase";
import type { LoaderFunctionArgs } from "@remix-run/node";
export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = await createClient(request);
  const { data, error } = await supabase.auth.getUser();

  console.log({ data, error });
  return {};
}

export default function Join() {
  return (
    <div className="mt-44">
      <h1>Welcome</h1>
    </div>
  );
}
