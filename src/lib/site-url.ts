type RequestHeaders = Pick<Headers, "get">;

function normalizeOrigin(origin: string) {
  return origin.replace(/\/+$/, "");
}

function isLocalHost(host: string) {
  const hostname = host.startsWith("[") ? host.slice(1, host.indexOf("]")) : host.split(":")[0];
  return hostname?.toLowerCase() === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function getRequestOrigin(headers: RequestHeaders) {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");

  if (!host) {
    return null;
  }

  const proto = headers.get("x-forwarded-proto") ?? (isLocalHost(host) ? "http" : "https");
  return `${proto}://${host}`;
}

export function getSiteUrl(headers: RequestHeaders) {
  const requestOrigin = getRequestOrigin(headers);

  if (requestOrigin && isLocalHost(new URL(requestOrigin).host)) {
    return normalizeOrigin(requestOrigin);
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  }

  return requestOrigin ? normalizeOrigin(requestOrigin) : "http://localhost:3000";
}
