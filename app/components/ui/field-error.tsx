import type { ReactNode } from "react";

export function FieldErrorMessage({ children }: { children: ReactNode }) {
  return <p className="text-destructive text-sm">{children}</p>;
}
