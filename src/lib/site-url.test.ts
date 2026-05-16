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

  it("uses forwarded protocol and host when available", () => {
    const headers = new Headers({
      "x-forwarded-host": "localhost:3000",
      "x-forwarded-proto": "http"
    });

    expect(getRequestOrigin(headers)).toBe("http://localhost:3000");
  });

  it("uses the configured public URL for non-local requests", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://eisenhowerplanner.vercel.app/";

    const headers = new Headers({
      host: "preview.vercel.app",
      "x-forwarded-proto": "https"
    });

    expect(getSiteUrl(headers)).toBe("https://eisenhowerplanner.vercel.app");
  });
});
