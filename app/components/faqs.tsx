import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Cuáles son los criterios de elegibilidad para solicitar un préstamo en Moneyeget?",
    answer: "En Moneyeget, requerimos que los solicitantes sean mayores de 18 años, tengan un ingreso estable y cumplan con nuestros criterios de solvencia.",
  },
  {
    question: "Qué documentos necesito para solicitar un préstamo?",
    answer:
      "Necesitará un comprobante de identidad, un comprobante de ingresos y un comprobante de domicilio. Consulte nuestro sitio web para obtener los documentos específicos que aceptamos.",
  },
  {
    question: "Cuánto tiempo se tarda en procesar mi solicitud de préstamo?",
    answer: "Nos esforzamos por procesar las solicitudes dentro de las 24-48 horas. Sin embargo, esto puede variar dependiendo de la integridad de su solicitud y documentos.",
  },
  {
    question: "Cuáles son las tasas de interés para sus préstamos?",
    answer: "Nuestras tasas de interés varían dependiendo del tipo de préstamo y su puntaje de crédito. Visite nuestro sitio web para obtener información detallada.",
  },
  {
    question: "Hay algún cargo oculto?",
    answer: "En Moneyeget creemos en la transparencia. Todas nuestras tarifas están claramente establecidas en nuestro contrato de préstamo. No hay cargos ocultos.",
  },
  {
    question: "Puedo pagar mi préstamo antes?",
    answer: "Sí, usted puede pagar su préstamo temprano sin ninguna penalización de prepago.",
  },
  {
    question: "Qué sucede si pierdo un pago?",
    answer:
      "Si no realiza un pago, puede incurrir en cargos por pago tardío. Póngase en contacto con nuestro equipo de servicio al cliente si tiene dificultades para realizar los pagos.",
  },
  {
    question: "Cómo puedo contactar con el servicio al cliente?",
    answer: "Nuestro equipo de atención al cliente está disponible por teléfono, correo electrónico y chat en vivo en nuestro sitio web. ¡Estamos aquí para ayudarle!",
  },
  // More questions...
];

export default function FAQS() {
  return (
    <div>
      <div className="mx-auto max-w-7xl py-24 sm:py-32">
        <div className="divide-y divide-gray-900/10">
          <h2 className="text-3xl font-bold leading-10 tracking-tight text-foreground md:text-4xl">preguntas más frecuentes</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            <Accordion type="single" collapsible>
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="font-semibold leading-7">{faq.question}</AccordionTrigger>
                  <AccordionContent className="leading-7 text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </dl>
        </div>
      </div>
    </div>
  );
}
