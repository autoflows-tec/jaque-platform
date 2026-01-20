<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import type { QuizHistoryItem } from '../../shared/types/Quiz'

interface QuizHistoryCardProps {
  quiz: QuizHistoryItem
}

interface QuizHistoryCardEmits {
  (e: 'view', quizId: number): void
  (e: 'delete', quizId: number): void
}

const props = defineProps<QuizHistoryCardProps>()
const emit = defineEmits<QuizHistoryCardEmits>()

// Formatar data
const formattedDate = computed(() => {
  const date = new Date(props.quiz.created_at)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Classificação do score (exemplo)
const scoreCategory = computed(() => {
  const score = props.quiz.total_score
  if (score < 20) return { label: 'Baixo', color: 'text-green-600' }
  if (score < 40) return { label: 'Moderado', color: 'text-yellow-600' }
  if (score < 60) return { label: 'Alto', color: 'text-orange-600' }
  return { label: 'Muito Alto', color: 'text-red-600' }
})

const handleView = () => {
  emit('view', props.quiz.id)
}

const handleDelete = () => {
  if (confirm('Tem certeza que deseja excluir este quiz?')) {
    emit('delete', props.quiz.id)
  }
}
</script>

<template>
  <div class="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-lg font-semibold text-foreground">
            Quiz de Avaliação
          </h3>
          <span
            v-if="quiz.is_completed"
            class="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
          >
            Completo
          </span>
          <span
            v-else
            class="px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
          >
            Em andamento
          </span>
        </div>
        <p class="text-sm text-muted-foreground">
          Preenchido em {{ formattedDate }}
        </p>
      </div>

      <!-- Score -->
      <div class="text-right">
        <p class="text-2xl font-bold" :class="scoreCategory.color">
          {{ quiz.total_score }}
        </p>
        <p class="text-xs text-muted-foreground">
          {{ scoreCategory.label }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3 pt-4 border-t border-border">
      <BaseButton
        variant="accent"
        @click="handleView"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-4 h-4 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Ver Respostas
      </BaseButton>

      <BaseButton
        variant="ghost"
        @click="handleDelete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-4 h-4 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
        Excluir
      </BaseButton>
    </div>
  </div>
</template>
