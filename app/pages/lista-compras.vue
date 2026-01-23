<script setup lang="ts">
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ShoppingListCard from '~/components/ShoppingListCard.vue'
import ShoppingListFilters from '~/components/ShoppingListFilters.vue'
import ShoppingListDetailModal from '~/components/ShoppingListDetailModal.vue'
import AdminShoppingListForm from '~/components/AdminShoppingListForm.vue'
import { useShoppingListsStore } from '~/stores/useShoppingListsStore'
import { useUserStore } from '~/stores/useUserStore'
import type { ShoppingListFilters as ShoppingListFiltersType, ShoppingListWithFavorite } from '../../shared/types/ShoppingList'

definePageMeta({
  layout: 'main-layout'
})

const shoppingListsStore = useShoppingListsStore()
const userStore = useUserStore()

const selectedList = ref<ShoppingListWithFavorite | null>(null)
const showDetailModal = ref(false)
const showAdminForm = ref(false)
const listToEdit = ref<ShoppingListWithFavorite | null>(null)

// Verificar se é admin
const isAdmin = computed(() => userStore.profile?.role === 'admin')

// Carregar listas ao montar
onMounted(async () => {
  await shoppingListsStore.fetchShoppingLists()
})

// Aplicar filtros
const handleApplyFilters = async (filters: ShoppingListFiltersType) => {
  await shoppingListsStore.fetchShoppingLists(filters)
}

// Limpar filtros
const handleClearFilters = async () => {
  shoppingListsStore.clearFilters()
  await shoppingListsStore.fetchShoppingLists()
}

// Abrir detalhes da lista
const handleOpenList = async (list: ShoppingListWithFavorite) => {
  selectedList.value = list
  showDetailModal.value = true
}

// Favoritar lista
const handleFavoriteList = async (listId: number) => {
  await shoppingListsStore.favoriteShoppingList(listId)
}

// Desfavoritar lista
const handleUnfavoriteList = async (listId: number) => {
  await shoppingListsStore.unfavoriteShoppingList(listId)
}

// Abrir formulário para nova lista
const handleCreateList = () => {
  listToEdit.value = null
  showAdminForm.value = true
}

// Abrir formulário para editar lista
const handleEditList = (list: ShoppingListWithFavorite) => {
  listToEdit.value = list
  showAdminForm.value = true
}

// Deletar lista
const handleDeleteList = async (listId: number) => {
  if (confirm('Tem certeza que deseja deletar esta lista de compras?')) {
    const result = await shoppingListsStore.deleteShoppingList(listId)
    if (result.success) {
      alert('Lista deletada com sucesso!')
    } else {
      alert('Erro ao deletar lista.')
    }
  }
}

// Submeter formulário (criar ou editar)
const handleFormSubmit = async (data: any) => {
  let result

  if (listToEdit.value) {
    // Editar lista existente
    result = await shoppingListsStore.updateShoppingList(listToEdit.value.id, data)
  } else {
    // Criar nova lista
    result = await shoppingListsStore.createShoppingList(data)
  }

  if (result.success) {
    showAdminForm.value = false
    listToEdit.value = null
    await shoppingListsStore.fetchShoppingLists()
    alert(listToEdit.value ? 'Lista atualizada com sucesso!' : 'Lista criada com sucesso!')
  } else {
    alert(result.error || 'Erro ao salvar lista.')
  }
}

// Handler para favoritar do modal
const handleFavoriteFromModal = async () => {
  if (selectedList.value) {
    await handleFavoriteList(selectedList.value.id)
    // Atualizar o objeto do modal
    selectedList.value.user_has_favorited = true
    selectedList.value.favorites_count += 1
  }
}

// Handler para desfavoritar do modal
const handleUnfavoriteFromModal = async () => {
  if (selectedList.value) {
    await handleUnfavoriteList(selectedList.value.id)
    // Atualizar o objeto do modal
    selectedList.value.user_has_favorited = false
    selectedList.value.favorites_count = Math.max(0, selectedList.value.favorites_count - 1)
  }
}
</script>

<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-foreground">Lista de Compras</h1>
        <p class="text-sm md:text-base text-muted-foreground mt-1">
          Listas de compras organizadas para facilitar suas idas ao mercado
        </p>
      </div>

      <!-- Botão Admin: Nova Lista -->
      <button
        v-if="isAdmin"
        class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        @click="handleCreateList"
      >
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">Nova Lista</span>
        <span class="sm:hidden">Nova</span>
      </button>
    </div>

    <!-- Filtros -->
    <ShoppingListFilters
      @apply="handleApplyFilters"
      @clear="handleClearFilters"
    />

    <!-- Loading State -->
    <div
      v-if="shoppingListsStore.loading"
      class="flex items-center justify-center py-12"
    >
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="shoppingListsStore.shoppingLists.length === 0"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">Nenhuma lista de compras encontrada.</p>
      <button
        v-if="isAdmin"
        class="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        @click="handleCreateList"
      >
        Criar primeira lista
      </button>
    </div>

    <!-- Grid de Listas -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
    >
      <div
        v-for="list in shoppingListsStore.shoppingLists"
        :key="list.id"
        class="relative group"
      >
        <!-- Card da Lista -->
        <ShoppingListCard
          :shopping-list="list"
          @click="handleOpenList(list)"
          @favorite="handleFavoriteList(list.id)"
          @unfavorite="handleUnfavoriteList(list.id)"
        />

        <!-- Botões Admin (Editar e Deletar) -->
        <div
          v-if="isAdmin"
          class="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            class="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
            @click.stop="handleEditList(list)"
          >
            <PencilIcon class="w-4 h-4 text-foreground" />
          </button>
          <button
            class="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
            @click.stop="handleDeleteList(list.id)"
          >
            <TrashIcon class="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <ShoppingListDetailModal
      :shopping-list="selectedList"
      :is-open="showDetailModal"
      @close="showDetailModal = false"
      @favorite="handleFavoriteFromModal"
      @unfavorite="handleUnfavoriteFromModal"
    />

    <!-- Formulário Admin -->
    <AdminShoppingListForm
      :shopping-list="listToEdit"
      :is-open="showAdminForm"
      @close="showAdminForm = false; listToEdit = null"
      @submit="handleFormSubmit"
    />
  </div>
</template>
