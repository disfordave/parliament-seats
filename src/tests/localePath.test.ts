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
import {
  getLocalePath,
  getLocaleUrl,
  getPathLocale,
  localesByName,
} from "@/i18n/i18n";

test("gives the default language the root page and the others their own", () => {
  expect(getLocalePath("en")).toBe("/");
  expect(getLocalePath("es")).toBe("/es/");
  expect(getLocalePath("de", "/app/")).toBe("/app/de/");
});

test("reads the language from a page's path", () => {
  expect(getPathLocale("/es/")).toBe("es");
  expect(getPathLocale("/tr/index.html")).toBe("tr");
  expect(getPathLocale("/app/nl/", "/app/")).toBe("nl");
});

test("leaves the root page and unknown paths to the saved language", () => {
  expect(getPathLocale("/")).toBeNull();
  expect(getPathLocale("/index.html")).toBeNull();
  expect(getPathLocale("/xx/")).toBeNull();
  expect(getPathLocale("/es/", "/app/")).toBeNull();
});

test("moves to another language's page and keeps the rest of the address", () => {
  expect(
    getLocaleUrl("https://parl.hsw.is/?country=Spain#data=abc", "es"),
  ).toBe("https://parl.hsw.is/es/?country=Spain#data=abc");
  expect(getLocaleUrl("https://parl.hsw.is/de/", "en")).toBe(
    "https://parl.hsw.is/",
  );
});

test("drops a ?lang= that would override the page's language", () => {
  expect(
    getLocaleUrl("https://parl.hsw.is/?lang=de&country=Germany", "fr"),
  ).toBe("https://parl.hsw.is/fr/?country=Germany");
  expect(getLocaleUrl("https://parl.hsw.is/?lang=de", "fr")).toBe(
    "https://parl.hsw.is/fr/",
  );
});

test("lists the languages A–Z by their own names", () => {
  expect(localesByName).toEqual(["de", "en", "es", "fr", "nl", "tr"]);
});
