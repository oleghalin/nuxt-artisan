export default defineNuxtConfig({
  modules: ['../src/module'],
  artisan: {
    proxy: false,
    url: 'http://api.laravel.test/api'
  }
})
