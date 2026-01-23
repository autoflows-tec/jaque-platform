<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { BellIcon, Bars3Icon } from '@heroicons/vue/24/outline'

const user = useSupabaseUser()

interface Emits {
  (e: 'toggle-mobile-menu'): void
}

const emit = defineEmits<Emits>()

const handleToggleMobileMenu = () => {
  emit('toggle-mobile-menu')
}
</script>

<template>
  <header class="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
    <!-- Mobile: Botão hamburguer + Logo -->
    <div class="flex items-center gap-3">
      <!-- Botão hamburguer - visível apenas em mobile -->
      <button
        type="button"
        class="lg:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
        @click="handleToggleMobileMenu"
      >
        <span class="sr-only">Abrir menu</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </button>

      <!-- Logo mobile/título -->
      <div>
        <h2 class="text-base md:text-lg font-semibold text-foreground">Bem-vinda!</h2>
        <p v-if="user" class="hidden sm:block text-xs text-muted-foreground">
          {{ user.user_metadata?.name || user.email }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 md:gap-4">
      <!-- Notificações -->
      <button class="p-2 hover:bg-muted rounded-md transition-colors relative">
        <BellIcon class="w-5 h-5 md:w-6 md:h-6 text-foreground" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
      </button>

      <!-- Avatar -->
      <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs md:text-sm">
        {{ user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U' }}
      </div>
    </div>
  </header>
</template>
