import { expect, test } from "vitest";
import { pluralize } from "@/utils/pluralize";

test("pluralizes a word based on the number", () => {
  expect(pluralize(1, "seat", "seats")).toBe("1 seat");
  expect(pluralize(0, "seat", "seats")).toBe("0 seats");
  expect(pluralize(2, "seat", "seats")).toBe("2 seats");
  expect(pluralize(1, "majority", "majorities")).toBe("1 majority");
  expect(pluralize(3, "majority", "majorities")).toBe("3 majorities");
});
