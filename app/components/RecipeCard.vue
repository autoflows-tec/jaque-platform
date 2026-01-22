<script setup lang="ts">
import { HeartIcon, ClockIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import type { RecipeWithFavorite } from '../../shared/types/Recipe'
import { RecipeCategoryLabels, RecipeDifficultyLabels } from '../../shared/types/Recipe'

interface Props {
  recipe: RecipeWithFavorite
}

interface Emits {
  (e: 'click'): void
  (e: 'favorite'): void
  (e: 'unfavorite'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Calcular tempo total
const totalTime = computed(() => {
  const prep = props.recipe.prep_time_minutes || 0
  const cook = props.recipe.cook_time_minutes || 0
  return prep + cook
})

// Truncar descrição
const truncatedDescription = computed(() => {
  if (!props.recipe.description) return ''
  return props.recipe.description.length > 100
    ? props.recipe.description.substring(0, 100) + '...'
    : props.recipe.description
})

// Handler para favoritar
const handleFavoriteClick = (event: Event) => {
  event.stopPropagation()
  if (props.recipe.user_has_favorited) {
    emit('unfavorite')
  } else {
    emit('favorite')
  }
}
</script>

<template>
  <div
    id="recipe-card"
    class="recipe-card bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    @click="emit('click')"
  >
    <!-- Imagem -->
    <div class="relative h-48 bg-muted overflow-hidden">
      <img
        v-if="recipe.image_url"
        :src="recipe.image_url"
        :alt="recipe.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16 text-muted-foreground opacity-30"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
          />
        </svg>
      </div>

      <!-- Botão de favoritar -->
      <button
        class="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        @click="handleFavoriteClick"
      >
        <HeartIconSolid
          v-if="recipe.user_has_favorited"
          class="w-5 h-5 text-destructive"
        />
        <HeartIcon
          v-else
          class="w-5 h-5 text-foreground"
        />
      </button>

      <!-- Badge de categoria -->
      <div class="absolute bottom-3 left-3">
        <span class="px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full">
          {{ RecipeCategoryLabels[recipe.category] }}
        </span>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="p-4">
      <!-- Título -->
      <h3 class="text-lg font-semibold text-foreground mb-2 line-clamp-2">
        {{ recipe.title }}
      </h3>

      <!-- Descrição -->
      <p
        v-if="recipe.description"
        class="text-sm text-muted-foreground mb-4 line-clamp-2"
      >
        {{ truncatedDescription }}
      </p>

      <!-- Metadados -->
      <div class="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <!-- Tempo total -->
        <div
          v-if="totalTime > 0"
          class="flex items-center gap-1"
        >
          <ClockIcon class="w-4 h-4" />
          <span>{{ totalTime }} min</span>
        </div>

        <!-- Porções -->
        <div class="flex items-center gap-1">
          <UserGroupIcon class="w-4 h-4" />
          <span>{{ recipe.servings }} {{ recipe.servings === 1 ? 'porção' : 'porções' }}</span>
        </div>

        <!-- Dificuldade -->
        <div class="flex items-center gap-1">
          <ChartBarIcon class="w-4 h-4" />
          <span>{{ RecipeDifficultyLabels[recipe.difficulty] }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div
        v-if="recipe.tags && recipe.tags.length > 0"
        class="flex flex-wrap gap-1"
      >
        <span
          v-for="tag in recipe.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded"
        >
          {{ tag }}
        </span>
        <span
          v-if="recipe.tags.length > 3"
          class="px-2 py-0.5 text-muted-foreground text-xs"
        >
          +{{ recipe.tags.length - 3 }}
        </span>
      </div>

      <!-- Footer com favoritos -->
      <div class="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <HeartIcon class="w-4 h-4" />
          <span>{{ recipe.favorites_count }} {{ recipe.favorites_count === 1 ? 'favorito' : 'favoritos' }}</span>
        </div>

        <!-- Calorias -->
        <div
          v-if="recipe.calories_per_serving"
          class="text-xs text-muted-foreground"
        >
          {{ recipe.calories_per_serving }} kcal
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
