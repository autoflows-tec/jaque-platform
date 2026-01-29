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
  SparklesIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
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
  // { name: '21 Dias', path: '/21-dias', icon: CalendarDaysIcon }, // Temporariamente oculto
  { name: 'Comunidade', path: '/comunidade', icon: UserGroupIcon },
  { name: 'Receitas', path: '/receitas', icon: ClipboardDocumentListIcon },
  { name: 'Lista de Compras', path: '/lista-compras', icon: ShoppingCartIcon },
  { name: 'Marcas', path: '/marcas', icon: StarIcon },
  { name: 'Chat IA', path: '/chat-receitas', icon: SparklesIcon },
  { name: 'Suporte', path: '/suporte', icon: ChatBubbleLeftRightIcon },
  { name: 'Perfil', path: '/perfil', icon: UserCircleIcon }
]

// Props para controlar abertura do mobile menu
interface Props {
  mobileMenuOpen: boolean
}

interface Emits {
  (e: 'close-mobile-menu'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleLogout = async () => {
  await logout()
}

// Fechar mobile menu ao navegar
const closeMobileMenu = () => {
  emit('close-mobile-menu')
}
</script>

<template>
  <!-- Sidebar Desktop - visível apenas em lg+ -->
  <aside class="hidden lg:flex w-64 h-screen bg-card border-r border-border flex-col fixed left-0 top-0 z-40">
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

  <!-- Sidebar Mobile - Dialog drawer -->
  <TransitionRoot as="template" :show="mobileMenuOpen">
    <Dialog as="div" class="relative z-50 lg:hidden" @close="closeMobileMenu">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Panel -->
      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
            <!-- Sidebar Content -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border">
              <!-- Header com botão fechar -->
              <div class="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h1 class="text-xl font-bold text-foreground">GDAA</h1>
                  <p class="text-xs text-muted-foreground">Guia Definitivo da AA</p>
                </div>
                <button
                  type="button"
                  class="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                  @click="closeMobileMenu"
                >
                  <span class="sr-only">Fechar menu</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <!-- Menu Items -->
              <nav class="flex-1 px-3">
                <NuxtLink
                  v-for="item in menuItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted rounded-md transition-colors mb-1"
                  active-class="bg-primary text-primary-foreground hover:bg-primary/90"
                  @click="closeMobileMenu"
                >
                  <component :is="item.icon" class="w-5 h-5" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </nav>

              <!-- Logout Button -->
              <div class="p-4 border-t border-border">
                <button
                  @click="handleLogout(); closeMobileMenu()"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon class="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
