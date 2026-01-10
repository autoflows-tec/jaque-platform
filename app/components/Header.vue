<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { BellIcon } from '@heroicons/vue/24/outline'

const user = useSupabaseUser()
</script>

<template>
  <header class="h-16 bg-card border-b border-border flex items-center justify-between px-6">
    <div>
      <h2 class="text-lg font-semibold text-foreground">Bem-vinda!</h2>
      <p v-if="user" class="text-xs text-muted-foreground">{{ user.user_metadata?.name || user.email }}</p>
    </div>

    <div class="flex items-center gap-4">
      <!-- Notificações -->
      <button class="p-2 hover:bg-muted rounded-md transition-colors relative">
        <BellIcon class="w-6 h-6 text-foreground" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
      </button>

      <!-- Avatar -->
      <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
        {{ user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U' }}
      </div>
    </div>
  </header>
</template>
