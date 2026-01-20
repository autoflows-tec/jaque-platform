<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import type { QuizResponse } from '../../shared/types/Quiz'
import { QUIZ_QUESTIONS } from '../../shared/constants/quizQuestions'

interface QuizResponsesModalProps {
  quiz: QuizResponse | null
  isOpen: boolean
}

interface QuizResponsesModalEmits {
  (e: 'close'): void
}

const props = defineProps<QuizResponsesModalProps>()
const emit = defineEmits<QuizResponsesModalEmits>()

// Formatar data
const formattedDate = computed(() => {
  if (!props.quiz) return ''
  const date = new Date(props.quiz.created_at)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Obter label da resposta
const getAnswerLabel = (questionId: string, answer: string | string[]) => {
  const question = QUIZ_QUESTIONS.find(q => q.id === questionId)
  if (!question) return answer

  if (Array.isArray(answer)) {
    return answer.map(val => {
      const option = question.options.find(opt => opt.value === val)
      return option?.label || val
    }).join(', ')
  }

  const option = question.options.find(opt => opt.value === answer)
  return option?.label || answer
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && quiz"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="handleClose"
    >
      <div class="bg-card rounded-lg shadow-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-foreground">Respostas do Quiz</h2>
            <p class="text-sm text-muted-foreground mt-1">
              Preenchido em {{ formattedDate }}
            </p>
          </div>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors"
            @click="handleClose"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Score -->
        <div class="px-6 py-4 bg-accent/5 border-b border-border">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-muted-foreground">Pontuação Total</span>
            <span class="text-2xl font-bold text-accent">{{ quiz.total_score }}</span>
          </div>
        </div>

        <!-- Respostas -->
        <div class="p-6 space-y-6">
          <div
            v-for="(question, index) in QUIZ_QUESTIONS"
            :key="question.id"
            class="pb-6 border-b border-border last:border-b-0"
          >
            <div class="flex items-start gap-3 mb-3">
              <span class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {{ index + 1 }}
              </span>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-foreground mb-2">
                  {{ question.question }}
                </h3>
                <p
                  v-if="question.type === 'multiple'"
                  class="text-xs text-muted-foreground mb-2"
                >
                  (múltipla escolha)
                </p>
              </div>
            </div>

            <!-- Resposta -->
            <div class="ml-11">
              <div class="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
                <p class="text-sm font-medium text-foreground">
                  {{ getAnswerLabel(question.id, quiz.responses[question.id as keyof typeof quiz.responses] as any) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end">
          <BaseButton
            variant="accent"
            @click="handleClose"
          >
            Fechar
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
