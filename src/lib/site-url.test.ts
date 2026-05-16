import { afterEach, describe, expect, it } from "vitest";
import { getRequestOrigin, getSiteUrl } from "./site-url";

describe("site URL helpers", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });

  it("uses localhost request origins for local testing even when a production URL is configured", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://eisenhowerplanner.vercel.app";

    const headers = new Headers({
      host: "localhost:3001"
    });

    expect(getSiteUrl(headers)).toBe("http://localhost:3001");
  });

  it("uses localhost IPv6 request origins for local testing", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://eisenhowerplanner.vercel.app";

    const headers = new Headers({
      host: "[::1]:3000"
    });

    expect(getSiteUrl(headers)).toBe("http://[::1]:3000");
  });

  it("uses forwarded protocol and host when available", () => {
    const headers = new Headers({
      "x-forwarded-host": "localhost:3000",
      "x-forwarded-proto": "http"
    });

    expect(getRequestOrigin(headers)).toBe("http://localhost:3000");
  });

  it("defaults non-local request origins to HTTPS", () => {
    const headers = new Headers({
      host: "preview.vercel.app"
    });

    expect(getRequestOrigin(headers)).toBe("https://preview.vercel.app");
  });

  it("returns null when a request origin cannot be inferred", () => {
    expect(getRequestOrigin(new Headers())).toBeNull();
  });

  it("uses the configured public URL for non-local requests", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://eisenhowerplanner.vercel.app/";

    const headers = new Headers({
      host: "preview.vercel.app",
      "x-forwarded-proto": "https"
    });

    expect(getSiteUrl(headers)).toBe("https://eisenhowerplanner.vercel.app");
  });

  it("falls back to the configured public URL when no request origin is available", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://eisenhowerplanner.vercel.app";

    expect(getSiteUrl(new Headers())).toBe("https://eisenhowerplanner.vercel.app");
  });

  it("falls back to the request origin when no public URL is configured", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const headers = new Headers({
      host: "preview.vercel.app"
    });

    expect(getSiteUrl(headers)).toBe("https://preview.vercel.app");
  });

  it("falls back to localhost when no request origin or public URL is available", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    expect(getSiteUrl(new Headers())).toBe("http://localhost:3000");
  });
});
