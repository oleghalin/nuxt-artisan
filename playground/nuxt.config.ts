export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/devtools'],
  artisan: {
    proxy: false,
    url: 'http://api.laravel.test/api',
    devtools: {
      enabled: true,
      apps: {
        telescope: true,
        horizon: true
      }
    }
  }
})
