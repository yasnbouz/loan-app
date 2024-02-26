import * as RAC from "react-aria-components";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { getInputProps } from "@conform-to/react";
import React from "react";

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

/** Label */
function Label({ className, ...props }: RAC.LabelProps) {
  return <RAC.Label className={cn("text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />;
}

//  Text

function Text({ className, slot, ...props }: RAC.TextProps) {
  return <RAC.Text className={cn({ "text-destructive text-sm": slot === "errorMessage" }, className)} slot={slot} {...props} />;
}

// form field

interface FormFieldProps {
  type?: React.ComponentProps<"input">["type"];
  autoComplete?: React.ComponentProps<"input">["autoComplete"];
  label: string;
  field: any;
  placeholder?: string;
}

function FormField({ type, autoComplete, label, field, placeholder }: FormFieldProps) {
  return (
    <RAC.TextField name={field.name} className="w-full space-y-2">
      <div className="flex justify-between items-baseline">
        <Label htmlFor={field.id}>{label}</Label>
        {field.errors ? <Text slot="errorMessage">{field.errors}</Text> : null}
      </div>
      <Input placeholder={placeholder} autoComplete={autoComplete} {...getInputProps(field, { type: type as any })} />
    </RAC.TextField>
  );
}

export { Input, Text, FormField, Label };
