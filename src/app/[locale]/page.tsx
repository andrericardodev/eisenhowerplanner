import { getTranslations } from "next-intl/server";
import { LandingPage } from "@/components/landing-page";

export default async function Home() {
  const t = await getTranslations("Landing");

  return <LandingPage t={t} />;
}
