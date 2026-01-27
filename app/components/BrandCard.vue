<script setup lang="ts">
import { HeartIcon, StarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'
import type { BrandWithFavorite } from '../../shared/types/Brand'
import { BrandCategoryLabels } from '../../shared/types/Brand'

interface Props {
  brand: BrandWithFavorite
}

interface Emits {
  (e: 'click'): void
  (e: 'favorite'): void
  (e: 'unfavorite'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Truncar descrição
const truncatedDescription = computed(() => {
  if (!props.brand.description) return ''
  return props.brand.description.length > 120
    ? props.brand.description.substring(0, 120) + '...'
    : props.brand.description
})

// Handler para favoritar
const handleFavoriteClick = (event: Event) => {
  event.stopPropagation()
  if (props.brand.user_has_favorited) {
    emit('unfavorite')
  } else {
    emit('favorite')
  }
}

// Array de estrelas para rating
const stars = computed(() => {
  const rating = props.brand.rating || 0
  return Array.from({ length: 5 }, (_, i) => i < rating)
})
</script>

<template>
  <div
    id="brand-card"
    class="brand-card bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    @click="emit('click')"
  >
    <!-- Logo/Header -->
    <div class="relative h-32 sm:h-40 bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center p-4">
      <img
        v-if="brand.logo_url"
        :src="brand.logo_url"
        :alt="brand.name"
        class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
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
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 6h.008v.008H6V6z"
          />
        </svg>
      </div>

      <!-- Badge de destaque -->
      <div
        v-if="brand.is_featured"
        class="absolute top-3 left-3"
      >
        <span class="px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
          <StarIconSolid class="w-3 h-3" />
          Destaque
        </span>
      </div>

      <!-- Botão de favoritar -->
      <button
        class="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        @click="handleFavoriteClick"
      >
        <HeartIconSolid
          v-if="brand.user_has_favorited"
          class="w-5 h-5 text-destructive"
        />
        <HeartIcon
          v-else
          class="w-5 h-5 text-foreground"
        />
      </button>
    </div>

    <!-- Conteúdo -->
    <div class="p-3 md:p-4">
      <!-- Título e categoria -->
      <div class="mb-2">
        <h3 class="text-base md:text-lg font-semibold text-foreground mb-1 line-clamp-1">
          {{ brand.name }}
        </h3>
        <span class="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
          {{ BrandCategoryLabels[brand.category] }}
        </span>
      </div>

      <!-- Rating -->
      <div
        v-if="brand.rating && brand.rating > 0"
        class="flex items-center gap-1 mb-3"
      >
        <StarIconSolid
          v-for="(filled, index) in stars"
          :key="index"
          :class="filled ? 'text-yellow-500' : 'text-muted'"
          class="w-4 h-4"
        />
        <span class="text-xs text-muted-foreground ml-1">{{ brand.rating }}/5</span>
      </div>

      <!-- Descrição -->
      <p
        v-if="brand.description"
        class="text-sm text-muted-foreground mb-4 line-clamp-3"
      >
        {{ truncatedDescription }}
      </p>

      <!-- Tags -->
      <div
        v-if="brand.tags && brand.tags.length > 0"
        class="flex flex-wrap gap-1 mb-3"
      >
        <span
          v-for="tag in brand.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
        >
          {{ tag }}
        </span>
        <span
          v-if="brand.tags.length > 3"
          class="px-2 py-0.5 text-muted-foreground text-xs"
        >
          +{{ brand.tags.length - 3 }}
        </span>
      </div>

      <!-- Footer com link e favoritos -->
      <div class="flex items-center justify-between pt-3 border-t border-border">
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <HeartIcon class="w-4 h-4" />
          <span>{{ brand.favorites_count }} {{ brand.favorites_count === 1 ? 'favorito' : 'favoritos' }}</span>
        </div>

        <!-- Link para site -->
        <div
          v-if="brand.website_url"
          class="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowTopRightOnSquareIcon class="w-4 h-4" />
          <span>Visitar</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
