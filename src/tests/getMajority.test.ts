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
