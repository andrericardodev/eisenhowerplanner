import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-ink/15 bg-white px-3 text-sm outline-none transition placeholder:text-ink/40 focus:border-moss focus:ring-2 focus:ring-moss/15",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-ink/40 focus:border-moss focus:ring-2 focus:ring-moss/15",
        className
      )}
      {...props}
    />
  );
}
