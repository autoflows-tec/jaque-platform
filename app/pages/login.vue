<script setup lang="ts">
import LoginForm from '~/components/LoginForm.vue'

definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-foreground">
          GDAA 2.0
        </h1>
      </div>

      <LoginForm />
    </div>
  </div>
</template>
