<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import {
  HomeIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import type { FunctionalComponent } from 'vue'

const { logout } = useAuth()

interface MenuItem {
  name: string
  path: string
  icon: FunctionalComponent
}

const menuItems: MenuItem[] = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Aulas', path: '/aulas', icon: AcademicCapIcon },
  { name: 'Quiz', path: '/quiz', icon: QuestionMarkCircleIcon },
  { name: '21 Dias', path: '/21-dias', icon: CalendarDaysIcon },
  { name: 'Comunidade', path: '/comunidade', icon: UserGroupIcon },
  { name: 'Receitas', path: '/receitas', icon: ClipboardDocumentListIcon },
  { name: 'Lista de Compras', path: '/lista-compras', icon: ShoppingCartIcon },
  { name: 'Marcas', path: '/marcas', icon: StarIcon },
  { name: 'Suporte', path: '/suporte', icon: ChatBubbleLeftRightIcon },
  { name: 'Perfil', path: '/perfil', icon: UserCircleIcon }
]

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <aside class="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
    <!-- Logo -->
    <div class="p-6 border-b border-border">
      <h1 class="text-xl font-bold text-foreground">GDAA</h1>
      <p class="text-xs text-muted-foreground">Guia Definitivo da AA</p>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto py-4">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-muted transition-colors"
        active-class="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.name }}</span>
      </NuxtLink>
    </nav>

    <!-- Logout Button -->
    <div class="p-4 border-t border-border">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
        <span>Sair</span>
      </button>
    </div>
  </aside>
</template>
