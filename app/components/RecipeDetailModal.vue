<script setup lang="ts">
import { XMarkIcon, HeartIcon, ClockIcon, UserGroupIcon, ChartBarIcon, FireIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import type { RecipeWithFavorite } from '../../shared/types/Recipe'
import { RecipeCategoryLabels, RecipeDifficultyLabels } from '../../shared/types/Recipe'

interface Props {
  recipe: RecipeWithFavorite
  show: boolean
}

interface Emits {
  (e: 'close'): void
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

// Handler para favoritar
const handleFavoriteClick = () => {
  if (props.recipe.user_has_favorited) {
    emit('unfavorite')
  } else {
    emit('favorite')
  }
}

// Fechar modal com ESC
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      id="recipe-detail-modal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <!-- Header com imagem -->
        <div class="relative h-64 bg-muted flex-shrink-0">
          <img
            v-if="recipe.image_url"
            :src="recipe.image_url"
            :alt="recipe.title"
            class="w-full h-full object-cover"
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
              class="w-24 h-24 text-muted-foreground opacity-30"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
              />
            </svg>
          </div>

          <!-- Botão de fechar -->
          <button
            class="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            @click="emit('close')"
          >
            <XMarkIcon class="w-6 h-6 text-foreground" />
          </button>

          <!-- Botão de favoritar -->
          <button
            class="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            @click="handleFavoriteClick"
          >
            <HeartIconSolid
              v-if="recipe.user_has_favorited"
              class="w-6 h-6 text-destructive"
            />
            <HeartIcon
              v-else
              class="w-6 h-6 text-foreground"
            />
          </button>

          <!-- Badge de categoria -->
          <div class="absolute bottom-4 left-4">
            <span class="px-4 py-2 bg-primary/90 backdrop-blur-sm text-primary-foreground text-sm font-medium rounded-full">
              {{ RecipeCategoryLabels[recipe.category] }}
            </span>
          </div>
        </div>

        <!-- Conteúdo scrollável -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Título e descrição -->
          <div>
            <h2 class="text-3xl font-bold text-foreground mb-2">{{ recipe.title }}</h2>
            <p
              v-if="recipe.description"
              class="text-muted-foreground"
            >
              {{ recipe.description }}
            </p>
          </div>

          <!-- Metadados -->
          <div class="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
            <!-- Tempo total -->
            <div
              v-if="totalTime > 0"
              class="flex items-center gap-2"
            >
              <ClockIcon class="w-5 h-5 text-primary" />
              <div class="text-sm">
                <div class="font-medium text-foreground">{{ totalTime }} min</div>
                <div class="text-xs text-muted-foreground">Tempo total</div>
              </div>
            </div>

            <!-- Porções -->
            <div class="flex items-center gap-2">
              <UserGroupIcon class="w-5 h-5 text-primary" />
              <div class="text-sm">
                <div class="font-medium text-foreground">{{ recipe.servings }}</div>
                <div class="text-xs text-muted-foreground">{{ recipe.servings === 1 ? 'Porção' : 'Porções' }}</div>
              </div>
            </div>

            <!-- Dificuldade -->
            <div class="flex items-center gap-2">
              <ChartBarIcon class="w-5 h-5 text-primary" />
              <div class="text-sm">
                <div class="font-medium text-foreground">{{ RecipeDifficultyLabels[recipe.difficulty] }}</div>
                <div class="text-xs text-muted-foreground">Dificuldade</div>
              </div>
            </div>

            <!-- Calorias -->
            <div
              v-if="recipe.calories_per_serving"
              class="flex items-center gap-2"
            >
              <FireIcon class="w-5 h-5 text-primary" />
              <div class="text-sm">
                <div class="font-medium text-foreground">{{ recipe.calories_per_serving }} kcal</div>
                <div class="text-xs text-muted-foreground">Por porção</div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div
            v-if="recipe.tags && recipe.tags.length > 0"
            class="flex flex-wrap gap-2"
          >
            <span
              v-for="tag in recipe.tags"
              :key="tag"
              class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Ingredientes -->
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              Ingredientes
            </h3>
            <ul class="space-y-2">
              <li
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
                class="flex items-start gap-3 text-foreground"
              >
                <span class="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                <span>
                  <span class="font-medium">{{ ingredient.amount }}</span>
                  {{ ingredient.item }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Modo de preparo -->
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                />
              </svg>
              Modo de Preparo
            </h3>
            <ol class="space-y-4">
              <li
                v-for="(step, index) in recipe.instructions"
                :key="index"
                class="flex gap-4"
              >
                <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-semibold text-sm">
                  {{ index + 1 }}
                </span>
                <p class="flex-1 text-foreground pt-1">{{ step }}</p>
              </li>
            </ol>
          </div>

          <!-- Informações nutricionais -->
          <div
            v-if="recipe.nutritional_info"
            class="p-4 bg-muted rounded-lg"
          >
            <h3 class="text-lg font-semibold text-foreground mb-3">Informações Nutricionais (por porção)</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-if="recipe.nutritional_info.protein"
                class="text-center"
              >
                <div class="text-2xl font-bold text-primary">{{ recipe.nutritional_info.protein }}g</div>
                <div class="text-xs text-muted-foreground">Proteínas</div>
              </div>
              <div
                v-if="recipe.nutritional_info.carbs"
                class="text-center"
              >
                <div class="text-2xl font-bold text-primary">{{ recipe.nutritional_info.carbs }}g</div>
                <div class="text-xs text-muted-foreground">Carboidratos</div>
              </div>
              <div
                v-if="recipe.nutritional_info.fats"
                class="text-center"
              >
                <div class="text-2xl font-bold text-primary">{{ recipe.nutritional_info.fats }}g</div>
                <div class="text-xs text-muted-foreground">Gorduras</div>
              </div>
              <div
                v-if="recipe.nutritional_info.fiber"
                class="text-center"
              >
                <div class="text-2xl font-bold text-primary">{{ recipe.nutritional_info.fiber }}g</div>
                <div class="text-xs text-muted-foreground">Fibras</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
