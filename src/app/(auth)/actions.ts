"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`
    }
  });

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Check your email to confirm your account.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`
  });

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Password reset email sent.");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
