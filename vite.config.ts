import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import {
  defaultLocale,
  getPathLocale,
  supportedLocales,
} from "./src/i18n/i18n.ts";
import { localizePage, renderSitemap } from "./src/seo/pages.ts";

// Fills index.html in for each language, and builds a page under /<locale>/
// for every language but the default one, along with a sitemap of them all
function localizedPages(): Plugin {
  let template = "";

  return {
    name: "localized-pages",
    // Runs after Vite has added the built scripts and styles to index.html
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler(html, { originalUrl, server }) {
        if (!server) {
          template = html;
          return localizePage(html, defaultLocale);
        }

        // The dev server answers /de/ and the like with index.html
        const pathname = new URL(originalUrl ?? "/", "http://localhost")
          .pathname;
        return localizePage(html, getPathLocale(pathname) ?? defaultLocale);
      },
    },
    generateBundle() {
      if (!template) this.error("index.html was not built before its pages");

      for (const locale of supportedLocales) {
        if (locale === defaultLocale) continue;
        this.emitFile({
          type: "asset",
          fileName: `${locale}/index.html`,
          source: localizePage(template, locale),
        });
      }

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: renderSitemap(new Date().toISOString().slice(0, 10)),
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localizedPages()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
