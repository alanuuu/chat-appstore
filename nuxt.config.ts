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
    }
  },

  css: ["@/assets/css/elementui.scss"],
  imports: {
    autoImport: true
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  tailwindcss: {
    cssPath: "@/assets/css/tailwind.css"
  },
  elementPlus: {
    /** Options */
  }
});
