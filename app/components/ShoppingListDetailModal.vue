<script setup lang="ts">
import { XMarkIcon, HeartIcon, ShoppingBagIcon, TagIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import type { ShoppingListWithFavorite, ShoppingListItem } from '../../shared/types/ShoppingList'
import { ShoppingListCategoryLabels, ShoppingItemCategoryLabels, ShoppingItemCategory } from '../../shared/types/ShoppingList'

interface Props {
  shoppingList: ShoppingListWithFavorite | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'favorite'): void
  (e: 'unfavorite'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Agrupar itens por categoria
const itemsByCategory = computed(() => {
  if (!props.shoppingList?.items) return {}

  const grouped: Record<ShoppingItemCategory, ShoppingListItem[]> = {
    [ShoppingItemCategory.FRUITS]: [],
    [ShoppingItemCategory.VEGETABLES]: [],
    [ShoppingItemCategory.PROTEINS]: [],
    [ShoppingItemCategory.GRAINS]: [],
    [ShoppingItemCategory.DAIRY]: [],
    [ShoppingItemCategory.OTHERS]: []
  }

  props.shoppingList.items.forEach(item => {
    grouped[item.category].push(item)
  })

  return grouped
})

// Categorias que possuem itens
const categoriesWithItems = computed(() => {
  return Object.entries(itemsByCategory.value)
    .filter(([_, items]) => items.length > 0)
    .map(([category, _]) => category as ShoppingItemCategory)
})

// Handler para favoritar
const handleFavoriteClick = () => {
  if (props.shoppingList?.user_has_favorited) {
    emit('unfavorite')
  } else {
    emit('favorite')
  }
}

// Fechar modal ao pressionar ESC
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && shoppingList"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="emit('close')"
    >
      <div class="bg-card rounded-lg shadow-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-foreground">
              {{ shoppingList.title }}
            </h2>
            <div class="flex items-center gap-4 mt-2">
              <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {{ ShoppingListCategoryLabels[shoppingList.category] }}
              </span>
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <ShoppingBagIcon class="w-4 h-4" />
                <span>{{ shoppingList.items.length }} {{ shoppingList.items.length === 1 ? 'item' : 'itens' }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Botão favoritar -->
            <button
              class="p-2 rounded-lg hover:bg-muted transition-colors"
              @click="handleFavoriteClick"
            >
              <HeartIconSolid
                v-if="shoppingList.user_has_favorited"
                class="w-6 h-6 text-red-500"
              />
              <HeartIcon
                v-else
                class="w-6 h-6 text-foreground"
              />
            </button>

            <!-- Botão fechar -->
            <button
              class="p-2 rounded-lg hover:bg-muted transition-colors"
              @click="emit('close')"
            >
              <XMarkIcon class="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>

        <!-- Conteúdo -->
        <div class="p-6 space-y-6">
          <!-- Imagem -->
          <div
            v-if="shoppingList.image_url"
            class="w-full h-64 rounded-lg overflow-hidden"
          >
            <img
              :src="shoppingList.image_url"
              :alt="shoppingList.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Descrição -->
          <div v-if="shoppingList.description">
            <p class="text-muted-foreground">
              {{ shoppingList.description }}
            </p>
          </div>

          <!-- Tags -->
          <div
            v-if="shoppingList.tags && shoppingList.tags.length > 0"
            class="flex items-center gap-2 flex-wrap"
          >
            <TagIcon class="w-4 h-4 text-muted-foreground" />
            <div class="flex gap-2 flex-wrap">
              <span
                v-for="tag in shoppingList.tags"
                :key="tag"
                class="px-3 py-1 rounded-md text-sm bg-muted text-muted-foreground"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Lista de Itens por Categoria -->
          <div class="space-y-6">
            <h3 class="text-xl font-semibold text-foreground">
              Lista de Compras
            </h3>

            <div
              v-for="category in categoriesWithItems"
              :key="category"
              class="space-y-3"
            >
              <!-- Título da categoria -->
              <h4 class="text-lg font-medium text-foreground flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary"></div>
                {{ ShoppingItemCategoryLabels[category] }}
              </h4>

              <!-- Itens da categoria -->
              <div class="pl-4 space-y-2">
                <div
                  v-for="(item, index) in itemsByCategory[category]"
                  :key="index"
                  class="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <!-- Checkbox decorativo -->
                  <div class="mt-0.5">
                    <div class="w-5 h-5 rounded border-2 border-muted-foreground/30"></div>
                  </div>

                  <!-- Item e quantidade -->
                  <div class="flex-1">
                    <p class="text-foreground font-medium">
                      {{ item.item }}
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {{ item.quantity }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações adicionais -->
          <div class="pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <div class="flex items-center gap-1">
              <HeartIcon class="w-4 h-4" />
              <span>{{ shoppingList.favorites_count }} {{ shoppingList.favorites_count === 1 ? 'pessoa favoritou' : 'pessoas favoritaram' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
