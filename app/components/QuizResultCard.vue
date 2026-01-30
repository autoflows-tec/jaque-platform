<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import type { InflammationResult } from '../../shared/types/Quiz'

interface Props {
  score: number
  result: InflammationResult
}

const props = defineProps<Props>()

// Calcular percentual visual (0-100 sendo máximo teórico)
const scorePercentage = computed(() => {
  const maxScore = 100 // Pontuação máxima teórica
  return Math.min((props.score / maxScore) * 100, 100)
})

// Classes de cor baseadas no nível
const colorClasses = computed(() => {
  const colors = {
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-600',
      border: 'border-green-500',
      badge: 'bg-green-500'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-600',
      border: 'border-yellow-500',
      badge: 'bg-yellow-500'
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-600',
      border: 'border-red-500',
      badge: 'bg-red-500'
    }
  }

  return colors[props.result.color]
})
</script>

<template>
  <div
    id="quiz-result-card"
    class="quiz-result-card bg-card border-2 rounded-xl overflow-hidden"
    :class="colorClasses.border"
  >
    <!-- Header com ícone de sucesso -->
    <div class="p-6 text-center border-b border-border" :class="colorClasses.bg">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
        <CheckCircleIcon class="w-10 h-10" :class="colorClasses.text" />
      </div>
      <h2 class="text-2xl font-bold text-foreground mb-1">
        Quiz Finalizado!
      </h2>
      <p class="text-sm text-muted-foreground">
        Veja seus resultados abaixo
      </p>
    </div>

    <!-- Resultado -->
    <div class="p-6 text-center">
      <!-- Badge de classificação -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" :class="colorClasses.bg">
        <span class="text-2xl">{{ result.icon }}</span>
        <span class="font-bold text-lg" :class="colorClasses.text">
          {{ result.title }}
        </span>
      </div>

      <!-- Pontuação -->
      <div class="mb-6">
        <div class="text-5xl font-bold text-foreground mb-2">
          {{ score }}
        </div>
        <p class="text-sm text-muted-foreground">
          pontos
        </p>
      </div>

      <!-- Barra de progresso visual -->
      <div class="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
        <div
          class="h-full transition-all duration-1000 ease-out rounded-full"
          :class="colorClasses.badge"
          :style="{ width: `${scorePercentage}%` }"
        ></div>
      </div>

      <!-- Descrição -->
      <div class="text-left bg-muted/50 rounded-lg p-4 mb-6">
        <p class="text-sm text-foreground leading-relaxed">
          {{ result.description }}
        </p>
      </div>

      <!-- Recomendações -->
      <div class="text-left">
        <h3 class="font-semibold text-foreground mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>Recomendações para você</span>
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(recommendation, index) in result.recommendations"
            :key="index"
            class="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span class="text-primary mt-0.5">•</span>
            <span>{{ recommendation }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-result-card {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
