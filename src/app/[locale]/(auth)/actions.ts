"use server";

import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, localizePath, routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

function getLocale(formData: FormData): Locale {
  const locale = String(formData.get("locale"));
  return isLocale(locale) ? locale : routing.defaultLocale;
}

function withMessage(pathname: string, message: string) {
  return `${pathname}?message=${encodeURIComponent(message)}`;
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const locale = getLocale(formData);
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(withMessage(localizePath("/login", locale), error.message));
  }

  redirect(localizePath("/dashboard", locale));
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const locale = getLocale(formData);
  const t = await getTranslations({ locale, namespace: "Auth.messages" });
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const siteUrl = getSiteUrl(await headers());

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=${localizePath("/dashboard", locale)}`
    }
  });

  if (error) {
    redirect(withMessage(localizePath("/signup", locale), error.message));
  }

  redirect(withMessage(localizePath("/login", locale), t("confirmEmail")));
}

export async function signOut(formData: FormData) {
  const supabase = await createClient();
  const locale = getLocale(formData);
  await supabase.auth.signOut();
  redirect(localizePath("/login", locale));
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const locale = getLocale(formData);
  const t = await getTranslations({ locale, namespace: "Auth.messages" });
  const email = String(formData.get("email"));
  const siteUrl = getSiteUrl(await headers());

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=${localizePath("/reset-password", locale)}`
  });

  if (error) {
    redirect(withMessage(localizePath("/forgot-password", locale), error.message));
  }

  redirect(withMessage(localizePath("/login", locale), t("passwordResetSent")));
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const locale = getLocale(formData);
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(withMessage(localizePath("/reset-password", locale), error.message));
  }

  redirect(localizePath("/dashboard", locale));
}
