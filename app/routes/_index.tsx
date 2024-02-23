import { loanSessionStorage } from "@/.server/sessions";
import Brands from "@/components/brands";
import FAQS from "@/components/faqs";
import Hero from "@/components/hero";
import Requirements from "@/components/requirements";
import Reviews from "@/components/reviews";
import TrustUs from "@/components/trustUs";
import { redirect, type MetaFunction } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Request your Online Personal Loan" }, { name: "description", content: "Welcome to Remix!" }];
};
export async function action({ request }: ActionFunctionArgs) {
  const formaData = await request.formData();
  const session = await loanSessionStorage.getSession(request.headers.get("Cookie"));

  const loan = formaData.get("loan");
  session.set("loan", loan);

  const months = formaData.get("months");
  session.set("months", months);

  const monthlyQuota = formaData.get("monthlyQuota");
  session.set("monthlyQuota", monthlyQuota);

  const total = formaData.get("total");
  session.set("total", total);

  const interest = formaData.get("interest");
  session.set("interest", interest);

  const dateOfReturn = formaData.get("dateOfReturn");
  session.set("dateOfReturn", dateOfReturn);
  return redirect("/join", { headers: { "Set-Cookie": await loanSessionStorage.commitSession(session) } });
}
export default function Home() {
  return (
    <>
      <Hero />
      <TrustUs />
      {/* <Brands /> */}
      <Requirements />
      <Reviews />
      <FAQS />
    </>
  );
}
