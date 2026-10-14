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
import { locales, supportedLocales, translate } from "@/i18n/i18n";
import { Parliament } from "@/types";
import { getParliamentName, getParliamentTitle } from "@/utils/parliamentTitle";

const inLanguage = (locale: string) => (id: string) =>
  translate({ locale, id });

const sample = (name: string) => {
  const parliament = parliaments.find((p) => p.name === name);
  if (!parliament) throw new Error(`No sample named ${name}`);
  return parliament;
};

test("every language names every sample parliament, and only those", () => {
  const names = parliaments.map((p) => p.name).sort();
  for (const locale of supportedLocales) {
    expect(Object.keys(locales[locale].parliamentNames).sort()).toEqual(names);
  }
});

test("sample names follow the language", () => {
  expect(getParliamentName(sample("Germany"), inLanguage("de"))).toBe(
    "Deutschland",
  );
  expect(getParliamentName(sample("Spain"), inLanguage("tr"))).toBe("İspanya");
  expect(getParliamentName(sample("Germany"), inLanguage("en"))).toBe(
    "Germany",
  );
});

test("falls back to the English name when a language has none", () => {
  const atlantis: Parliament = {
    name: "Atlantis",
    parties: [],
    updateDate: "",
  };
  expect(getParliamentName(atlantis, inLanguage("de"))).toBe("Atlantis");
});

test("titles use the sample's name in the language, and custom names as typed", () => {
  const custom = { name: "Res Publica", updateDate: "" };
  expect(
    getParliamentTitle(sample("Germany"), custom, inLanguage("fr")).title,
  ).toBe("Allemagne");
  expect(getParliamentTitle(null, custom, inLanguage("fr")).title).toBe(
    "Res Publica",
  );
});
