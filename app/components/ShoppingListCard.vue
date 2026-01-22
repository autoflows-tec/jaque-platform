<script setup lang="ts">
import { HeartIcon, ShoppingBagIcon, TagIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import type { ShoppingListWithFavorite } from '../../shared/types/ShoppingList'
import { ShoppingListCategoryLabels } from '../../shared/types/ShoppingList'

interface Props {
  shoppingList: ShoppingListWithFavorite
}

interface Emits {
  (e: 'click'): void
  (e: 'favorite'): void
  (e: 'unfavorite'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Contar total de itens
const totalItems = computed(() => {
  return props.shoppingList.items?.length || 0
})

// Truncar descrição
const truncatedDescription = computed(() => {
  if (!props.shoppingList.description) return ''
  return props.shoppingList.description.length > 100
    ? props.shoppingList.description.substring(0, 100) + '...'
    : props.shoppingList.description
})

// Handler para favoritar
const handleFavoriteClick = (event: Event) => {
  event.stopPropagation()
  if (props.shoppingList.user_has_favorited) {
    emit('unfavorite')
  } else {
    emit('favorite')
  }
}
</script>

<template>
  <div
    id="shopping-list-card"
    class="shopping-list-card bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    @click="emit('click')"
  >
    <!-- Imagem -->
    <div class="relative h-48 bg-muted overflow-hidden">
      <img
        v-if="shoppingList.image_url"
        :src="shoppingList.image_url"
        :alt="shoppingList.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10"
      >
        <ShoppingBagIcon class="w-20 h-20 text-primary/40" />
      </div>

      <!-- Badge de categoria -->
      <div class="absolute top-2 left-2">
        <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
          {{ ShoppingListCategoryLabels[shoppingList.category] }}
        </span>
      </div>

      <!-- Botão de favoritar -->
      <button
        class="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        @click="handleFavoriteClick"
      >
        <HeartIconSolid
          v-if="shoppingList.user_has_favorited"
          class="w-5 h-5 text-red-500"
        />
        <HeartIcon
          v-else
          class="w-5 h-5 text-foreground"
        />
      </button>
    </div>

    <!-- Conteúdo -->
    <div class="p-4 space-y-3">
      <!-- Título -->
      <h3 class="text-lg font-semibold text-foreground line-clamp-1">
        {{ shoppingList.title }}
      </h3>

      <!-- Descrição -->
      <p
        v-if="truncatedDescription"
        class="text-sm text-muted-foreground line-clamp-2"
      >
        {{ truncatedDescription }}
      </p>

      <!-- Informações -->
      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <!-- Total de itens -->
        <div class="flex items-center gap-1">
          <ShoppingBagIcon class="w-4 h-4" />
          <span>{{ totalItems }} {{ totalItems === 1 ? 'item' : 'itens' }}</span>
        </div>

        <!-- Favoritos -->
        <div class="flex items-center gap-1">
          <HeartIcon class="w-4 h-4" />
          <span>{{ shoppingList.favorites_count }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div
        v-if="shoppingList.tags && shoppingList.tags.length > 0"
        class="flex items-center gap-2 flex-wrap"
      >
        <TagIcon class="w-4 h-4 text-muted-foreground" />
        <div class="flex gap-2 flex-wrap">
          <span
            v-for="tag in shoppingList.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
          >
            {{ tag }}
          </span>
          <span
            v-if="shoppingList.tags.length > 3"
            class="px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
          >
            +{{ shoppingList.tags.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
