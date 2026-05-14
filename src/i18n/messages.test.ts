import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import ptBR from "../../messages/pt-BR.json";
import { routing, type Locale } from "./routing";

const messagesByLocale: Record<Locale, unknown> = {
  en,
  "pt-BR": ptBR,
  es
};

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return flattenKeys(nestedValue, nextPrefix);
  });
}

describe("messages", () => {
  it("has a message file for every supported locale", () => {
    expect(Object.keys(messagesByLocale).sort()).toEqual([...routing.locales].sort());
  });

  it("keeps translation keys aligned with the English base messages", () => {
    const baseKeys = flattenKeys(en).sort();

    for (const locale of routing.locales) {
      expect(flattenKeys(messagesByLocale[locale]).sort()).toEqual(baseKeys);
    }
  });
});
