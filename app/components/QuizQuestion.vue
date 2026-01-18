<script setup lang="ts">
interface QuizQuestionProps {
  id: string
  question: string
  type: 'yesno' | 'single' | 'multiple'
  options: Array<{ value: string; label: string }>
  modelValue: string | string[]
}

interface QuizQuestionEmits {
  (e: 'update:modelValue', value: string | string[]): void
}

const props = defineProps<QuizQuestionProps>()
const emit = defineEmits<QuizQuestionEmits>()

// Para múltipla escolha
const toggleMultipleOption = (value: string) => {
  const currentValues = Array.isArray(props.modelValue) ? props.modelValue : []

  // Se "nenhuma" ou "nenhum" for selecionado, limpa tudo e seleciona apenas esse
  if (value === 'nenhuma' || value === 'nenhum') {
    emit('update:modelValue', [value])
    return
  }

  // Se já tem "nenhuma/nenhum" e clica em outra opção, remove "nenhuma/nenhum"
  let newValues = currentValues.filter(v => v !== 'nenhuma' && v !== 'nenhum')

  // Toggle do valor
  if (newValues.includes(value)) {
    newValues = newValues.filter(v => v !== value)
  } else {
    newValues.push(value)
  }

  // Se ficou vazio, não emite nada
  if (newValues.length === 0) {
    emit('update:modelValue', [])
    return
  }

  emit('update:modelValue', newValues)
}

// Para escolha única
const selectSingleOption = (value: string) => {
  emit('update:modelValue', value)
}

// Verificar se opção está selecionada
const isSelected = (value: string): boolean => {
  if (props.type === 'multiple') {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
  }
  return props.modelValue === value
}
</script>

<template>
  <div class="quiz-question">
    <h3 class="text-lg font-semibold text-foreground mb-4">{{ question }}</h3>

    <div class="space-y-2">
      <!-- Sim/Não -->
      <template v-if="type === 'yesno'">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          :class="[
            'w-full p-4 text-left rounded-lg border-2 transition-all',
            isSelected(option.value)
              ? 'border-primary bg-primary/10 text-foreground font-medium'
              : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-card/80'
          ]"
          @click="selectSingleOption(option.value)"
        >
          {{ option.label }}
        </button>
      </template>

      <!-- Escolha única -->
      <template v-if="type === 'single'">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          :class="[
            'w-full p-4 text-left rounded-lg border-2 transition-all',
            isSelected(option.value)
              ? 'border-primary bg-primary/10 text-foreground font-medium'
              : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-card/80'
          ]"
          @click="selectSingleOption(option.value)"
        >
          {{ option.label }}
        </button>
      </template>

      <!-- Múltipla escolha -->
      <template v-if="type === 'multiple'">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          :class="[
            'w-full p-4 text-left rounded-lg border-2 transition-all flex items-center gap-3',
            isSelected(option.value)
              ? 'border-primary bg-primary/10 text-foreground font-medium'
              : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-card/80'
          ]"
          @click="toggleMultipleOption(option.value)"
        >
          <div
            :class="[
              'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0',
              isSelected(option.value)
                ? 'border-primary bg-primary'
                : 'border-border bg-background'
            ]"
          >
            <svg
              v-if="isSelected(option.value)"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4 text-primary-foreground"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <span>{{ option.label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>
