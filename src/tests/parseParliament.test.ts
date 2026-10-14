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
import { parseParliament, stringifyParliament } from "@/utils/parseParliament";
import { ParliamentData, Party } from "@/types";

const partyA: Party = {
  id: "a",
  name: "Alpha Party",
  shortName: "Alpha",
  seats: 20,
  colour: "#ff0000",
  position: -2,
  isIndependent: false,
};

const partyB: Party = {
  id: "b",
  name: "Beta Party",
  shortName: "Beta",
  seats: 15,
  colour: "#0000ff",
  position: 3,
};

const parliament: ParliamentData = {
  name: "Alphaland",
  updateDate: "2026-10-10",
  parties: [partyA, partyB],
  selectedParties: [partyB],
};

const emptyParliament: ParliamentData = {
  name: "",
  updateDate: "",
  parties: [],
  selectedParties: [],
};

test("round-trips exported parliaments", () => {
  expect(parseParliament(stringifyParliament(parliament))).toEqual(parliament);
  expect(
    parseParliament(
      stringifyParliament({ ...parliament, selectedParties: [] }),
    ),
  ).toEqual({ ...parliament, selectedParties: [] });
  expect(parseParliament(stringifyParliament(emptyParliament))).toEqual(
    emptyParliament,
  );
});

test("round-trips party votes", () => {
  const withVotes = {
    ...parliament,
    parties: [
      { ...partyA, votes: 120000 },
      { ...partyB, votes: 14.5, isThresholdExempt: true },
    ],
    selectedParties: [{ ...partyB, votes: 14.5, isThresholdExempt: true }],
  };

  expect(parseParliament(stringifyParliament(withVotes))).toEqual(withVotes);
});

test("exports the selected parties as ids", () => {
  expect(JSON.parse(stringifyParliament(parliament)).selectedPartyIds).toEqual([
    "b",
  ]);
});

test("leaves the ids out when every party is selected", () => {
  const allSelected = { ...parliament, selectedParties: [partyB, partyA] };

  expect(JSON.parse(stringifyParliament(allSelected))).not.toHaveProperty(
    "selectedPartyIds",
  );
  expect(
    parseParliament(stringifyParliament(allSelected))?.selectedParties,
  ).toEqual([partyA, partyB]);
});

test("ignores selected ids that match no party", () => {
  expect(
    parseParliament(
      JSON.stringify({
        parties: [partyA, partyB],
        selectedPartyIds: ["b", "missing"],
      }),
    )?.selectedParties,
  ).toEqual([partyB]);
});

test("round-trips the majority threshold and tie breaker", () => {
  const twoThirds = {
    ...parliament,
    majorityThreshold: { numerator: 2, denominator: 3 },
    allowTieBreaker: false,
  };
  const customHalf = {
    ...parliament,
    majorityThreshold: { numerator: 5000, denominator: 10000 },
    allowTieBreaker: true,
  };

  expect(parseParliament(stringifyParliament(twoThirds))).toEqual(twoThirds);
  expect(parseParliament(stringifyParliament(customHalf))).toEqual(customHalf);
});

test("leaves the majority settings out when they are not included", () => {
  const exported = JSON.parse(stringifyParliament(parliament));

  expect(exported).not.toHaveProperty("majorityThreshold");
  expect(exported).not.toHaveProperty("allowTieBreaker");
  expect(
    parseParliament(stringifyParliament(parliament))?.majorityThreshold,
  ).toBeUndefined();
});

test("returns null for invalid majority settings", () => {
  const withThreshold = (numerator: unknown, denominator: unknown) =>
    JSON.stringify({
      ...parliament,
      majorityThreshold: { numerator, denominator },
    });

  expect(parseParliament(withThreshold(0, 2))).toBeNull();
  expect(parseParliament(withThreshold(3, 2))).toBeNull();
  expect(parseParliament(withThreshold(1.5, 2))).toBeNull();
  expect(parseParliament(withThreshold(1, 20000))).toBeNull();
  expect(parseParliament(withThreshold("1", "2"))).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, majorityThreshold: 0.5 })),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, allowTieBreaker: "yes" })),
  ).toBeNull();
});

test("round-trips the sort order and language", () => {
  const withSettings: ParliamentData = {
    ...parliament,
    sortBy: "position",
    locale: "nl",
  };

  expect(parseParliament(stringifyParliament(withSettings))).toEqual(
    withSettings,
  );
  expect(JSON.parse(stringifyParliament(parliament))).not.toHaveProperty(
    "sortBy",
  );
  expect(JSON.parse(stringifyParliament(parliament))).not.toHaveProperty(
    "locale",
  );
});

test("returns null for unknown sort orders and languages", () => {
  expect(
    parseParliament(JSON.stringify({ ...parliament, sortBy: "colour" })),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, locale: "xx" })),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, locale: 1 })),
  ).toBeNull();
});

test("accepts older exports that are only a list of parties", () => {
  expect(parseParliament(JSON.stringify([partyA, partyB], null, 2))).toEqual({
    name: "",
    updateDate: "",
    parties: [partyA, partyB],
    selectedParties: [partyA, partyB],
  });
  expect(parseParliament("[]")).toEqual(emptyParliament);
});

test("fills in a missing name, update date, and selection", () => {
  expect(parseParliament(JSON.stringify({ parties: [partyA] }))).toEqual({
    name: "",
    updateDate: "",
    parties: [partyA],
    selectedParties: [partyA],
  });
});

test("accepts compact and pasted whitespace", () => {
  expect(parseParliament(stringifyParliament(parliament, 0))).toEqual(
    parliament,
  );
  expect(parseParliament(`\n  ${stringifyParliament(parliament)}  \n`)).toEqual(
    parliament,
  );
});

test("returns null for JSON that is not a parliament or a list of parties", () => {
  expect(parseParliament("{}")).toBeNull();
  expect(parseParliament("null")).toBeNull();
  expect(parseParliament('"Alpha Party"')).toBeNull();
  expect(parseParliament(JSON.stringify(partyA))).toBeNull();
  expect(parseParliament(JSON.stringify([partyA, null]))).toBeNull();
  expect(
    parseParliament(JSON.stringify([{ ...partyA, seats: "20" }])),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify([{ ...partyA, isIndependent: "no" }])),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify([{ ...partyA, votes: "12000" }])),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify([{ ...partyA, isThresholdExempt: 1 }])),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, parties: [partyA, null] })),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, name: 1 })),
  ).toBeNull();
  expect(
    parseParliament(
      JSON.stringify({ parties: [partyA], selectedPartyIds: "a" }),
    ),
  ).toBeNull();
  expect(
    parseParliament(
      JSON.stringify({ parties: [partyA], selectedPartyIds: [1] }),
    ),
  ).toBeNull();
});

test("returns null for update dates that are not YYYY-MM-DD", () => {
  expect(
    parseParliament(
      JSON.stringify({ ...parliament, updateDate: "10/10/2026" }),
    ),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, updateDate: "yesterday" })),
  ).toBeNull();
  expect(
    parseParliament(JSON.stringify({ ...parliament, updateDate: 20261010 })),
  ).toBeNull();
});

test("throws for text that is not JSON", () => {
  expect(() => parseParliament("")).toThrow();
  expect(() => parseParliament("[{")).toThrow();
  expect(() => parseParliament("Alpha Party")).toThrow();
});
