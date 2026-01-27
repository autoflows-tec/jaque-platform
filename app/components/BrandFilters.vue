<script setup lang="ts">
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, StarIcon } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/BaseButton.vue'
import { BrandCategory, BrandCategoryLabels } from '../../shared/types/Brand'
import type { BrandFilters } from '../../shared/types/Brand'

interface Emits {
  (e: 'apply', filters: BrandFilters): void
  (e: 'clear'): void
}

const emit = defineEmits<Emits>()

// Estado dos filtros
const showFilters = ref(false)
const filters = ref<BrandFilters>({
  category: null,
  tags: null,
  featured_only: false,
  favorites_only: false,
  search: null
})

// Opções de categoria
const categoryOptions = [
  { value: null, label: 'Todas as categorias' },
  { value: BrandCategory.ALIMENTOS, label: BrandCategoryLabels[BrandCategory.ALIMENTOS] },
  { value: BrandCategory.SUPLEMENTOS, label: BrandCategoryLabels[BrandCategory.SUPLEMENTOS] },
  { value: BrandCategory.UTENSILIOS, label: BrandCategoryLabels[BrandCategory.UTENSILIOS] },
  { value: BrandCategory.LIVROS, label: BrandCategoryLabels[BrandCategory.LIVROS] },
  { value: BrandCategory.OUTROS, label: BrandCategoryLabels[BrandCategory.OUTROS] }
]

// Aplicar filtros
const handleApply = () => {
  emit('apply', filters.value)
  showFilters.value = false
}

// Limpar filtros
const handleClear = () => {
  filters.value = {
    category: null,
    tags: null,
    featured_only: false,
    favorites_only: false,
    search: null
  }
  emit('clear')
  showFilters.value = false
}

// Verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return (
    filters.value.category !== null ||
    filters.value.featured_only ||
    filters.value.favorites_only ||
    (filters.value.search && filters.value.search.trim() !== '')
  )
})

// Toggle filtros avançados
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}
</script>

<template>
  <div id="brand-filters" class="brand-filters space-y-4">
    <!-- Barra de busca e toggle de filtros -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Campo de busca -->
      <div class="flex-1 relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar marcas..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm"
          @keyup.enter="handleApply"
        />
      </div>

      <!-- Botão de filtros -->
      <button
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium"
        :class="hasActiveFilters
          ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
          : 'border-border bg-background text-foreground hover:bg-muted'"
        @click="toggleFilters"
      >
        <FunnelIcon class="w-5 h-5" />
        <span class="hidden sm:inline">Filtros</span>
        <span
          v-if="hasActiveFilters"
          class="w-2 h-2 rounded-full bg-primary"
        ></span>
      </button>

      <!-- Botão aplicar (mobile) -->
      <BaseButton
        variant="accent"
        class="sm:hidden"
        @click="handleApply"
      >
        Buscar
      </BaseButton>
    </div>

    <!-- Painel de filtros avançados -->
    <div
      v-if="showFilters"
      class="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4"
    >
      <!-- Categoria -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Categoria
        </label>
        <select
          v-model="filters.category"
          class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm"
        >
          <option
            v-for="option in categoryOptions"
            :key="option.value || 'all'"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Checkboxes -->
      <div class="space-y-3">
        <!-- Apenas em destaque -->
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="filters.featured_only"
            type="checkbox"
            class="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <StarIcon class="w-4 h-4 text-primary" />
            <span>Apenas marcas em destaque</span>
          </div>
        </label>

        <!-- Apenas favoritas -->
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="filters.favorites_only"
            type="checkbox"
            class="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4 text-destructive"
            >
              <path
                d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
              />
            </svg>
            <span>Apenas minhas favoritas</span>
          </div>
        </label>
      </div>

      <!-- Ações -->
      <div class="flex items-center gap-3 pt-4 border-t border-border">
        <BaseButton
          variant="ghost"
          class="flex-1"
          @click="handleClear"
        >
          <XMarkIcon class="w-5 h-5 mr-2" />
          Limpar
        </BaseButton>
        <BaseButton
          variant="accent"
          class="flex-1"
          @click="handleApply"
        >
          <FunnelIcon class="w-5 h-5 mr-2" />
          Aplicar
        </BaseButton>
      </div>
    </div>
  </div>
</template>
