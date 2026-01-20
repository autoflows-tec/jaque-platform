<script setup lang="ts">
import QuizHistoryCard from '~/components/QuizHistoryCard.vue'
import QuizResponsesModal from '~/components/QuizResponsesModal.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useQuizStore } from '~/stores/useQuizStore'
import { useUserStore } from '~/stores/useUserStore'
import type { QuizResponse } from '../../shared/types/Quiz'

definePageMeta({
  layout: 'main-layout'
})

const quizStore = useQuizStore()
const userStore = useUserStore()
const router = useRouter()

// Estados do modal
const selectedQuiz = ref<QuizResponse | null>(null)
const showQuizModal = ref(false)

// Carregar histórico ao montar
onMounted(async () => {
  await quizStore.fetchQuizHistory()
})

// Ver respostas de um quiz
const handleViewQuiz = async (quizId: number) => {
  const quiz = await quizStore.fetchQuizById(quizId)
  if (quiz) {
    selectedQuiz.value = quiz
    showQuizModal.value = true
  }
}

// Deletar quiz
const handleDeleteQuiz = async (quizId: number) => {
  const result = await quizStore.deleteQuiz(quizId)
  if (result.success) {
    console.log('Quiz deletado com sucesso')
  } else {
    alert('Erro ao deletar quiz')
  }
}

// Refazer quiz (redireciona para página de quiz vazia)
const handleRedoQuiz = () => {
  router.push('/quiz')
}
</script>

<template>
  <div class="perfil-page">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Perfil</h1>
      <p class="text-muted-foreground">
        Gerencie suas informações e histórico de avaliações
      </p>
    </div>

    <!-- Informações do Usuário -->
    <div class="bg-card rounded-lg border border-border p-6 mb-8">
      <h2 class="text-xl font-semibold text-foreground mb-4">Informações Pessoais</h2>
      <div class="space-y-3">
        <div>
          <span class="text-sm font-medium text-muted-foreground">Nome:</span>
          <p class="text-foreground">{{ userStore.profile?.name || 'Não informado' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-muted-foreground">Email:</span>
          <p class="text-foreground">{{ userStore.profile?.email || 'Não informado' }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-muted-foreground">Tipo de conta:</span>
          <p class="text-foreground capitalize">{{ userStore.profile?.role || 'user' }}</p>
        </div>
      </div>
    </div>

    <!-- Histórico de Quizzes -->
    <div class="bg-card rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-foreground mb-1">Histórico de Avaliações</h2>
          <p class="text-sm text-muted-foreground">
            Veja todas as vezes que você preencheu o quiz de avaliação
          </p>
        </div>
        <BaseButton
          variant="accent"
          @click="handleRedoQuiz"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Refazer Quiz
        </BaseButton>
      </div>

      <!-- Loading state -->
      <div
        v-if="quizStore.loading && quizStore.quizHistory.length === 0"
        class="text-center py-12"
      >
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="text-muted-foreground mt-4">Carregando histórico...</p>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="quizStore.quizHistory.length === 0"
        class="text-center py-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
          />
        </svg>
        <p class="text-muted-foreground font-medium">Nenhum quiz preenchido ainda</p>
        <p class="text-sm text-muted-foreground mt-2">
          Clique em "Refazer Quiz" para começar sua primeira avaliação
        </p>
      </div>

      <!-- Lista de quizzes -->
      <div
        v-else
        class="space-y-4"
      >
        <QuizHistoryCard
          v-for="quiz in quizStore.quizHistory"
          :key="quiz.id"
          :quiz="quiz"
          @view="handleViewQuiz"
          @delete="handleDeleteQuiz"
        />
      </div>
    </div>

    <!-- Modal de respostas -->
    <QuizResponsesModal
      :quiz="selectedQuiz"
      :is-open="showQuizModal"
      @close="showQuizModal = false"
    />
  </div>
</template>
