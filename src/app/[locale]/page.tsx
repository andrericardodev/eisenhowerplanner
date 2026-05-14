import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

type HomeProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  redirect(user ? `/${locale}/dashboard` : `/${locale}/login`);
}
