<script setup lang="ts">
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import RecipeCard from '~/components/RecipeCard.vue'
import RecipeTabs from '~/components/RecipeTabs.vue'
import RecipeFilters from '~/components/RecipeFilters.vue'
import RecipeDetailModal from '~/components/RecipeDetailModal.vue'
import AdminRecipeForm from '~/components/AdminRecipeForm.vue'
import { useRecipesStore } from '~/stores/useRecipesStore'
import { useUserStore } from '~/stores/useUserStore'
import type { RecipeFilters as RecipeFiltersType, RecipeWithFavorite } from '../../shared/types/Recipe'

definePageMeta({
  layout: 'main-layout'
})

const recipesStore = useRecipesStore()
const userStore = useUserStore()
const user = useSupabaseUser()

const selectedRecipe = ref<RecipeWithFavorite | null>(null)
const showDetailModal = ref(false)
const showAdminForm = ref(false)
const recipeToEdit = ref<RecipeWithFavorite | null>(null)
const activeTab = ref<'jaque' | 'user'>('jaque')

// Verificar se é admin
const isAdmin = computed(() => userStore.profile?.role === 'admin')

// ID do usuário
const userId = computed(() => user.value?.id || user.value?.sub)

// Tabs configuration
const tabs = [
  { id: 'jaque', label: 'Receitas da Jaque' },
  { id: 'user', label: 'Minhas Receitas' }
]

// Contadores de receitas por aba
const recipeCounts = computed(() => ({
  jaque: recipesStore.jaqueRecipes.length,
  user: recipesStore.userRecipes.length
}))

// Receitas da aba ativa
const currentRecipes = computed(() => {
  return activeTab.value === 'jaque'
    ? recipesStore.jaqueRecipes
    : recipesStore.userRecipes
})

// Mostrar botão de criar receita
const showCreateButton = computed(() => {
  // Na aba "Minhas Receitas" ou sempre para admin
  return activeTab.value === 'user' || isAdmin.value
})

// Carregar receitas ao montar
onMounted(async () => {
  await Promise.all([
    recipesStore.fetchJaqueRecipes(),
    recipesStore.fetchUserRecipes()
  ])
})

// Trocar aba
const handleTabChange = async (tabId: string) => {
  activeTab.value = tabId as 'jaque' | 'user'
  recipesStore.clearFilters()
}

// Aplicar filtros
const handleApplyFilters = async (filters: RecipeFiltersType) => {
  if (activeTab.value === 'jaque') {
    await recipesStore.fetchJaqueRecipes(filters)
  } else {
    await recipesStore.fetchUserRecipes(filters)
  }
}

// Limpar filtros
const handleClearFilters = async () => {
  recipesStore.clearFilters()
  if (activeTab.value === 'jaque') {
    await recipesStore.fetchJaqueRecipes()
  } else {
    await recipesStore.fetchUserRecipes()
  }
}

// Abrir detalhes da receita
const handleOpenRecipe = async (recipe: RecipeWithFavorite) => {
  selectedRecipe.value = recipe
  showDetailModal.value = true
}

// Favoritar receita
const handleFavoriteRecipe = async (recipeId: number) => {
  await recipesStore.favoriteRecipe(recipeId)
}

// Desfavoritar receita
const handleUnfavoriteRecipe = async (recipeId: number) => {
  await recipesStore.unfavoriteRecipe(recipeId)
}

// Abrir formulário para nova receita
const handleCreateRecipe = () => {
  recipeToEdit.value = null
  showAdminForm.value = true
}

// Abrir formulário para editar receita
const handleEditRecipe = (recipe: RecipeWithFavorite) => {
  recipeToEdit.value = recipe
  showAdminForm.value = true
}

// Deletar receita
const handleDeleteRecipe = async (recipeId: number) => {
  if (confirm('Tem certeza que deseja deletar esta receita?')) {
    const result = await recipesStore.deleteRecipe(recipeId)
    if (result.success) {
      alert('Receita deletada com sucesso!')
    } else {
      alert('Erro ao deletar receita.')
    }
  }
}

// Verificar se usuário pode editar receita
const canEditRecipe = (recipe: RecipeWithFavorite) => {
  if (isAdmin.value) return true
  if (activeTab.value === 'user' && recipe.created_by === userId.value) return true
  return false
}

