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
import { getPosition } from "@/utils/getPosition";

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
