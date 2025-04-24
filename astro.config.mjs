// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

const defaultLocale = "sl";
const locales = {
  en: "en-US",
  sl: "sl-SI",
  it: "it-IT",
};

export default defineConfig({
  trailingSlash: "always",
  build: {
    format: "file",
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    i18n({
      locales,
      defaultLocale,
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
    react(),
  ],
});
