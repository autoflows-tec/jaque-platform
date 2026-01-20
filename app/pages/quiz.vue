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
    return
  }

  // Criar NOVO quiz no Supabase (nunca atualiza)
  const result = await quizStore.createQuizResponse(responses.value as QuizResponses, true)

  if (result.success) {
    // Redirecionar para perfil após sucesso
    router.push('/perfil')
  } else {
    alert('Erro ao salvar quiz. Tente novamente.')
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
            :disabled="!isCurrentQuestionAnswered || quizStore.loading"
            @click="submitQuiz"
          >
            {{ quizStore.loading ? 'Salvando...' : 'Finalizar Quiz' }}
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
  </div>
</template>
