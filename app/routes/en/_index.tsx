import Hero from "@/components/hero";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import TrustUs from "@/components/trust-us";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 bg-background">
        <Hero />
        <TrustUs />
      </main>
      <Footer />
    </div>
  );
}
