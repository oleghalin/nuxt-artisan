import { defineNuxtRouteMiddleware, useLaravelAuth, navigateTo, useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useLaravelAuth()

  const config = useRuntimeConfig().public.artisan

  if (isLoggedIn.value) {
    return navigateTo(config.redirects.middlewares.guest)
  }
})
