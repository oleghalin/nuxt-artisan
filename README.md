![nuxt-artisan](https://socialify.git.ci/oleghalin/nuxt-artisan/image?description=1&font=Bitter&language=1&name=1&theme=Dark)
# Nuxt Artisan

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Integrate Laravel Sanctum into Nuxt.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- ✈️ &nbsp;Proxy requests using Nitro
- 💂 &nbsp;Preconfigured Middlewares
- ✨ &nbsp;`useLaravelApi` composable which handles auth for you by default.
- 🔐 &nbsp;`useLaravelAuth` composable with `login()` and `logout()` methods.
- 🚀 Nuxt 3 support

## Quick Setup

1. Add `nuxt-artisan` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-artisan

# Using yarn
yarn add --dev nuxt-artisan

# Using npm
npm install --save-dev nuxt-artisan
```

2. Add `nuxt-artisan` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-artisan'
  ],
  
  artisan: {
    proxy: true, // define if you want proxy requests or no
    url: 'https://api.laravel.test', // backend url 

    endpoints: {
      user: 'api/user', // user details endpoint (guarded one)
      login: 'api/login', // login endpoint,
      logout: 'api/logout', // logout endpoint
    },
    
    // Optional
    routeMiddlewares: {
      fetch: true, // prefetch user before request
      auth: true, // enable `artisan:auth` middleware
      guest: true, // enable `artisan:guest` middleware
    },
    
    // Optional
    redirects: {
      login: '/', // redirect after login, define false if you want write own logic
      logout: '/login', // redirect after logout, define false if you want write own logic
      
      middlewares: {
        auth: '/login', // redirect after unauthorized middleware fired, define false if you want write custom one.
        guest: '/' // redirect after authorized user tried access public guest only page, define false if you want write custom one.
      }
    }
  }
})
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-artisan/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-artisan

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-artisan.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-artisan

[license-src]: https://img.shields.io/npm/l/nuxt-artisan.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-artisan

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
