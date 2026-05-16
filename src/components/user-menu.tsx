"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Languages, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/[locale]/(auth)/actions";
import { localizePath, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type ThemePreference = "light" | "dark" | "system";

type UserMenuProps = {
  email: string;
};

const themeOptions: { value: ThemePreference; labelKey: "light" | "dark" | "system"; icon: typeof Sun }[] = [
  { value: "light", labelKey: "light", icon: Sun },
  { value: "dark", labelKey: "dark", icon: Moon },
  { value: "system", labelKey: "system", icon: Monitor }
];

const languageOptions: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "pt-BR", label: "Português" },
  { value: "es", label: "Español" }
];

export function UserMenu({ email }: UserMenuProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("UserMenu");
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>("system");
  const menuRef = useRef<HTMLDivElement>(null);
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`), "") || "/";

  const initials = useMemo(() => {
    const source = email.split("@")[0] || "user";
    return source
      .split(/[._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [email]);

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

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground ring-1 ring-border transition hover:bg-muted"
      >
        {initials || "U"}
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border border-border bg-card p-1.5 text-card-foreground shadow-2xl"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium leading-none">{t("account")}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
          </div>

          <div className="my-1 h-px bg-border" />

          <MenuSection icon={<Languages className="size-4" />} label={t("language")}>
            {languageOptions.map((option) => (
              <a
                key={option.value}
                role="menuitemradio"
                aria-checked={locale === option.value}
                href={localizePath(pathWithoutLocale, option.value)}
                hrefLang={option.value}
                className={cn(
                  "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm transition hover:bg-muted",
                  locale === option.value ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className="size-4" />
                <span className="flex-1">{option.label}</span>
                {locale === option.value ? <Check className="size-4" /> : null}
              </a>
            ))}
          </MenuSection>

          <div className="my-1 h-px bg-border" />

          <MenuSection icon={<Sun className="size-4" />} label={t("mode")}>
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <MenuOption
                  key={option.value}
                  icon={<Icon className="size-4" />}
                  label={t(option.labelKey)}
                  isSelected={theme === option.value}
                  onClick={() => setTheme(option.value)}
                />
              );
            })}
          </MenuSection>

          <div className="my-1 h-px bg-border" />

          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              role="menuitem"
              className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              {t("signOut")}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function MenuSection({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

function MenuOption({
  icon,
  label,
  isSelected,
  onClick
}: {
  icon?: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={isSelected}
      onClick={onClick}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm transition hover:bg-muted",
        isSelected ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {icon ? icon : <span className="size-4" />}
      <span className="flex-1">{label}</span>
      {isSelected ? <Check className="size-4" /> : null}
    </button>
  );
}
