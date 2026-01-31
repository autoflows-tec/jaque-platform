<script setup lang="ts">
import QuizQuestion from '~/components/QuizQuestion.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useQuizStore } from '~/stores/useQuizStore'
import { QUIZ_QUESTIONS } from '../../shared/constants/quizQuestions'
import type { QuizResponses } from '../../shared/types/Quiz'

definePageMeta({
  layout: 'main-layout'
})

const quizStore = useQuizStore()
const router = useRouter()

// Estado do formulário
const currentStep = ref(0)
const responses = ref<Partial<QuizResponses>>({})
const isSubmitting = ref(false)
const showResultModal = ref(false)
const quizResult = ref<any>(null)

// Total de perguntas
const totalQuestions = QUIZ_QUESTIONS.length

// Pergunta atual
const currentQuestion = computed(() => QUIZ_QUESTIONS[currentStep.value])

// Progresso
const progress = computed(() => ((currentStep.value + 1) / totalQuestions) * 100)

// Verificar se a pergunta atual foi respondida
const isCurrentQuestionAnswered = computed(() => {
  const questionId = currentQuestion.value.id as keyof QuizResponses
  const answer = responses.value[questionId]

  if (currentQuestion.value.type === 'multiple') {
    return Array.isArray(answer) && answer.length > 0
  }

  return !!answer
})

// Navegar para próxima pergunta
const nextQuestion = () => {
  if (currentStep.value < totalQuestions - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Voltar para pergunta anterior
const previousQuestion = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Finalizar quiz (sempre criar NOVO registro)
const submitQuiz = async () => {
  // Prevenir múltiplos cliques
  if (isSubmitting.value) {
    console.log('⚠️ Já está enviando...')
    return
  }

  try {
    isSubmitting.value = true

    // Validar se todas as perguntas foram respondidas
    const allAnswered = QUIZ_QUESTIONS.every(q => {
      const answer = responses.value[q.id as keyof QuizResponses]
      if (q.type === 'multiple') {
        return Array.isArray(answer) && answer.length > 0
      }
      return !!answer
    })

    if (!allAnswered) {
      alert('Por favor, responda todas as perguntas antes de finalizar.')
      isSubmitting.value = false
      return
    }

    console.log('Enviando respostas:', responses.value)

    // Criar NOVO quiz no Supabase (nunca atualiza)
    const result = await quizStore.createQuizResponse(responses.value as QuizResponses, true)

    console.log('Resultado da criação:', result)

    if (result.success && result.data) {
      console.log('✅ Quiz salvo! ID:', result.data.id)

      // Calcular resultado
      const totalScore = result.data.total_score
      const inflammationLevel = getInflammationLevel(totalScore)
      const inflammationMessage = getInflammationMessage(inflammationLevel)

      // Armazenar resultado e mostrar modal
      quizResult.value = {
        id: result.data.id,
        score: totalScore,
        level: inflammationLevel,
        message: inflammationMessage
      }

      showResultModal.value = true
      isSubmitting.value = false
    } else {
      console.error('Erro ao salvar quiz:', result.error || 'Erro desconhecido')
      alert(`Erro ao salvar quiz: ${result.error || 'Tente novamente.'}`)
      isSubmitting.value = false
    }
  } catch (error) {
    console.error('Erro ao submeter quiz:', error)
    alert('Erro inesperado ao salvar quiz. Tente novamente.')
    isSubmitting.value = false
  }
}

// Atualizar resposta
const updateResponse = (questionId: string, value: string | string[]) => {
  responses.value[questionId as keyof QuizResponses] = value as any
}
</script>

<template>
  <div class="quiz-page">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">Quiz de Avaliação</h1>
          <p class="text-muted-foreground">
            Pergunta {{ currentStep + 1 }} de {{ totalQuestions }}
          </p>
        </div>
      </div>

      <!-- Barra de progresso -->
      <div class="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          class="bg-primary h-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="max-w-3xl">
      <div class="bg-card rounded-lg shadow-lg border border-border p-6 md:p-8">
        <!-- Pergunta atual -->
        <QuizQuestion
          :id="currentQuestion.id"
          :question="currentQuestion.question"
          :type="currentQuestion.type"
          :options="currentQuestion.options"
          :model-value="responses[currentQuestion.id as keyof QuizResponses] as any"
          @update:model-value="updateResponse(currentQuestion.id, $event)"
        />

        <!-- Navegação -->
        <div class="flex items-center justify-between mt-8 gap-4">
          <BaseButton
            v-if="currentStep > 0"
            variant="outline"
            @click="previousQuestion"
          >
            ← Anterior
          </BaseButton>
          <div v-else />

          <BaseButton
            v-if="currentStep < totalQuestions - 1"
            variant="accent"
            :disabled="!isCurrentQuestionAnswered"
            @click="nextQuestion"
          >
            Próxima →
          </BaseButton>

          <BaseButton
            v-else
            variant="accent"
            :disabled="!isCurrentQuestionAnswered || isSubmitting"
            @click="submitQuiz"
          >
            {{ isSubmitting ? 'Salvando...' : 'Finalizar Quiz' }}
          </BaseButton>
        </div>

        <!-- Indicador de resposta obrigatória -->
        <p
          v-if="!isCurrentQuestionAnswered"
          class="text-sm text-muted-foreground text-center mt-4"
        >
          Selecione uma opção para continuar
        </p>
      </div>

      <!-- Informação adicional -->
      <p class="text-center text-sm text-muted-foreground mt-6">
        Suas respostas nos ajudarão a personalizar sua experiência na plataforma
      </p>
    </div>

    <!-- Modal de Resultado -->
    <div
      v-if="showResultModal && quizResult"
      id="result-modal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      @click.self="showResultModal = false"
    >
      <div class="bg-card max-w-3xl w-full rounded-lg shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-foreground">Resultado do Quiz</h2>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
            @click="showResultModal = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="p-6">
          <QuizResultCard
            :score="quizResult.score"
            :result="quizResult.message"
          />

          <!-- Ações -->
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <BaseButton
              variant="outline"
              class="flex-1"
              @click="showResultModal = false"
            >
              Fechar
            </BaseButton>

            <BaseButton
              variant="accent"
              class="flex-1"
              @click="router.push('/perfil')"
            >
              Ir para Meu Perfil
            </BaseButton>
          </div>

          <!-- Nota informativa -->
          <div class="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p class="text-sm text-muted-foreground">
              <strong class="text-foreground">Nota:</strong> Este resultado é baseado nas suas respostas e serve como uma orientação inicial. Para um diagnóstico preciso e tratamento adequado, consulte sempre um profissional de saúde qualificado.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
