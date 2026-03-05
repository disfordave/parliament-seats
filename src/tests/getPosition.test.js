import { expect, test } from "vitest";
import { getPosition } from "../utils/getPosition";

test("gets the position for a given political spectrum number", () => {
  expect(getPosition(-100)).toEqual({ full: "farLeft", short: "LL" });
  expect(getPosition(100)).toEqual({ full: "farRight", short: "RR" });
});
