/*
    Parliament (parliament-seats) is a tool for visualizing and calculating
    the distribution of seats in a parliamentary system.

    Copyright (C) 2025 @disfordave

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { expect, test } from "vitest";
import { locales, supportedLocales, translate } from "@/i18n/i18n";
import {
  formatThreshold,
  getMajority,
  getSeatsNeededText,
  presetThresholds,
} from "@/utils/getMajority";

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

test("tie-breaker does not change margins for odd seat totals", () => {
  expect(getMajority(101, 51, true)).toEqual({
    seatsForMajority: 51,
    status: "majority",
    margin: 1,
  });

  expect(getMajority(100, 51, true)).toEqual({
    seatsForMajority: 50,
    status: "majority",
    margin: 1,
  });
});

test("supermajorities are reached at exactly the quota", () => {
  const twoThirds = { numerator: 2, denominator: 3 };

  expect(getMajority(600, 400, false, twoThirds)).toEqual({
    seatsForMajority: 400,
    status: "majority",
    margin: 1,
  });

  expect(getMajority(600, 399, false, twoThirds)).toEqual({
    seatsForMajority: 400,
    status: "minority",
    margin: 1,
  });

  expect(getMajority(601, 400, false, twoThirds)).toEqual({
    seatsForMajority: 401,
    status: "minority",
    margin: 1,
  });

  // A tie breaker only applies to a simple majority
  expect(getMajority(600, 400, true, twoThirds)).toEqual({
    seatsForMajority: 400,
    status: "majority",
    margin: 1,
  });
});

test("thresholds below one half must be exceeded", () => {
  const oneThird = { numerator: 1, denominator: 3 };

  expect(getMajority(600, 200, false, oneThird)).toEqual({
    seatsForMajority: 201,
    status: "minority",
    margin: 1,
  });

  expect(getMajority(600, 201, false, oneThird)).toEqual({
    seatsForMajority: 201,
    status: "majority",
    margin: 1,
  });
});

test("custom percentages", () => {
  expect(
    getMajority(100, 50, true, { numerator: 5000, denominator: 10000 }),
  ).toEqual({
    seatsForMajority: 50,
    status: "tie-breaking majority",
    margin: 0,
  });

  expect(
    getMajority(450, 248, false, { numerator: 5500, denominator: 10000 }),
  ).toEqual({
    seatsForMajority: 248,
    status: "majority",
    margin: 1,
  });
});

test("formats preset thresholds as fractions and others as percentages", () => {
  expect(formatThreshold({ numerator: 1, denominator: 3 })).toBe("1/3");
  expect(formatThreshold({ numerator: 1, denominator: 2 })).toBe("1/2");
  expect(formatThreshold({ numerator: 2, denominator: 3 })).toBe("2/3");
  // A preset typed in as a percentage still reads as its fraction
  expect(formatThreshold({ numerator: 5000, denominator: 10000 })).toBe("1/2");
  expect(formatThreshold({ numerator: 4500, denominator: 10000 })).toBe("45%");
  expect(formatThreshold({ numerator: 3333, denominator: 10000 })).toBe(
    "33.33%",
  );
  expect(formatThreshold({ numerator: 2, denominator: 5 })).toBe("40%");
});

const en = (id: string) => translate({ locale: "en", id });
const half = { numerator: 1, denominator: 2 };

test("says majority only for one half, and names other thresholds", () => {
  const tr = (id: string) => translate({ locale: "tr", id });
  expect(getSeatsNeededText(718, half, false, en)).toBe(
    "360 seats for majority",
  );
  expect(
    getSeatsNeededText(718, { numerator: 5000, denominator: 10000 }, false, en),
  ).toBe("360 seats for majority");
  expect(
    getSeatsNeededText(630, { numerator: 1, denominator: 3 }, false, en),
  ).toBe("211 seats for the 1/3 threshold");
  expect(
    getSeatsNeededText(630, { numerator: 4500, denominator: 10000 }, false, en),
  ).toBe("284 seats for the 45% threshold");
  expect(
    getSeatsNeededText(600, { numerator: 2, denominator: 3 }, false, tr),
  ).toBe("2/3 eşiği için 400 sandalye");
});

test("mentions the tie-breaker only when it lowers the count", () => {
  expect(getSeatsNeededText(718, half, true, en)).toBe(
    "359 seats for majority with a tie-breaker",
  );
  // An odd total cannot tie, so the tie-breaker changes nothing
  expect(getSeatsNeededText(719, half, true, en)).toBe(
    "360 seats for majority",
  );
  // Ties only count at one half
  expect(
    getSeatsNeededText(630, { numerator: 1, denominator: 3 }, true, en),
  ).toBe("211 seats for the 1/3 threshold");
});

test("every language names every preset threshold", () => {
  for (const locale of supportedLocales) {
    const names: Record<string, string> = locales[locale].majority;
    for (const { id } of presetThresholds) {
      expect(typeof names[id]).toBe("string");
    }
  }
});

test("every language has the seats needed wording, with its placeholders", () => {
  for (const locale of supportedLocales) {
    const { header } = locales[locale];
    expect(header.seatsForMajority).toContain("{count}");
    expect(header.seatsForTieBreakingMajority).toContain("{count}");
    expect(header.seatsForThreshold).toContain("{count}");
    expect(header.seatsForThreshold).toContain("{threshold}");
  }
});
