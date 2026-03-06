import { expect, test } from "vitest";
import { getPosition } from "../utils/getPosition";

test("gets the position for a given political spectrum number", () => {
  expect(getPosition(-100)).toEqual({ full: "farLeft", short: "LL" });
  expect(getPosition(-50)).toEqual({ full: "centreLeft", short: "ll" });
  expect(getPosition(0)).toEqual({ full: "centre", short: "C" });
  expect(getPosition(50)).toEqual({ full: "centreRight", short: "rr" });
  expect(getPosition(100)).toEqual({ full: "farRight", short: "RR" });
});

test("gets the position for a number within the range but not available in the predefined positions", () => {
  expect(getPosition(62)).toEqual({ full: "centreRight", short: "rr" });
});

test("gets the position for a number outside the range", () => {
  expect(getPosition(150)).toEqual({ full: "farRight", short: "RR" });
  expect(getPosition(-150)).toEqual({ full: "farLeft", short: "LL" });
});
