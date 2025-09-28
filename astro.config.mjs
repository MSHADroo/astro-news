// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// import { modifiedTime, readingTime } from "./src/lib/utils/remarks.mjs";
import { SITE } from "./src/lib/config";
import keystatic from "@keystatic/astro";
import react from "@astrojs/react";
import { loadEnv } from "vite";
import pagefind from "astro-pagefind";
import node from '@astrojs/node';
// import {DirectusImageService}  from "@/lib/utils/directusImageService.ts";

const { RUN_KEYSTATIC } = loadEnv(import.meta.env.MODE, process.cwd(), "");

const integrations = [mdx(), sitemap({
  i18n: {
    defaultLocale: 'fa',
    locales: {
      fa: 'fa-IR',
    },
  },
}), pagefind()];

if (RUN_KEYSTATIC === "true") {
  integrations.push(react());
  integrations.push(keystatic());
}

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: SITE.basePath,
  // markdown: {
  //   remarkPlugins: [readingTime, modifiedTime],
  // },
  image: {
    responsiveStyles: true,
    breakpoints: [640, 1024],
    // service: {
    //   entrypoint: './src/lib/utils/directusImageService.ts',
    // //   // config: { baseURL: "http://127.0.0.1:8055/assets" }
    // },
    // sizes:[
    //     640,
    //     1024
    // ]
  },
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true
  },
  output: 'static',
  adapter: node({ mode: 'standalone' }),
});
