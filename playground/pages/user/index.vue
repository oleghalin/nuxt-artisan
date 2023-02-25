<template>
  <div>
    <pre>
    {{ auth.user }}
  </pre>

    <button @click="auth.logout()">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">

import { definePageMeta, useLaravelAuth } from '#imports'

definePageMeta({
  middleware: 'artisan:auth'
})

const auth = useLaravelAuth()
</script>
