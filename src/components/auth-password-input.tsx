"use client";

import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthPasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  showLabel: string;
  hideLabel: string;
};

export function AuthPasswordInput({
  className,
  showLabel,
  hideLabel,
  ...props
}: AuthPasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-3 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        aria-label={isVisible ? hideLabel : showLabel}
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
