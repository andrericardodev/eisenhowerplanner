import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function Field({ label, children, className }: FieldProps) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-foreground", className)}>
      {label}
      {children}
    </label>
  );
}
