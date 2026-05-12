import { describe, expect, it } from "vitest";
import { getQuadrantById, getQuadrantId, quadrants } from "./tasks";

describe("quadrants", () => {
  it("defines the four Eisenhower quadrants in display order", () => {
    expect(quadrants).toEqual([
      expect.objectContaining({
        id: "do-now",
        title: "Do Now",
        isUrgent: true,
        isImportant: true
      }),
      expect.objectContaining({
        id: "schedule",
        title: "Schedule",
        isUrgent: false,
        isImportant: true
      }),
      expect.objectContaining({
        id: "delegate",
        title: "Delegate",
        isUrgent: true,
        isImportant: false
      }),
      expect.objectContaining({
        id: "eliminate",
        title: "Eliminate",
        isUrgent: false,
        isImportant: false
      })
    ]);
  });
});

describe("getQuadrantId", () => {
  it.each([
    [{ is_urgent: true, is_important: true }, "do-now"],
    [{ is_urgent: false, is_important: true }, "schedule"],
    [{ is_urgent: true, is_important: false }, "delegate"],
    [{ is_urgent: false, is_important: false }, "eliminate"]
  ] as const)("returns %s for %s", (task, quadrantId) => {
    expect(getQuadrantId(task)).toBe(quadrantId);
  });
});

describe("getQuadrantById", () => {
  it("returns the quadrant that matches the provided id", () => {
    expect(getQuadrantById("schedule")).toEqual(
      expect.objectContaining({
        id: "schedule",
        subtitle: "Important, not urgent"
      })
    );
  });
});