// Submeter formulário admin
const handleAdminFormSubmit = async (data: any) => {
  let result

  if (recipeToEdit.value) {
    // Atualizar receita existente
    result = await recipesStore.updateRecipe(recipeToEdit.value.id, data)
  } else {
    // Criar nova receita
    result = await recipesStore.createRecipe(data)
  }

  if (result.success) {
    showAdminForm.value = false
    recipeToEdit.value = null
    alert(recipeToEdit.value ? 'Receita atualizada com sucesso!' : 'Receita criada com sucesso!')
    // Recarregar ambas as abas
    await Promise.all([
      recipesStore.fetchJaqueRecipes(),
      recipesStore.fetchUserRecipes()
    ])
  } else {
    alert('Erro ao salvar receita.')
  }
}

// Fechar modal de detalhes
const handleCloseDetailModal = () => {
  showDetailModal.value = false
  selectedRecipe.value = null
}

// Fechar formulário admin
const handleCloseAdminForm = () => {
  showAdminForm.value = false
  recipeToEdit.value = null
}
</script>

<template>
  <div id="receitas-page" class="receitas-page">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-foreground mb-2">Receitas Saudáveis</h1>
        <p class="text-sm md:text-base text-muted-foreground">
          Descubra receitas deliciosas e nutritivas para sua jornada
        </p>
      </div>

      <!-- Botão para criar receita (condicional) -->
      <button
        v-if="showCreateButton"
        class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        @click="handleCreateRecipe"
      >
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">{{ isAdmin ? 'Nova Receita' : 'Minha Receita' }}</span>
        <span class="sm:hidden">Nova</span>
      </button>
    </div>

    <!-- Tabs -->
    <RecipeTabs
      :tabs="tabs"
      :active-tab="activeTab"
      :counts="recipeCounts"
      @change="handleTabChange"
    />

    <!-- Filtros -->
    <RecipeFilters
      @apply="handleApplyFilters"
      @clear="handleClearFilters"
    />

    <!-- Loading state -->
    <div
      v-if="recipesStore.loading && currentRecipes.length === 0"
      class="text-center py-12 mt-8"
    >
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="text-muted-foreground mt-4">Carregando receitas...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="recipesStore.error && currentRecipes.length === 0"
      class="text-center py-12 mt-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-destructive mx-auto mb-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p class="text-destructive font-medium">Erro ao carregar receitas</p>
      <p class="text-muted-foreground text-sm mt-2">{{ recipesStore.error }}</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="currentRecipes.length === 0"
      class="text-center py-12 mt-8 bg-card rounded-lg border border-border"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
        />
      </svg>
      <p class="text-muted-foreground font-medium">
        {{ activeTab === 'user' ? 'Você ainda não tem receitas' : 'Nenhuma receita encontrada' }}
      </p>
      <p class="text-sm text-muted-foreground mt-2">
        {{ activeTab === 'user' ? 'Clique em "Minha Receita" para criar sua primeira receita' : 'Tente ajustar os filtros ou volte mais tarde' }}
      </p>
    </div>

    <!-- Grid de receitas -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8"
    >
      <div
        v-for="recipe in currentRecipes"
        :key="recipe.id"
        class="relative"
      >
        <!-- Botões editar/deletar (baseado em permissão) -->
        <div
          v-if="canEditRecipe(recipe)"
          class="absolute top-2 right-2 z-10 flex gap-2"
        >
          <button
            class="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
            @click.stop="handleEditRecipe(recipe)"
          >
            <PencilIcon class="w-4 h-4 text-foreground" />
          </button>
          <button
            class="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-destructive/10 transition-colors"
            @click.stop="handleDeleteRecipe(recipe.id)"
          >
            <TrashIcon class="w-4 h-4 text-destructive" />
          </button>
        </div>

        <RecipeCard
          :recipe="recipe"
          @click="handleOpenRecipe(recipe)"
          @favorite="handleFavoriteRecipe(recipe.id)"
          @unfavorite="handleUnfavoriteRecipe(recipe.id)"
        />
      </div>
    </div>

    <!-- Modal de detalhes da receita -->
    <RecipeDetailModal
      v-if="selectedRecipe"
      :recipe="selectedRecipe"
      :show="showDetailModal"
      @close="handleCloseDetailModal"
      @favorite="handleFavoriteRecipe(selectedRecipe.id)"
      @unfavorite="handleUnfavoriteRecipe(selectedRecipe.id)"
    />

    <!-- Formulário admin -->
    <AdminRecipeForm
      :recipe="recipeToEdit"
      :is-open="showAdminForm"
      @close="handleCloseAdminForm"
      @submit="handleAdminFormSubmit"
    />
  </div>
</template>
