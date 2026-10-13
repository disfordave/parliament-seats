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
import { locales, supportedLocales } from "@/i18n/i18n";
import {
  getPageUrl,
  headPlaceholder,
  localizePage,
  noscriptPlaceholder,
  renderSitemap,
} from "@/seo/pages";

const template = `<!doctype html>
<html lang="en">
  <head>
    ${headPlaceholder}
  </head>
  <body>
    ${noscriptPlaceholder}
  </body>
</html>`;

test("every language has the same page text as English", () => {
  const { seo } = locales.en;
  for (const locale of supportedLocales) {
    const localized = locales[locale].seo;
    expect(Object.keys(localized)).toEqual(Object.keys(seo));
    expect(localized.features).toHaveLength(seo.features.length);
    expect(localized.parliaments).toHaveLength(seo.parliaments.length);
    expect(
      Object.values(localized)
        .flat()
        .every((text) => text.trim().length > 0),
    ).toBe(true);
  }
});

test("fills in each language's page", () => {
  const page = localizePage(template, "es");

  expect(page).toContain('<html lang="es">');
  expect(page).toContain(
    "<title>Calculadora de pactos y coaliciones | Parliament Seats</title>",
  );
  expect(page).toContain(
    '<link rel="canonical" href="https://parl.hsw.is/es/" />',
  );
  expect(page).toContain('<meta property="og:locale" content="es_ES" />');
  expect(page).toContain("<li>España (Congreso de los Diputados)</li>");
  expect(page).not.toContain(headPlaceholder);
  expect(page).not.toContain(noscriptPlaceholder);
});

test("links every page to all the languages", () => {
  for (const locale of supportedLocales) {
    const page = localizePage(template, locale);
    for (const alternate of supportedLocales) {
      expect(page).toContain(
        `<link rel="alternate" hreflang="${alternate}" href="${getPageUrl(alternate)}" />`,
      );
    }
    expect(page).toContain(
      '<link rel="alternate" hreflang="x-default" href="https://parl.hsw.is/" />',
    );
  }
});

test("escapes the text and keeps the structured data valid", () => {
  const page = localizePage(template, "en");
  const json = page.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];

  expect(page).toContain(
    "<title>Coalition Calculator &amp; Parliament Chart Maker | Parliament Seats</title>",
  );
  expect(JSON.parse(json ?? "")["@graph"][1].description).toBe(
    locales.en.seo.description,
  );
});

test("refuses a page without the placeholders", () => {
  expect(() => localizePage('<html lang="en"></html>', "en")).toThrow(
    headPlaceholder,
  );
});

test("lists every page in the sitemap with its alternates", () => {
  const sitemap = renderSitemap("2026-10-14");

  for (const locale of supportedLocales) {
    expect(sitemap).toContain(`<loc>${getPageUrl(locale)}</loc>`);
  }
  expect(sitemap.match(/<url>/g)).toHaveLength(supportedLocales.length);
  expect(sitemap.match(/<xhtml:link /g)).toHaveLength(
    supportedLocales.length * (supportedLocales.length + 1),
  );
  expect(sitemap).toContain("<lastmod>2026-10-14</lastmod>");
});
