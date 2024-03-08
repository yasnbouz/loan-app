import { HandThumbUpIcon, UsersIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "International Presence",
    description: "We are present in 10 countries such as France, Portugal and Poland",
    href: "#",
    icon: GlobeAltIcon,
  },
  {
    name: "More than 20 years of experience",
    description: "Providing payment and financing solutions to clients and major companies",
    href: "#",
    icon: HandThumbUpIcon,
  },
  {
    name: "2.5 million customers",
    description: "They trust us in Spain. And more than 6 million around the world",
    href: "#",
    icon: UsersIcon,
  },
];

export default function TrustUs() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why choose us for your online personal loan?</h2>
          <p className="mt-6 text-lg leading-8 mx-auto max-w-2xl text-muted-foreground">
            You&apos;re more than your credit score—Our model looks at factors such as your education and employment to help you get a rate you deserve.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col text-center items-center">
                <dt className="text-base font-semibold leading-7 text-foreground flex flex-col items-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg">
                    <feature.icon className="h-full w-full text-primary" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
