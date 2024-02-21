import { LoanCard } from "@/components/loan-card";

export default function Hero() {
  return (
    <div className="relative mt-20 isolate overflow-hidden">
      <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-5 lg:gap-x-8 lg:px-8 lg:py-40">
        <div className="px-6 lg:px-0 lg:pt-4 lg:col-span-2">
          <div className="mx-auto max-w-2xl">
            <div className="max-w-lg">
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-accent-foreground sm:text-5xl">Request your Online Personal Loan up to 35,000</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
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
