import glsl from "vite-plugin-glsl";
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image"],
  css: ["./app/css/global.css", "./app/css/fonts.css", "./app/css/utils.css"],
  app: {
    head: {
      title: "Portfolio.",
      meta: [
        { name: "description", content: "my-portfolio" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
  vite: {
    plugins: [
      glsl(),
      svgLoader(),
    ],
    assetsInclude: ["**/*.md"],
  },
});
