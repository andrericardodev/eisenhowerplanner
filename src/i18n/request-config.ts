import { isLocale, routing } from "./routing";

export async function resolveRequestConfig(requestLocale: Promise<string | undefined>) {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
}
