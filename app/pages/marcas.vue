<script setup lang="ts">
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BrandCard from '~/components/BrandCard.vue'
import BrandFilters from '~/components/BrandFilters.vue'
import BrandDetailModal from '~/components/BrandDetailModal.vue'
import AdminBrandForm from '~/components/AdminBrandForm.vue'
import { useBrandsStore } from '~/stores/useBrandsStore'
import { useUserStore } from '~/stores/useUserStore'
import type { BrandFilters as BrandFiltersType, BrandWithFavorite } from '../../shared/types/Brand'

definePageMeta({
  layout: 'main-layout'
})

const brandsStore = useBrandsStore()
const userStore = useUserStore()

const selectedBrand = ref<BrandWithFavorite | null>(null)
const showDetailModal = ref(false)
const showAdminForm = ref(false)
const brandToEdit = ref<BrandWithFavorite | null>(null)

// Verificar se é admin
const isAdmin = computed(() => userStore.profile?.role === 'admin')

// Carregar marcas ao montar
onMounted(async () => {
  await brandsStore.fetchBrands()
})

// Aplicar filtros
const handleApplyFilters = async (filters: BrandFiltersType) => {
  await brandsStore.fetchBrands(filters)
}

// Limpar filtros
const handleClearFilters = async () => {
  brandsStore.clearFilters()
  await brandsStore.fetchBrands()
}

// Abrir detalhes da marca
const handleOpenBrand = async (brand: BrandWithFavorite) => {
  selectedBrand.value = brand
  showDetailModal.value = true
}

// Favoritar marca
const handleFavoriteBrand = async (brandId: number) => {
  await brandsStore.favoriteBrand(brandId)
}

// Desfavoritar marca
const handleUnfavoriteBrand = async (brandId: number) => {
  await brandsStore.unfavoriteBrand(brandId)
}

// Abrir formulário para nova marca
const handleCreateBrand = () => {
  brandToEdit.value = null
  showAdminForm.value = true
}

// Abrir formulário para editar marca
const handleEditBrand = (brand: BrandWithFavorite) => {
  brandToEdit.value = brand
  showAdminForm.value = true
}

// Deletar marca
const handleDeleteBrand = async (brandId: number) => {
  if (confirm('Tem certeza que deseja deletar esta marca?')) {
    const result = await brandsStore.deleteBrand(brandId)
    if (result.success) {
      alert('Marca deletada com sucesso!')
    } else {
      alert('Erro ao deletar marca.')
    }
  }
}

// Submeter formulário admin
const handleAdminFormSubmit = async (data: any) => {
  let result

  if (brandToEdit.value) {
    // Atualizar marca existente
    result = await brandsStore.updateBrand(brandToEdit.value.id, data)
  } else {
    // Criar nova marca
    result = await brandsStore.createBrand(data)
  }

  if (result.success) {
    showAdminForm.value = false
    brandToEdit.value = null
    alert(brandToEdit.value ? 'Marca atualizada com sucesso!' : 'Marca criada com sucesso!')
    await brandsStore.fetchBrands()
  } else {
    alert('Erro ao salvar marca.')
  }
}

// Fechar modal de detalhes
const handleCloseDetailModal = () => {
  showDetailModal.value = false
  selectedBrand.value = null
}

// Fechar formulário admin
const handleCloseAdminForm = () => {
  showAdminForm.value = false
  brandToEdit.value = null
}

// Handler para favoritar do modal
const handleFavoriteFromModal = async () => {
  if (selectedBrand.value) {
    await handleFavoriteBrand(selectedBrand.value.id)
    // Atualizar o objeto do modal
    selectedBrand.value.user_has_favorited = true
    selectedBrand.value.favorites_count += 1
  }
}

// Handler para desfavoritar do modal
const handleUnfavoriteFromModal = async () => {
  if (selectedBrand.value) {
    await handleUnfavoriteBrand(selectedBrand.value.id)
    // Atualizar o objeto do modal
    selectedBrand.value.user_has_favorited = false
    selectedBrand.value.favorites_count = Math.max(0, selectedBrand.value.favorites_count - 1)
  }
}
</script>

<template>
  <div id="marcas-page" class="marcas-page">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-foreground mb-2">Marcas Recomendadas</h1>
        <p class="text-sm md:text-base text-muted-foreground">
          Descubra marcas de confiança para sua jornada de alimentação ancestral
        </p>
      </div>

      <!-- Botão admin para criar marca -->
      <button
        v-if="isAdmin"
        class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        @click="handleCreateBrand"
      >
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">Nova Marca</span>
        <span class="sm:hidden">Nova</span>
      </button>
    </div>

    <!-- Filtros -->
    <BrandFilters
      @apply="handleApplyFilters"
      @clear="handleClearFilters"
    />

    <!-- Loading state -->
    <div
      v-if="brandsStore.loading && brandsStore.brands.length === 0"
      class="text-center py-12 mt-8"
    >
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="text-muted-foreground mt-4">Carregando marcas...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="brandsStore.error && brandsStore.brands.length === 0"
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
      <p class="text-destructive font-medium">Erro ao carregar marcas</p>
      <p class="text-muted-foreground text-sm mt-2">{{ brandsStore.error }}</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="brandsStore.brands.length === 0"
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
          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 6h.008v.008H6V6z"
        />
      </svg>
      <p class="text-muted-foreground font-medium">Nenhuma marca encontrada</p>
      <p class="text-sm text-muted-foreground mt-2">
        Tente ajustar os filtros ou volte mais tarde
      </p>
    </div>

    <!-- Grid de marcas -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8"
    >
      <div
        v-for="brand in brandsStore.brands"
        :key="brand.id"
        class="relative"
      >
        <!-- Botões admin (editar/deletar) -->
        <div
          v-if="isAdmin"
          class="absolute top-2 left-2 z-10 flex gap-2"
        >
          <button
            class="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
            @click.stop="handleEditBrand(brand)"
          >
            <PencilIcon class="w-4 h-4 text-foreground" />
          </button>
          <button
            class="p-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-destructive/10 transition-colors"
            @click.stop="handleDeleteBrand(brand.id)"
          >
            <TrashIcon class="w-4 h-4 text-destructive" />
          </button>
        </div>

        <BrandCard
          :brand="brand"
          @click="handleOpenBrand(brand)"
          @favorite="handleFavoriteBrand(brand.id)"
          @unfavorite="handleUnfavoriteBrand(brand.id)"
        />
      </div>
    </div>

    <!-- Modal de detalhes da marca -->
    <BrandDetailModal
      :brand="selectedBrand"
      :show="showDetailModal"
      @close="handleCloseDetailModal"
      @favorite="handleFavoriteFromModal"
      @unfavorite="handleUnfavoriteFromModal"
    />

    <!-- Formulário admin -->
    <AdminBrandForm
      :brand="brandToEdit"
      :is-open="showAdminForm"
      @close="handleCloseAdminForm"
      @submit="handleAdminFormSubmit"
    />
  </div>
</template>
