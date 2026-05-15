import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requestPasswordReset } from "../actions";

type ForgotPasswordPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function ForgotPasswordPage({ params, searchParams }: ForgotPasswordPageProps) {
  const { locale } = await params;
  const { message } = await searchParams;
  const t = await getTranslations("Auth");

  return (
    <AuthCard
      title={t("forgotPassword.title")}
      subtitle={t("forgotPassword.subtitle")}
      message={message}
      footer={
        <Link className="font-semibold text-moss" href="/login">
          {t("forgotPassword.backToSignIn")}
        </Link>
      }
    >
      <form action={requestPasswordReset} className="grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t("email")}>
          <Input name="email" type="email" autoComplete="email" placeholder={t("emailPlaceholder")} required />
        </Field>
        <Button type="submit" className="h-11 w-full">
          {t("forgotPassword.submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
