import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the eligibility criteria for applying for a loan at Loan Money?",
    answer: "At Loan Money, we require applicants to be over 18 years old, have a stable income, and meet our creditworthiness criteria.",
  },
  {
    question: "What documents do I need to apply for a loan?",
    answer: "You’ll need proof of identity, proof of income, and proof of address. Please check our website for the specific documents we accept.",
  },
  {
    question: "How long does it take to process my loan application?",
    answer: "We strive to process applications within 24-48 hours. However, this may vary depending on the completeness of your application and documents.",
  },
  {
    question: "What are the interest rates for your loans?",
    answer: "Our interest rates vary depending on the type of loan and your credit score. Please visit our website for detailed information.",
  },
  {
    question: "Are there any hidden fees?",
    answer: "At Loan Money, we believe in transparency. All our fees are clearly stated in our loan agreement. There are no hidden charges.",
  },
  {
    question: "Can I repay my loan early?",
    answer: "Yes, you can repay your loan early without any prepayment penalties.",
  },
  {
    question: "What happens if I miss a payment?",
    answer: "If you miss a payment, you may incur late payment fees. Please contact our customer service team if you’re having difficulties making payments.",
  },
  {
    question: "How can I contact customer service?",
    answer: "Our customer service team is available via phone, email, and live chat on our website. We’re here to help!",
  },
  // More questions...
];

export default function FAQS() {
  return (
    <div>
      <div className="mx-auto max-w-7xl py-24 sm:py-32">
        <div className="divide-y divide-gray-900/10">
          <h2 className="text-3xl font-bold leading-10 tracking-tight text-foreground md:text-4xl">Frequently asked questions</h2>
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
