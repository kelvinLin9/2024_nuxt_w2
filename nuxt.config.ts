// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // compatibilityDate 屬性 : 將 Nuxt3 的功能和行為鎖定在 2024-04-03 之前的版本，
  // 避免之後 Nuxt3 新版本的寫法調整會影響到目前專案的運作
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: {
    // typeCheck: true
  },
  modules: ['@samk-dev/nuxt-vcalendar', 'nuxt-swiper', '@nuxt/icon'],
  icon: {
    serverBundle: {
      collections: ['bi', 'mdi', 'ic', 'fluent', 'material-symbols'] // <!--- this
    }
  },
  swiper: {
    // modules: ['navigation', 'pagination', 'autoplay'], // all modules are imported by default
  },
  css: [
    '@/assets/css/all.scss'
  ],
  postcss: { // CSS 屬性加上瀏覽器相容性前綴
    plugins: {
        autoprefixer: {}
    }
  }
})
