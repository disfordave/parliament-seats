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
import { pluralize } from "@/utils/pluralize";

test("pluralizes a word based on the number", () => {
  expect(pluralize(1, "seat", "seats")).toBe("1 seat");
  expect(pluralize(0, "seat", "seats")).toBe("0 seats");
  expect(pluralize(2, "seat", "seats")).toBe("2 seats");
  expect(pluralize(1, "majority", "majorities")).toBe("1 majority");
  expect(pluralize(3, "majority", "majorities")).toBe("3 majorities");
});
