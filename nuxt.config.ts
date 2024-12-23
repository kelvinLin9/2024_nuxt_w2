import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title:"Freyja | 高雄頂級旅館 - 提供奢華住宿體驗",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { "http-equiv":"X-UA-Compatible", content:"IE=edge"},
        { "http-equiv":"X-Content-Type-Options", content:"nosniff"},
        { name:"author", content:"Freyja 旅館"},
        { name:"keywords", content:"Freyja,Freyja 訂房,高雄旅遊,訂房,住宿,住宿預訂,四人房,雙人房,景觀房"},
        { name:"description", content:"Freyja 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！"},
        { name:"theme-color", content:"#ffffff"},
        { name:"robots", content:"index, follow"},
        { property:"fb:app_id", content:"12345678" }, 
        { property:"og:locale", content:"zh-TW" }, 
        { property:"og:type", content:"website" },
        { property:"og:url", content:"https://freyja.travel.com.tw" }, 
        { property:"og:title", content:"Freyja | 高雄頂級旅館 - 提供奢華住宿體驗" }, 
        { property:"og:image", content:"https://freyja.travel.com.tw/images/og-image.jpg" }, 
        { property:"og:description", content:"Freyja 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！" }, 
      ],
    }
  },
  "vite": {
   "define": {
     "process.env": process.env,
   },
   vue: {
    template: {
      transformAssetUrls,
    },
  },
 },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ["@/assets/css/all.scss"],
  "components": {
  "dirs": [
    {
      "path": "~/components/global",
      "global": true
    }
   ]
  },
  build: {
    transpile: ['vuetify'],
  },
  modules:[
    '@pinia/nuxt',
    'nuxt-swiper',
    '@vee-validate/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  veeValidate: {
    // 啟用 auto imports
    autoImports: true,
    // 更換 components 名稱
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    }
  },
})