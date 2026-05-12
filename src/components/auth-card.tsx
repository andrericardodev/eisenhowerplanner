import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";

type AuthCardProps = {
  title: string;
  subtitle: string;
  message?: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, subtitle, message, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold tracking-wide text-moss">
            Eisenhower Planner
          </Link>
          <LocaleSwitcher />
        </div>
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">{subtitle}</p>
        </div>
        {message ? (
          <div className="mt-5 rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-sm text-ink">
            {message}
          </div>
        ) : null}
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-sm text-ink/65">{footer}</div>
      </section>
    </main>
  );
}
