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
import { sort } from "@/utils/sort";
import { Party } from "@/types";

const partyA: Party = {
  id: "a",
  name: "Alpha Party",
  shortName: "Alpha",
  seats: 20,
  colour: "#ff0000",
  position: -50,
};

const partyB: Party = {
  id: "b",
  name: "Beta Party",
  shortName: "Beta",
  seats: 15,
  colour: "#00ff00",
  position: 50,
};

const partyG: Party = {
  id: "g",
  name: "Gamma Party",
  shortName: "Gamma",
  seats: 10,
  colour: "#0000ff",
  position: 0,
};

const partyZ: Party = {
  id: "z",
  name: "Zeta Party",
  shortName: "Zeta",
  seats: 5,
  colour: "#123456",
  position: 0,
};

const independentParty: Party = {
  id: "d",
  name: "Independent",
  shortName: "Indie",
  seats: 15,
  colour: "#ffff00",
  position: 0,
  isIndependent: true,
};

// ABC, then independent last regardless of name or seats
test("sort by name with the sample parties", () => {
  expect(sort(partyA, partyB, false, "name")).toBeLessThan(0); // Alpha comes before Beta
  expect(sort(partyB, partyG, false, "name")).toBeLessThan(0); // Beta comes before Gamma
  expect(sort(partyA, partyG, false, "name")).toBeLessThan(0); // Alpha comes before Gamma
  expect(sort(partyZ, independentParty, false, "name")).toBeLessThan(0); // Independent should come after Zeta despite Zeta being later in the alphabet
});

// Sort by seats, larger parties first, but independent last regardless of seats
test("sort by seats with the sample parties", () => {
  expect(sort(partyA, partyB, false, "seats")).toBeLessThan(0); // Alpha has more seats than Beta
  expect(sort(partyB, partyG, false, "seats")).toBeLessThan(0); // Beta has more seats than Gamma
  expect(sort(partyA, partyG, false, "seats")).toBeLessThan(0); // Alpha has more seats than Gamma
  expect(sort(partyB, independentParty, false, "seats")).toBeLessThan(0); // Independent should come after Beta despite having the same number of seats
});

// Sort by position, leftwing parties first, regardless of independent status
test("sort by position with the sample parties", () => {
  expect(sort(partyA, partyB, false, "position")).toBeLessThan(0); // Alpha is left of Beta
  expect(sort(partyB, partyG, false, "position")).toBeGreaterThan(0); // Beta is right of Gamma
  expect(sort(partyA, partyG, false, "position")).toBeLessThan(0); // Alpha is left of Gamma
  expect(sort(partyA, independentParty, false, "position")).toBeLessThan(0); // Alpha is left of Independent
  expect(sort(partyB, independentParty, false, "position")).toBeGreaterThan(0); // Beta is right of Independent
});

// If edit mode is on, sorting should be disabled and original order maintained
test("edit mode disables sorting", () => {
  expect(sort(partyA, partyB, true, "name")).toBe(0); // Edit mode should disable sorting
  expect(sort(partyB, partyG, true, "seats")).toBe(0); // Edit mode should disable sorting
  expect(sort(partyA, partyG, true, "position")).toBe(0); // Edit mode should disable sorting
});
