import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth-card";
import { GoogleButton } from "@/components/google-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { signIn } from "../actions";

type LoginPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { message } = await searchParams;
  const t = await getTranslations("Auth");

  return (
    <AuthCard
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      message={message}
      footer={
        <>
          {t("login.noAccount")}{" "}
          <Link className="font-semibold text-moss" href="/signup">
            {t("login.createAccount")}
          </Link>
        </>
      }
    >
      <form action={signIn} className="grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t("email")}>
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label={t("password")}>
          <Input name="password" type="password" autoComplete="current-password" required />
        </Field>
        <div className="flex justify-end">
          <Link className="text-sm font-medium text-moss" href="/forgot-password">
            {t("login.forgotPassword")}
          </Link>
        </div>
        <Button type="submit" className="w-full">
          {t("login.submit")}
        </Button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-ink/40">
        <span className="h-px flex-1 bg-ink/10" />
        {t("or")}
        <span className="h-px flex-1 bg-ink/10" />
      </div>
      <GoogleButton />
    </AuthCard>
  );
}
