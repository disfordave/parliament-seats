import { expect, test } from "vitest";
import { getMajority } from "@/utils/getMajority";

test("calculates majority correctly without tie-breaker", () => {
  expect(getMajority(100, 51)).toEqual({
    seatsForMajority: 51,
    status: "majority",
    margin: 1,
  });

  expect(getMajority(100, 50)).toEqual({
    seatsForMajority: 51,
    status: "minority",
    margin: 1,
  });

  expect(getMajority(100, 100)).toEqual({
    seatsForMajority: 51,
    status: "all",
    margin: 0,
  });

  expect(getMajority(100, 0)).toEqual({
    seatsForMajority: 51,
    status: "none",
    margin: 51,
  });
});

test("calculates majority correctly with tie-breaker", () => {
  expect(getMajority(100, 50, true)).toEqual({
    seatsForMajority: 50,
    status: "tie-breaking majority",
    margin: 0,
  });
});

test("handles edge cases", () => {
  expect(getMajority(1, 1)).toEqual({
    seatsForMajority: 1,
    status: "all",
    margin: 0,
  });

  expect(getMajority(1, 0)).toEqual({
    seatsForMajority: 1,
    status: "none",
    margin: 1,
  });

  expect(getMajority(2, 1)).toEqual({
    seatsForMajority: 2,
    status: "minority",
    margin: 1,
  });
});
