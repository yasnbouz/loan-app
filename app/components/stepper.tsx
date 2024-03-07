import { cn } from "@/lib/utils";
import { CheckIcon } from "@heroicons/react/20/solid";

export interface IStepper {
  currentStep: number;
  steps: IStep[];
}
export interface IStep {
  name: string;
}
export default function Stepper({ currentStep = 1, steps = [] }: IStepper) {
  const numberOfSteps = steps.length;
  const activeStep = Math.min(Math.max(currentStep, 1), numberOfSteps + 1);
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "", "relative")}>
            {stepIdx + 1 < activeStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-teal-600" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 hover:bg-teal-900">
                  <CheckIcon className="h-5 w-5 text-background" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </span>
              </>
            ) : activeStep === stepIdx + 1 ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-muted" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-600 bg-background" aria-current="step">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-600" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-muted" />
                </div>
                <span className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background hover:border-gray-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
