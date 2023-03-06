import { FetchError } from 'ofetch'
import { defineNuxtRouteMiddleware, useLaravelAuth, navigateTo, useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
  const { stateCookie, isLoggedIn, fetchUser, user } = useLaravelAuth()

  const config = useRuntimeConfig().public.artisan

  if (stateCookie.value && !isLoggedIn.value) {
    try {
      await fetchUser()
    } catch (error) {
      if (error instanceof FetchError && error.status && [401, 419].includes(error.status)) {
        stateCookie.value = false
        user.value = null
        return navigateTo(config.redirects.middlewares.auth)
      }

      throw error
    }
  }
})
