"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ThemePreference = "light" | "dark" | "system";

const themeOptions: {
  value: ThemePreference;
  labelKey: "light" | "dark" | "system";
  icon: typeof Sun;
}[] = [
  { value: "light", labelKey: "light", icon: Sun },
  { value: "dark", labelKey: "dark", icon: Moon },
  { value: "system", labelKey: "system", icon: Monitor }
];

export function ThemeSwitcher() {
  const t = useTranslations("UserMenu");
  const [theme, setTheme] = useState<ThemePreference>("system");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("eisenhower:theme") as ThemePreference | null;

    if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      const shouldUseDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", shouldUseDark);
      window.localStorage.setItem("eisenhower:theme", theme);
    }

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  return (
    <div
      className="flex rounded-md border border-border bg-card/85 p-1 shadow-sm"
      role="radiogroup"
      aria-label={t("mode")}
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={t(option.labelKey)}
            title={t(option.labelKey)}
            onClick={() => setTheme(option.value)}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded text-muted-foreground transition hover:text-foreground",
              isSelected && "bg-primary text-primary-foreground hover:text-primary-foreground"
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
