import { HandThumbUpIcon, UsersIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "presencia internacional",
    description: "Estamos presentes en 10 países como Francia, Portugal y Polonia",
    href: "#",
    icon: GlobeAltIcon,
  },
  {
    name: "Más de 20 años de experiencia",
    description: "Proporcionar soluciones de pago y financiación a clientes y grandes empresas",
    href: "#",
    icon: HandThumbUpIcon,
  },
  {
    name: "2,5 millones de clientes",
    description: "Confían en nosotros en España. Y más de 6 millones en todo el mundo",
    href: "#",
    icon: UsersIcon,
  },
];

export default function TrustUs() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Por qué elegirnos para su préstamo personal en línea?</h2>
          <p className="mt-6 text-lg leading-8 mx-auto max-w-2xl text-muted-foreground">
            Usted es más que su puntaje de crédito: nuestro modelo analiza factores como su educación y empleo para ayudarlo a obtener una tasa que se merece.
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
