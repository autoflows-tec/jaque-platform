<script setup lang="ts">
import {
  HeartIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  TagIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'
import type { BrandWithFavorite } from '../../shared/types/Brand'
import { BrandCategoryLabels } from '../../shared/types/Brand'

interface Props {
  brand: BrandWithFavorite | null
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'favorite'): void
  (e: 'unfavorite'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Handler para favoritar
const handleFavoriteClick = () => {
  if (props.brand?.user_has_favorited) {
    emit('unfavorite')
  } else {
    emit('favorite')
  }
}

// Array de estrelas para rating
const stars = computed(() => {
  const rating = props.brand?.rating || 0
  return Array.from({ length: 5 }, (_, i) => i < rating)
})

// Abrir link externo
const openExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show && brand"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="bg-card rounded-lg shadow-xl border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
          <h2 class="text-lg md:text-xl font-bold text-foreground">Detalhes da Marca</h2>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors"
            @click="emit('close')"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="p-4 md:p-6 space-y-6">
          <!-- Logo e informações principais -->
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Logo -->
            <div class="w-full md:w-48 h-48 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg flex items-center justify-center p-4 shrink-0">
              <img
                v-if="brand.logo_url"
                :src="brand.logo_url"
                :alt="brand.name"
                class="max-h-full max-w-full object-contain"
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
                  class="w-20 h-20 text-muted-foreground opacity-30"
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
            </div>

            <!-- Info principal -->
            <div class="flex-1 space-y-3">
              <!-- Nome e categoria -->
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <h3 class="text-2xl font-bold text-foreground">{{ brand.name }}</h3>
                  <button
                    class="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
                    @click="handleFavoriteClick"
                  >
                    <HeartIconSolid
                      v-if="brand.user_has_favorited"
                      class="w-6 h-6 text-destructive"
                    />
                    <HeartIcon
                      v-else
                      class="w-6 h-6 text-foreground"
                    />
                  </button>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span class="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {{ BrandCategoryLabels[brand.category] }}
                  </span>
                  <span
                    v-if="brand.is_featured"
                    class="inline-flex items-center gap-1 px-3 py-1 bg-primary/90 text-primary-foreground text-sm font-medium rounded-full"
                  >
                    <StarIconSolid class="w-3 h-3" />
                    Destaque
                  </span>
                </div>
              </div>

              <!-- Rating -->
              <div
                v-if="brand.rating && brand.rating > 0"
                class="flex items-center gap-1"
              >
                <StarIconSolid
                  v-for="(filled, index) in stars"
                  :key="index"
                  :class="filled ? 'text-yellow-500' : 'text-muted'"
                  class="w-5 h-5"
                />
                <span class="text-sm text-muted-foreground ml-2">{{ brand.rating }}/5</span>
              </div>

              <!-- Estatísticas -->
              <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <div class="flex items-center gap-1">
                  <HeartIcon class="w-4 h-4" />
                  <span>{{ brand.favorites_count }} {{ brand.favorites_count === 1 ? 'favorito' : 'favoritos' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Descrição -->
          <div
            v-if="brand.description"
            class="bg-muted/30 rounded-lg p-4"
          >
            <h4 class="text-sm font-semibold text-foreground mb-2">Sobre a Marca</h4>
            <p class="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {{ brand.description }}
            </p>
          </div>

          <!-- Tags -->
          <div
            v-if="brand.tags && brand.tags.length > 0"
            class="space-y-2"
          >
            <h4 class="text-sm font-semibold text-foreground flex items-center gap-2">
              <TagIcon class="w-4 h-4" />
              Tags
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in brand.tags"
                :key="tag"
                class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Links -->
          <div class="space-y-3 pt-4 border-t border-border">
            <h4 class="text-sm font-semibold text-foreground">Links</h4>

            <!-- Website -->
            <button
              v-if="brand.website_url"
              class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
              @click="openExternalLink(brand.website_url)"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-primary/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 text-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-foreground">Visitar Site Oficial</p>
                  <p class="text-xs text-muted-foreground truncate max-w-xs">{{ brand.website_url }}</p>
                </div>
              </div>
              <ArrowTopRightOnSquareIcon class="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <!-- Link de afiliado -->
            <button
              v-if="brand.affiliate_link"
              class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
              @click="openExternalLink(brand.affiliate_link)"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-primary/20 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 text-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-primary">Comprar com Desconto</p>
                  <p class="text-xs text-primary/70">Link exclusivo com benefícios</p>
                </div>
              </div>
              <ArrowTopRightOnSquareIcon class="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-card border-t border-border px-4 md:px-6 py-4">
          <button
            class="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium text-sm"
            @click="emit('close')"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
