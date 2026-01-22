<script setup lang="ts">
import { FunnelIcon, XMarkIcon, HeartIcon } from '@heroicons/vue/24/outline'
import {
  RecipeCategory,
  RecipeDifficulty,
  RecipeCategoryLabels,
  RecipeDifficultyLabels,
  type RecipeFilters
} from '../../shared/types/Recipe'

interface Emits {
  (e: 'apply', filters: RecipeFilters): void
  (e: 'clear'): void
}

const emit = defineEmits<Emits>()

// Estado dos filtros
const selectedCategory = ref<RecipeCategory | null>(null)
const selectedDifficulty = ref<RecipeDifficulty | null>(null)
const maxPrepTime = ref<number | null>(null)
const favoritesOnly = ref(false)
const showFilters = ref(false)

// Opções de categorias
const categoryOptions = [
  { value: RecipeCategory.BREAKFAST, label: RecipeCategoryLabels[RecipeCategory.BREAKFAST] },
  { value: RecipeCategory.LUNCH, label: RecipeCategoryLabels[RecipeCategory.LUNCH] },
  { value: RecipeCategory.DINNER, label: RecipeCategoryLabels[RecipeCategory.DINNER] },
  { value: RecipeCategory.SNACK, label: RecipeCategoryLabels[RecipeCategory.SNACK] },
  { value: RecipeCategory.DESSERT, label: RecipeCategoryLabels[RecipeCategory.DESSERT] }
]

// Opções de dificuldade
const difficultyOptions = [
  { value: RecipeDifficulty.EASY, label: RecipeDifficultyLabels[RecipeDifficulty.EASY] },
  { value: RecipeDifficulty.MEDIUM, label: RecipeDifficultyLabels[RecipeDifficulty.MEDIUM] },
  { value: RecipeDifficulty.HARD, label: RecipeDifficultyLabels[RecipeDifficulty.HARD] }
]

// Opções de tempo máximo
const timeOptions = [
  { value: 15, label: 'Até 15 min' },
  { value: 30, label: 'Até 30 min' },
  { value: 60, label: 'Até 1 hora' },
  { value: 120, label: 'Até 2 horas' }
]

// Verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return selectedCategory.value !== null ||
    selectedDifficulty.value !== null ||
    maxPrepTime.value !== null ||
    favoritesOnly.value
})

// Aplicar filtros
const applyFilters = () => {
  const filters: RecipeFilters = {
    category: selectedCategory.value,
    difficulty: selectedDifficulty.value,
    max_prep_time: maxPrepTime.value,
    favorites_only: favoritesOnly.value
  }

  emit('apply', filters)
  showFilters.value = false
}

// Limpar filtros
const clearFilters = () => {
  selectedCategory.value = null
  selectedDifficulty.value = null
  maxPrepTime.value = null
  favoritesOnly.value = false

  emit('clear')
  showFilters.value = false
}

// Toggle favoritos
const toggleFavorites = () => {
  favoritesOnly.value = !favoritesOnly.value
  applyFilters()
}
</script>

<template>
  <div id="recipe-filters" class="recipe-filters">
    <!-- Barra de filtros -->
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Botão de filtros -->
      <button
        class="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
        :class="{ 'bg-primary text-primary-foreground border-primary hover:bg-primary/90': hasActiveFilters }"
        @click="showFilters = !showFilters"
      >
        <FunnelIcon class="w-4 h-4" />
        <span class="text-sm font-medium">Filtros</span>
        <span
          v-if="hasActiveFilters"
          class="ml-1 px-1.5 py-0.5 bg-primary-foreground text-primary text-xs rounded-full"
        >
          {{ [selectedCategory, selectedDifficulty, maxPrepTime, favoritesOnly].filter(Boolean).length }}
        </span>
      </button>

      <!-- Botão de favoritos -->
      <button
        class="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
        :class="{ 'bg-destructive/10 text-destructive border-destructive': favoritesOnly }"
        @click="toggleFavorites"
      >
        <HeartIcon class="w-4 h-4" />
        <span class="text-sm font-medium">Favoritos</span>
      </button>

      <!-- Limpar filtros -->
      <button
        v-if="hasActiveFilters"
        class="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        @click="clearFilters"
      >
        <XMarkIcon class="w-4 h-4" />
        <span>Limpar</span>
      </button>
    </div>

    <!-- Painel de filtros expandido -->
    <Transition name="slide-down">
      <div
        v-if="showFilters"
        class="mt-4 p-4 bg-card border border-border rounded-lg space-y-4"
      >
        <!-- Categoria -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Categoria
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in categoryOptions"
              :key="option.value"
              class="px-3 py-1.5 text-sm border rounded-lg transition-colors"
              :class="selectedCategory === option.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-muted'"
              @click="selectedCategory = selectedCategory === option.value ? null : option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Dificuldade -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Dificuldade
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in difficultyOptions"
              :key="option.value"
              class="px-3 py-1.5 text-sm border rounded-lg transition-colors"
              :class="selectedDifficulty === option.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-muted'"
              @click="selectedDifficulty = selectedDifficulty === option.value ? null : option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Tempo máximo -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Tempo de preparo
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in timeOptions"
              :key="option.value"
              class="px-3 py-1.5 text-sm border rounded-lg transition-colors"
              :class="maxPrepTime === option.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-muted'"
              @click="maxPrepTime = maxPrepTime === option.value ? null : option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="flex items-center gap-2 pt-2">
          <button
            class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            @click="applyFilters"
          >
            Aplicar Filtros
          </button>
          <button
            class="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            @click="clearFilters"
          >
            Limpar
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
