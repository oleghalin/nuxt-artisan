import { UseFetchOptions } from '#app'
import { AsyncData } from '#app/composables/asyncData'
import { useFetch, useRuntimeConfig, useCookie, useRequestHeaders } from '#imports'

export function useLaravelApi (uri: string, opts?: UseFetchOptions<any>): AsyncData<any, any> {
  const config = useRuntimeConfig().public.artisan

  const proxyUri = '_laravel'

  const target = config.proxy ? `/${proxyUri}` : config.url

  const h3Headers = useRequestHeaders()

  return useFetch(`${target}/${uri}`, {
    ...opts,
    credentials: 'include',
    headers: {
      accept: 'application/json',
      ...(config.proxy
        ? {}
        : {
            cookie: h3Headers.cookie,
            'x-xsrf-token': useCookie('XSRF-TOKEN').value,
            referer: h3Headers.referer ?? h3Headers.host
          })
    } as HeadersInit
  })
}
