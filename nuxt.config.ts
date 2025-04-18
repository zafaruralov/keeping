// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  components: true,
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      coreApi: "https://keeping.uz/services/platon-core/api",
      authApi: "https://keeping.uz/services/platon-auth/api"
    }
  }
});
