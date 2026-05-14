import { describe, expect, it } from "vitest";
import { translations, type Locale } from "@/lib/i18n/translations";

const locales: Locale[] = ["en", "pt", "es"];

describe("translations", () => {
  it("keeps all locales with the same translation keys", () => {
    const englishKeys = Object.keys(translations.en).sort();

    for (const locale of locales) {
      expect(Object.keys(translations[locale]).sort()).toEqual(englishKeys);
    }
  });

  it("provides labels used by the dashboard language selector", () => {
    expect(translations.en.newTask).toBe("New Task");
    expect(translations.pt.newTask).toBe("Nova Tarefa");
    expect(translations.es.newTask).toBe("Nueva Tarea");
  });

  it("provides translated filter labels", () => {
    expect(translations.en.category).toBe("Category");
    expect(translations.pt.category).toBe("Categoria");
    expect(translations.es.status).toBe("Estado");
  });
});
