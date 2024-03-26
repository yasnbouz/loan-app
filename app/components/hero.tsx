import { LoanCard } from "@/components/loanCard";

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-5 lg:gap-x-8">
        <div className="lg:col-span-2">
          <div className="mx-auto max-w-2xl">
            <div className="max-w-lg">
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-accent-foreground sm:text-6xl">Empowering Businesses with Financial Solutions</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Your premier destination for tailored business financing. Unlock your company&apos;s potential with hassle-free lending solutions.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-20 px-6 lg:mt-0 md:mx-auto md:max-w-2xl lg:mx-0 lg:col-span-3">
          <LoanCard />
        </div>
      </div>
    </div>
  );
}
