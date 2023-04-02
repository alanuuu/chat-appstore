// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  title: "chat-appstore",
  app: {
    head: {
      title: "应用市场",
      meta: [{ name: "description", content: "应用市场" }],
      link: [
        // { rel: "stylesheet", href: "//unpkg.com/element-plus/dist/index.css" }
      ],
      script: [
        // { src: "//unpkg.com/vue@3", tagPosition: "bodyClose" },
        // { src: "//unpkg.com/element-plus", tagPosition: "bodyClose" }
      ]
    },
    baseURL: process.env.NUXT_APP_BASE_URL,
    // baseURL: "/chat-appstore/",
    buildAssetsDir: "/_nuxt/"
  },
  devServer: {
    host: "loc.csdn.net",
    port: 3000
  },
  css: ["@/assets/css/elementui.scss"],
  imports: {
    autoImport: true
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxt/content"],

  tailwindcss: {
    cssPath: "@/assets/css/tailwind.css"
  },
  elementPlus: {
    /** Options */
  }
});
