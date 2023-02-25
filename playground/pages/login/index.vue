<template>
  <div :class="$style.wrapper">
    <form
      :class="$style.form"
      @submit.prevent="onSubmit"
    >
      <input
        v-model="credentials.email"
        type="text"
        placeholder="Enter your email"
      >
      <input
        v-model="credentials.password"
        type="password"
        placeholder="Enter your password"
      >

      <button type="submit">
        Login
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch'
import { definePageMeta, reactive, useLaravelAuth } from '#imports'

definePageMeta({
  middleware: 'artisan:guest'
})

const credentials = reactive({
  email: '',
  password: ''
})

const auth = useLaravelAuth()

const onSubmit = async () => {
  try {
    await auth.login(credentials)
  } catch (error) {
    if (error instanceof FetchError) {
      alert(error.data.message)

      return
    }

    throw error
  }
}
</script>

<style module>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 500px;
}
</style>
