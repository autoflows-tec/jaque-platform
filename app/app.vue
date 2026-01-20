<script setup lang="ts">
import { useUserStore } from '~/stores/useUserStore'
import { useQuizStore } from '~/stores/useQuizStore'

const userStore = useUserStore()
const quizStore = useQuizStore()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()

// Flag para evitar múltiplos redirects
const hasCheckedQuiz = ref(false)
const hasRedirectedToQuiz = ref(false)

// Watch do usuário apenas para carregar dados e verificar quiz UMA VEZ
watch(user, async (newUser) => {
  if (newUser && !hasCheckedQuiz.value) {
    await userStore.fetchProfile()
    await quizStore.fetchQuizHistory() // Buscar histórico ao invés de quiz único
    hasCheckedQuiz.value = true

    // Verificar se precisa redirecionar para quiz APENAS UMA VEZ
    // Redireciona apenas se NÃO tiver NENHUM quiz completado
    if (!quizStore.hasCompletedQuiz && !hasRedirectedToQuiz.value) {
      const currentPath = route.path
      if (currentPath !== '/quiz' && currentPath !== '/login') {
        hasRedirectedToQuiz.value = true
        await router.push('/quiz')
      }
    }
  }
}, { immediate: true })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
