import { loanSessionStorage } from "@/.server/sessions";
import Brands from "@/components/brands";
import FAQS from "@/components/faqs";
import Hero from "@/components/hero";
import Requirements from "@/components/requirements";
import Reviews from "@/components/reviews";
import TrustUs from "@/components/trustUs";
import { redirect, type MetaFunction } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import Layout from "@/components/shared/layout";

export const meta: MetaFunction = () => {
  return [{ title: "Request your Online Personal Loan" }, { name: "description", content: "Welcome to Remix!" }];
};
export async function action({ request }: ActionFunctionArgs) {
  const formaData = await request.formData();
  const session = await loanSessionStorage.getSession(request.headers.get("Cookie"));

  const amount = formaData.get("amount");
  session.set("amount", amount);

  const months = formaData.get("months");
  session.set("months", months);

  const monthly_quota = formaData.get("monthly_quota");
  session.set("monthly_quota", monthly_quota);

  const total = formaData.get("total");
  session.set("total", total);

  const interest = formaData.get("interest");
  session.set("interest", interest);

  const date_of_return = formaData.get("date_of_return");
  session.set("date_of_return", date_of_return);
  return redirect("/create-account", { headers: { "Set-Cookie": await loanSessionStorage.commitSession(session) } });
}
export default function Home() {
  return (
    <Layout>
      <Hero />
      <TrustUs />
      {/* <Brands /> */}
      <Requirements />
      <Reviews />
      <FAQS />
    </Layout>
  );
}
