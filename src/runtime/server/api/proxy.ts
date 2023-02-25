import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const url = config.artisan?.url
  if (!url) {
    throw new Error('No laravel url provided')
  }

  const csrfCookie = getCookie(event, 'XSRF-TOKEN')

  return proxyRequest(event, `${url}${event.path?.replace('/_laravel', '')}`, {
    headers: {
      'x-xsrf-token': csrfCookie
    }
  })
})
