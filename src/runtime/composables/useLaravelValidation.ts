import { FetchError } from 'ofetch'

export interface LaravelValidationErrors {
  message?: string
  errors: Record<string, Array<string>>
}

export function useLaravelValidation (fetchError: FetchError): LaravelValidationErrors {
  if (fetchError.status !== 422) {
    throw new Error('Response is not ValidationException.')
  }

  const data = fetchError.data

  return {
    message: data.message,
    errors: data.errors ?? {}
  }
}
