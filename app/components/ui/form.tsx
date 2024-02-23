import * as RAC from "react-aria-components";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

interface InputProps extends RAC.InputProps, VariantProps<typeof inputVariants> {}

const inputVariants = cva([
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
  ,
  "disabled:cursor-not-allowed disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
]);

function Input({ className, type, ...props }: InputProps) {
  return <RAC.Input type={type} className={cn(inputVariants(), className)} {...props} />;
}

//  Text

function Text({ className, slot, ...props }: RAC.TextProps) {
  return <RAC.Text className={cn({ "text-destructive text-sm": slot === "errorMessage" }, className)} slot={slot} {...props} />;
}

// form field

interface FormFieldProps {
  type?: "text" | "password";
  label: string;
  name: string;
  error: undefined | string[];
}

function FormField({ type, label, name, error }: FormFieldProps) {
  return (
    <RAC.TextField name={name} className="w-full space-y-2">
      <div className="flex justify-between items-baseline">
        <RAC.Label>{label}</RAC.Label>
        {error ? <Text slot="errorMessage">{error}</Text> : null}
      </div>
      <Input type={type} />
    </RAC.TextField>
  );
}

export { Input, Text, FormField };
