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

// Builds the page for each language, so search engines and link previews get
// its title, description and links to the other languages without running the
// app. Imported with relative paths, since the Vite config uses this file too.

import {
  Locale,
  defaultLocale,
  getLocalePath,
  locales,
  localesByName,
  supportedLocales,
} from "../i18n/i18n.ts";

export const siteUrl = "https://parl.hsw.is/";

// Where index.html takes the parts that change with the language
export const headPlaceholder = "<!-- seo:head -->";
export const noscriptPlaceholder = "<!-- seo:noscript -->";

// Open Graph wants a country along with the language
const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  fr: "fr_FR",
  de: "de_DE",
  nl: "nl_NL",
  tr: "tr_TR",
  es: "es_ES",
};

export function getPageUrl(locale: Locale) {
  return new URL(getLocalePath(locale), siteUrl).toString();
}

// Each language's page, plus the root page for any other language
function getAlternates() {
  return [
    ...supportedLocales.map((locale) => [locale, getPageUrl(locale)]),
    ["x-default", getPageUrl(defaultLocale)],
  ];
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Indents each line, to line the text up inside the page
function indent(text: string, spaces = 2) {
  return text.replace(/^(?=.)/gm, " ".repeat(spaces));
}

function meta(attribute: "name" | "property", key: string, content: string) {
  return `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
}

export function renderHead(locale: Locale) {
  const { seo } = locales[locale];
  const url = getPageUrl(locale);
  const image = new URL("og-image.png", siteUrl).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Parliament Seats",
        alternateName: "Parliament",
        url: siteUrl,
        inLanguage: supportedLocales,
      },
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "Parliament Seats",
        url,
        description: seo.description,
        image,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        inLanguage: locale,
        featureList: seo.features,
        license: "https://www.gnu.org/licenses/agpl-3.0.html",
        sameAs: ["https://github.com/disfordave/parliament-seats"],
        isPartOf: { "@id": `${siteUrl}#website` },
        publisher: {
          "@type": "Organization",
          name: "HSW.is",
          url: "https://hsw.is",
        },
      },
    ],
  };
  // Keeps a "</script>" in the text from ending the script early
  const json = JSON.stringify(structuredData, null, 2).replace(/</g, "\\u003c");

  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta("name", "description", seo.description),
    meta("name", "author", "HSW.is"),
    meta("name", "robots", "index, follow, max-image-preview:large"),
    `<link rel="canonical" href="${url}" />`,
    ...getAlternates().map(
      ([hreflang, href]) =>
        `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
    ),
    "",
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", "Parliament Seats"),
    meta("property", "og:locale", ogLocales[locale]),
    ...supportedLocales
      .filter((alternate) => alternate !== locale)
      .map((alternate) =>
        meta("property", "og:locale:alternate", ogLocales[alternate]),
      ),
    meta("property", "og:url", url),
    meta("property", "og:title", seo.socialTitle),
    meta("property", "og:description", seo.socialDescription),
    meta("property", "og:image", image),
    meta("property", "og:image:type", "image/png"),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta("property", "og:image:alt", seo.imageAlt),
    "",
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", seo.socialTitle),
    meta("name", "twitter:description", seo.socialDescription),
    meta("name", "twitter:image", image),
    meta("name", "twitter:image:alt", seo.imageAlt),
    "",
    `<script type="application/ld+json">\n${indent(json)}\n</script>`,
  ].join("\n");
}

// What browsers without JavaScript, and crawlers that do not run it, see
export function renderNoscript(locale: Locale) {
  const { seo } = locales[locale];
  const list = (items: string[]) =>
    [
      `<ul style="margin: 0 0 16px 20px; padding: 0">`,
      ...items.map((item) => indent(`<li>${escapeHtml(item)}</li>`)),
      `</ul>`,
    ].join("\n");
  // Plain links to the other languages, for crawlers to follow
  const languageLinks = localesByName
    .map(
      (alternate) =>
        `<a href="${getLocalePath(alternate)}" hreflang="${alternate}" lang="${alternate}">${escapeHtml(locales[alternate].languageName)}</a>`,
    )
    .join(" ·\n");

  const content = [
    `<h1 style="margin: 0 0 16px 0">${escapeHtml(seo.socialTitle)}</h1>`,
    `<p style="margin: 0 0 16px 0">${escapeHtml(seo.intro)}</p>`,
    `<h2 style="margin: 0 0 12px 0">${escapeHtml(seo.featuresTitle)}</h2>`,
    list(seo.features),
    `<h2 style="margin: 0 0 12px 0">${escapeHtml(seo.parliamentsTitle)}</h2>`,
    list(seo.parliaments),
    `<p style="margin: 0 0 16px 0">${escapeHtml(seo.noJavaScript)}</p>`,
    `<p style="margin: 0 0 16px 0">\n${indent(languageLinks)}\n</p>`,
    `<p style="margin: 0">`,
    indent(
      [
        `&copy; ${new Date().getFullYear()}`,
        `<a href="https://hsw.is" rel="noreferrer noopener" target="_blank">HSW.is</a> ·`,
        `<a href="https://github.com/disfordave/parliament-seats" rel="noreferrer noopener" target="_blank">${escapeHtml(seo.sourceCode)}</a>`,
      ].join("\n"),
    ),
    `</p>`,
  ].join("\n");

  return [
    `<noscript style="display: block; background: #ffffff; color: #09090b; padding: 16px; border-radius: 16px; margin: 8px auto; font-family: sans-serif; line-height: 1.5; border: 2px solid #e4e4e7; max-width: 720px">`,
    indent(content),
    `</noscript>`,
  ].join("\n");
}

// Fills index.html in for one language
export function localizePage(html: string, locale: Locale) {
  for (const placeholder of [headPlaceholder, noscriptPlaceholder]) {
    if (!html.includes(placeholder)) {
      throw new Error(`index.html is missing ${placeholder}`);
    }
  }

  // The placeholders sit inside <head> and <body>, so they are indented by 4.
  // Functions, since a "$" in the text would otherwise be read as a pattern.
  return html
    .replace(/<html lang="[^"]*"/, () => `<html lang="${locale}"`)
    .replace(headPlaceholder, () => indent(renderHead(locale), 4).trimStart())
    .replace(noscriptPlaceholder, () =>
      indent(renderNoscript(locale), 4).trimStart(),
    );
}

export function renderSitemap(lastModified: string) {
  const links = getAlternates().map(
    ([hreflang, href]) =>
      `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
  );
  const urls = supportedLocales.map((locale) =>
    [
      "  <url>",
      `    <loc>${getPageUrl(locale)}</loc>`,
      `    <lastmod>${lastModified}</lastmod>`,
      ...links,
      "  </url>",
    ].join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
