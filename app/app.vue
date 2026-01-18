<script setup lang="ts">
import { useUserStore } from '~/stores/useUserStore'
import { useQuizStore } from '~/stores/useQuizStore'

const userStore = useUserStore()
const quizStore = useQuizStore()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()

watch(user, async (newUser) => {
  if (newUser) {
    await userStore.fetchProfile()
    await quizStore.fetchQuizResponse()

    // Redirecionar para quiz se ainda não completou
    // Evitar redirect loop checando se já está na página de quiz ou login
    if (!quizStore.hasCompletedQuiz && route.path !== '/quiz' && route.path !== '/login') {
      router.push('/quiz')
    }
  }
}, { immediate: true })
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
