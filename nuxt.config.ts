export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/seo'
  ],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'wandermap-color-mode'
  }
})