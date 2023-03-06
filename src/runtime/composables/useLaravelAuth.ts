import { useLaravelApi } from './useLaravelApi'
import { useState, useRuntimeConfig, useCookie, computed, navigateTo } from '#imports'

interface ArtisanLoginCredentials {
  email: string;
  password: string;
}

export const useLaravelAuth = () => {
  const user = useState('laravel_user')

  const stateCookie = useCookie('artisan.auth', {
    default: () => false
  })

  const config = useRuntimeConfig().public.artisan

  const fetchUser = async (force = false) => {
    if (!stateCookie.value && !force) {
      return
    }

    const { data } = await useLaravelApi(config.endpoints.user.url)

    const extractUserFromKey = config.endpoints.user.key

    user.value = extractUserFromKey ? data.value[extractUserFromKey] : data.value
  }

  const login = async (body: ArtisanLoginCredentials) => {
    // start csrf session
    const { error: csrfError } = await useLaravelApi('sanctum/csrf-cookie')

    if (csrfError.value) {
      throw csrfError
    }

    const { data, error } = await useLaravelApi(config.endpoints.login, {
      method: 'POST',
      body
    })

    if (error.value) {
      throw error.value
    }

    user.value = data
    stateCookie.value = true

    if (config.redirects.login) {
      await navigateTo(config.redirects.login)
    }
  }

  const logout = async () => {
    const { error } = await useLaravelApi(config.endpoints.logout, {
      method: 'POST'
    })

    if (error.value) {
      throw error.value
    }

    stateCookie.value = false
    user.value = null

    if (config.redirects.logout) {
      await navigateTo(config.redirects.login)
    }
  }

  const isLoggedIn = computed(() => {
    return !!user.value && stateCookie.value
  })

  return {
    user,
    login,
    logout,
    fetchUser,
    isLoggedIn,
    stateCookie
  }
}
