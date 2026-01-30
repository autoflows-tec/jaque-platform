<script setup lang="ts">
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import QuizResultCard from '~/components/QuizResultCard.vue'
import { useQuizStore } from '~/stores/useQuizStore'
import { getInflammationLevel, getInflammationMessage } from '../../../../shared/types/Quiz'

definePageMeta({
  layout: 'main-layout',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const user = useSupabaseUser()

const quizId = computed(() => parseInt(route.params.id as string))
const quiz = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Resultado calculado
const inflammationLevel = computed(() => {
  if (!quiz.value) return null
  return getInflammationLevel(quiz.value.total_score)
})

const inflammationResult = computed(() => {
  if (!inflammationLevel.value) return null
  return getInflammationMessage(inflammationLevel.value)
})

// Carregar quiz
onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const result = await quizStore.fetchQuizById(quizId.value)

    if (!result) {
      error.value = 'Quiz não encontrado'
      return
    }

    // Verificar se o usuário é dono do quiz
    const userId = user.value?.id || user.value?.sub
    if (result.user_id !== userId) {
      error.value = 'Você não tem permissão para ver este resultado'
      router.push('/perfil')
      return
    }

    quiz.value = result
  } catch (err: any) {
    console.error('Erro ao carregar resultado:', err)
    error.value = 'Erro ao carregar resultado do quiz'
  } finally {
    loading.value = false
  }
})

// Ir para perfil
const handleGoToProfile = () => {
  router.push('/perfil')
}

// Ver respostas detalhadas (futura implementação)
const handleViewDetails = () => {
  // TODO: Implementar modal ou página com respostas detalhadas
  alert('Funcionalidade em desenvolvimento')
}
</script>

<template>
  <div id="quiz-resultado-page" class="quiz-resultado-page max-w-3xl mx-auto py-8 px-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
      <p class="text-muted-foreground">Carregando resultado...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-destructive mx-auto mb-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p class="text-destructive font-medium mb-4">{{ error }}</p>
      <button
        class="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        @click="router.push('/perfil')"
      >
        Voltar para o Perfil
      </button>
    </div>

    <!-- Resultado -->
    <div v-else-if="quiz && inflammationResult">
      <!-- Header -->
      <div class="mb-6">
        <button
          class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          @click="handleGoToProfile"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          <span>Voltar para o Perfil</span>
        </button>

        <h1 class="text-3xl font-bold text-foreground mb-2">
          Resultado do Quiz
        </h1>
        <p class="text-sm text-muted-foreground">
          Realizado em {{ new Date(quiz.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) }}
        </p>
      </div>

      <!-- Card de resultado -->
      <QuizResultCard
        :score="quiz.total_score"
        :result="inflammationResult"
      />

      <!-- Ações -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <!-- Ver detalhes (desabilitado por enquanto) -->
        <button
          class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors opacity-50 cursor-not-allowed"
          disabled
          @click="handleViewDetails"
        >
          <DocumentTextIcon class="w-5 h-5" />
          <span>Ver Respostas Detalhadas</span>
        </button>

        <!-- Ir para perfil -->
        <button
          class="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          @click="handleGoToProfile"
        >
          Ir para Meu Perfil
        </button>
      </div>

      <!-- Nota informativa -->
      <div class="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <p class="text-sm text-muted-foreground">
          <strong class="text-foreground">Nota:</strong> Este resultado é baseado nas suas respostas e serve como uma orientação inicial. Para um diagnóstico preciso e tratamento adequado, consulte sempre um profissional de saúde qualificado.
        </p>
      </div>
    </div>
  </div>
</template>
