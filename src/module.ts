import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addServerHandler, useLogger, addRouteMiddleware } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  proxy: boolean;
  url?: string;

  routeMiddlewares: {
    fetch?: boolean;
    auth?: boolean;
    guest?: boolean;
  },

  redirects: {
    login: boolean | string;
    logout: boolean | string;

    middlewares?: {
      auth?: string;
      guest?: string;
    }
  },
  endpoints: {
    login?: string,
    user?: string,
    logout?: string,
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-artisan',
    configKey: 'artisan',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    proxy: false,
    routeMiddlewares: {
      fetch: true,
      auth: true,
      guest: true
    },
    redirects: {
      login: '/',
      logout: '/login',

      middlewares: {
        auth: '/login',
        guest: '/'
      }
    },
    endpoints: {
      login: 'login',
      user: 'user',
      logout: 'logout'
    }
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (!options.proxy) {
      useLogger().warn('Laravel API url not provided')
    }

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Private runtimeConfig
    nuxt.options.runtimeConfig.artisan = defu(nuxt.options.runtimeConfig.artisan, {
      proxy: options.proxy,
      url: options.url
    })

    // Public runtimeConfig
    nuxt.options.runtimeConfig.public.artisan = defu(nuxt.options.runtimeConfig.public.artisan, {
      endpoints: options.endpoints,
      redirects: options.redirects,
      routeMiddlewares: options.routeMiddlewares,
      proxy: options.proxy,
      url: options.proxy ? null : options.url
    })

    if (options.proxy) {
      addServerHandler({
        route: '/_laravel/**',
        handler: resolve(runtimeDir, 'server/api/proxy')
      })
    }

    if (options.routeMiddlewares.guest) {
      addRouteMiddleware({
        name: 'artisan:guest',
        path: resolve(runtimeDir, 'middleware/guest')
      })
    }

    if (options.routeMiddlewares.auth) {
      addRouteMiddleware({
        name: 'artisan:auth',
        path: resolve(runtimeDir, 'middleware/auth')
      })
    }

    if (options.routeMiddlewares.fetch) {
      addRouteMiddleware({
        name: '0.artisan:fetch-user',
        path: resolve(runtimeDir, 'middleware/fetch'),
        global: true
      })
    }

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })
  }
})
