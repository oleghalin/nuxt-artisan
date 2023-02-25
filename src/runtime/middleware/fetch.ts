import { defineNuxtRouteMiddleware, useLaravelAuth, navigateTo, useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
  const { stateCookie, isLoggedIn, fetchUser } = useLaravelAuth()

  const config = useRuntimeConfig().public.artisan

  if (stateCookie.value && !isLoggedIn.value) {
    try {
      await fetchUser()
    } catch (error) {
      stateCookie.value = false
      return navigateTo(config.redirects.middlewares.auth)
    }
  }
})
