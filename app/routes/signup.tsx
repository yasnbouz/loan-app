import Header from "@/components/shared/header";
import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(formData);

  return {};
}

export default function SignUp() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        
      </main>
      <footer />
    </div>
  );
}
