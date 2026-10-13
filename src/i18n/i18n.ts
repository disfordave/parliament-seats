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

import en from "./en.json" with { type: "json" };
import fr from "./fr.json" with { type: "json" };
import de from "./de.json" with { type: "json" };
import nl from "./nl.json" with { type: "json" };
import tr from "./tr.json" with { type: "json" };
import es from "./es.json" with { type: "json" };

// Imported with relative paths, since the Vite config uses this file too

export const defaultLocale = "en";
export const locales = { en, fr, de, nl, tr, es } as const;
export const supportedLocales = Object.keys(
  locales,
) as (keyof typeof locales)[];
export type Locale = keyof typeof locales;

// The languages in A–Z order of their own names, for menus and links
export const localesByName = [...supportedLocales].sort((a, b) =>
  locales[a].languageName.localeCompare(locales[b].languageName, "en"),
);

// The default language has the root page, and the others /<locale>/
export function getLocalePath(locale: Locale, base = "/") {
  return locale === defaultLocale ? base : `${base}${locale}/`;
}

// The language that a page like /de/ is for, or null for the root page
export function getPathLocale(pathname: string, base = "/") {
  if (!pathname.startsWith(base)) return null;
  const segment = pathname.slice(base.length).split("/")[0];
  return supportedLocales.find((locale) => locale === segment) ?? null;
}

// The same address on another language's page, dropping a ?lang= that would
// override it
export function getLocaleUrl(href: string, locale: Locale, base = "/") {
  const url = new URL(href);
  url.pathname = getLocalePath(locale, base);
  // Deleting always rewrites the query, which would turn ?embed into ?embed=
  if (url.searchParams.has("lang")) url.searchParams.delete("lang");
  return url.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function locate(obj: any, path: string) {
  const pathString = path.split(".");
  const arrayPattern = /(.+)\[(\d+)\]/;
  for (let i = 0; i < pathString.length; i++) {
    const match = arrayPattern.exec(pathString[i]);
    if (match) {
      obj = obj[match[1]][parseInt(match[2])];
    } else {
      obj = obj[pathString[i]];
    }
  }

  return obj;
}

export function translate({ locale, id }: { locale: string; id: string }) {
  const selectedLocale =
    locale in locales ? locales[locale as Locale] : locales[defaultLocale];

  return locate(selectedLocale, id) ?? id;
}
