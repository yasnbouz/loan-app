import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const inputVariants = cva([
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:text-muted-foreground file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
]);

function Input({ className, type, ...props }: InputProps) {
  return <input type={type} className={cn(inputVariants(), className)} {...props} />;
}

/** Label */
function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <label className={cn("text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />;
}

//  ErrorMessage

function ErrorMessage({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-destructive text-sm", className)} {...props} />;
}

// Text field

interface TextFieldProps {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors: any;
}

function TextField({ labelProps, inputProps, errors }: TextFieldProps) {
  const id = inputProps.id;
  const errorId = errors ? `${id}-error` : undefined;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-baseline">
        <Label htmlFor={id} {...labelProps} />
        {errorId ? (
          <ErrorMessage className="text-right" id={errorId}>
            {errors[0]}
          </ErrorMessage>
        ) : null}
      </div>
      <Input {...inputProps} />
    </div>
  );
}

export { Input, ErrorMessage, TextField, Label };
