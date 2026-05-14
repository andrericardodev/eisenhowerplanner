"use client";

import { useLocale, useTranslations } from "next-intl";
import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

export function GoogleButton() {
  const locale = useLocale();
  const t = useTranslations("Auth");

  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/dashboard`
      }
    });
  }

  return (
    <Button type="button" variant="secondary" className="w-full" onClick={signInWithGoogle}>
      <Chrome className="h-4 w-4" />
      {t("google")}
    </Button>
  );
}
