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
import { parliaments } from "@/data/parliaments";
import { translate } from "@/i18n/i18n";
import { getParliamentName, getParliamentTitle } from "@/utils/parliamentTitle";

const sample = (name: string) => {
  const parliament = parliaments.find((p) => p.name === name);
  if (!parliament) throw new Error(`No sample named ${name}`);
  return parliament;
};

test("sample names follow the language", () => {
  expect(getParliamentName(sample("Germany"), "de")).toBe("Deutschland");
  expect(getParliamentName(sample("Spain"), "tr")).toBe("İspanya");
  expect(getParliamentName(sample("Turkey"), "tr")).toBe("Türkiye");
});

test("uses the English name in English and in unknown languages", () => {
  expect(getParliamentName(sample("Germany"), "en")).toBe("Germany");
  expect(getParliamentName(sample("Germany"), "xx")).toBe("Germany");
});

test("titles use the sample's name in the language, and custom names as typed", () => {
  const fr = (id: string) => translate({ locale: "fr", id });
  const custom = { name: "Res Publica", updateDate: "" };
  expect(getParliamentTitle(sample("Germany"), custom, fr, "fr").title).toBe(
    "Allemagne",
  );
  expect(getParliamentTitle(null, custom, fr, "fr").title).toBe("Res Publica");
});
