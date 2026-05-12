import { getRequestConfig } from "next-intl/server";
import { resolveRequestConfig } from "./request-config";

export default getRequestConfig(async ({ requestLocale }) => {
  return resolveRequestConfig(requestLocale);
});
