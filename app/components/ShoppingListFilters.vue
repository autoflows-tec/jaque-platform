<script setup lang="ts">
import { FunnelIcon, XMarkIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { ShoppingListCategory, ShoppingListCategoryLabels } from '../../shared/types/ShoppingList'
import type { ShoppingListFilters } from '../../shared/types/ShoppingList'

interface Emits {
  (e: 'apply', filters: ShoppingListFilters): void
  (e: 'clear'): void
}

const emit = defineEmits<Emits>()

const isExpanded = ref(false)

const selectedCategory = ref<ShoppingListCategory | null>(null)
const favoritesOnly = ref(false)

const categories = Object.values(ShoppingListCategory)

// Verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return selectedCategory.value !== null || favoritesOnly.value
})

// Aplicar filtros
const applyFilters = () => {
  const filters: ShoppingListFilters = {
    category: selectedCategory.value,
    favorites_only: favoritesOnly.value
  }

  emit('apply', filters)
  isExpanded.value = false
}

// Limpar filtros
const clearFilters = () => {
  selectedCategory.value = null
  favoritesOnly.value = false
  emit('clear')
}

// Toggle expansão
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="bg-card border border-border rounded-lg overflow-hidden">
    <!-- Header -->
    <button
      class="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-2">
        <FunnelIcon class="w-5 h-5 text-foreground" />
        <span class="font-medium text-foreground">Filtros</span>
        <span
          v-if="hasActiveFilters"
          class="px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground"
        >
          Ativos
        </span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5 text-muted-foreground transition-transform"
        :class="{ 'rotate-180': isExpanded }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </button>

    <!-- Filtros (Expandível) -->
    <div
      v-show="isExpanded"
      class="border-t border-border p-4 space-y-4"
    >
      <!-- Categoria -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Categoria
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            class="px-3 py-2 rounded-lg text-sm border transition-colors"
            :class="
              selectedCategory === category
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary'
            "
            @click="selectedCategory = selectedCategory === category ? null : category"
          >
            {{ ShoppingListCategoryLabels[category] }}
          </button>
        </div>
      </div>

      <!-- Apenas Favoritas -->
      <div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="favoritesOnly"
            type="checkbox"
            class="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <span class="text-sm text-foreground flex items-center gap-1">
            <HeartIcon class="w-4 h-4" />
            Apenas favoritas
          </span>
        </label>
      </div>

      <!-- Ações -->
      <div class="flex items-center gap-2 pt-2">
        <button
          class="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
          @click="applyFilters"
        >
          Aplicar Filtros
        </button>
        <button
          v-if="hasActiveFilters"
          class="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm flex items-center gap-1"
          @click="clearFilters"
        >
          <XMarkIcon class="w-4 h-4" />
          Limpar
        </button>
      </div>
    </div>
  </div>
</template>
