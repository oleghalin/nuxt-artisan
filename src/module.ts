import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addServerHandler, useLogger, addRouteMiddleware } from '@nuxt/kit'
import { defu } from 'defu'
import { joinURL, parseURL } from 'ufo'

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type LaravelIframeApps = 'horizon' | 'telescope' | 'nova'
interface LaravelAppDescription {
  name: string;
  icon: string;
  key: LaravelIframeApps;
}

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
    user?: {
      url?: string,
      key?: string | false
    },
    logout?: string,
  },
  devtools?: {
    enabled: boolean,
    apps: PartialRecord<LaravelIframeApps, string | boolean>
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
      user: {
        url: 'user',
        key: 'data'
      },
      logout: 'logout'
    },
    devtools: {
      enabled: false,
      apps: {
        horizon: false,
        telescope: false,
        nova: false
      }
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

    const resolvedUrl = parseURL(options.url)
    const baseBackendUrl = `${resolvedUrl.protocol!}//` + resolvedUrl.host!

    if (options.devtools?.enabled) {
      const ecosystemApps: Array<LaravelAppDescription> = [
        {
          name: 'Laravel Telescope',
          icon: 'mdi:telescope',
          key: 'telescope'
        },
        {
          name: 'Laravel Horizon',
          icon: 'cib:laravel-horizon',
          key: 'horizon'
        },
        {
          name: 'Laravel Nova',
          icon: 'cib:laravel-nova',
          key: 'nova'
        }
      ]

      // @ts-ignore suppress until nuxt adds devtools typings for hooks
      nuxt.hook('devtools:customTabs', (tabs: Array<unknown>) => {
        for (const index in ecosystemApps) {
          const app = ecosystemApps[index]
          if (options.devtools?.apps[app.key]) {
            const route = typeof options.devtools.apps[app.key] === 'string' ? String(options.devtools.apps[app.key]) : app.key

            tabs.push({
              name: `nuxt-artisan-${app.key}`,
              title: app.name,
              icon: app.icon,
              view: {
                type: 'iframe',
                src: joinURL(baseBackendUrl, route)
              }
            })
          }
        }
      })
    }
  }
})
