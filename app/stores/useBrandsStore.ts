import { defineStore } from 'pinia'
import type {
  BrandWithFavorite,
  BrandCreateInput,
  BrandUpdateInput,
  BrandFilters
} from '../../shared/types/Brand'

export const useBrandsStore = defineStore('brands', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const brands = ref<BrandWithFavorite[]>([])
  const currentBrand = ref<BrandWithFavorite | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtros ativos
  const activeFilters = ref<BrandFilters>({
    category: null,
    tags: null,
    featured_only: false,
    favorites_only: false,
    search: null
  })

  // Buscar marcas (com filtros opcionais)
  const fetchBrands = async (filters?: BrandFilters) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      // Aplicar filtros se fornecidos
      if (filters) {
        activeFilters.value = { ...activeFilters.value, ...filters }
      }

      // Query base
      let query = supabase
        .from('brands')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('name', { ascending: true })

      // Aplicar filtros
      if (activeFilters.value.category) {
        query = query.eq('category', activeFilters.value.category)
      }

      if (activeFilters.value.featured_only) {
        query = query.eq('is_featured', true)
      }

      if (activeFilters.value.tags && activeFilters.value.tags.length > 0) {
        query = query.contains('tags', activeFilters.value.tags)
      }

      if (activeFilters.value.search) {
        query = query.ilike('name', `%${activeFilters.value.search}%`)
      }

      const { data: brandsData, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Se filtro de favoritos está ativo, buscar apenas marcas favoritadas
      let filteredBrands = brandsData || []

      if (activeFilters.value.favorites_only && userId) {
        const { data: favoritesData } = await supabase
          .from('brand_favorites')
          .select('brand_id')
          .eq('user_id', userId)

        const favoriteIds = (favoritesData || []).map(f => f.brand_id)
        filteredBrands = filteredBrands.filter(b => favoriteIds.includes(b.id))
      }

      // Para cada marca, verificar se o usuário atual favoritou
      const brandsWithFavoriteStatus = await Promise.all(
        filteredBrands.map(async (brand) => {
          let userHasFavorited = false

          if (userId) {
            const { data } = await supabase
              .from('brand_favorites')
              .select('id')
              .eq('brand_id', brand.id)
              .eq('user_id', userId)
              .single()

            userHasFavorited = !!data
          }

          return {
            ...brand,
            user_has_favorited: userHasFavorited
          }
        })
      )

      brands.value = brandsWithFavoriteStatus

      return { success: true, data: brandsWithFavoriteStatus }
    } catch (err: any) {
      console.error('Erro ao buscar marcas:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Buscar marca por ID
  const fetchBrandById = async (brandId: number) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      const { data: brandData, error: fetchError } = await supabase
        .from('brands')
        .select('*')
        .eq('id', brandId)
        .single()

      if (fetchError) throw fetchError

      // Verificar se o usuário favoritou
      let userHasFavorited = false

      if (userId) {
        const { data } = await supabase
          .from('brand_favorites')
          .select('id')
          .eq('brand_id', brandId)
          .eq('user_id', userId)
          .single()

        userHasFavorited = !!data
      }

      const brandWithFavorite = {
        ...brandData,
        user_has_favorited: userHasFavorited
      }

      currentBrand.value = brandWithFavorite

      return { success: true, data: brandWithFavorite }
    } catch (err: any) {
      console.error('Erro ao buscar marca:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Favoritar marca
  const favoriteBrand = async (brandId: number) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const userId = user.value.id || user.value.sub

      const { error: insertError } = await supabase
        .from('brand_favorites')
        .insert({
          brand_id: brandId,
          user_id: userId
        })

      if (insertError) throw insertError

      // Atualizar estado local
      const brand = brands.value.find(b => b.id === brandId)
      if (brand) {
        brand.user_has_favorited = true
        brand.favorites_count++
      }

      if (currentBrand.value?.id === brandId) {
        currentBrand.value.user_has_favorited = true
        currentBrand.value.favorites_count++
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao favoritar marca:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Desfavoritar marca
  const unfavoriteBrand = async (brandId: number) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const userId = user.value.id || user.value.sub

      const { error: deleteError } = await supabase
        .from('brand_favorites')
        .delete()
        .eq('brand_id', brandId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      // Atualizar estado local
      const brand = brands.value.find(b => b.id === brandId)
      if (brand) {
        brand.user_has_favorited = false
        brand.favorites_count = Math.max(0, brand.favorites_count - 1)
      }

      if (currentBrand.value?.id === brandId) {
        currentBrand.value.user_has_favorited = false
        currentBrand.value.favorites_count = Math.max(0, currentBrand.value.favorites_count - 1)
      }

      // Se filtro de favoritos está ativo, remover da lista
      if (activeFilters.value.favorites_only) {
        brands.value = brands.value.filter(b => b.id !== brandId)
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao desfavoritar marca:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Criar marca (apenas admin)
  const createBrand = async (input: BrandCreateInput) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const userId = user.value.id || user.value.sub

      const brandInput = {
        ...input,
        created_by: userId
      }

      const { data, error: insertError } = await supabase
        .from('brands')
        .insert(brandInput)
        .select('*')
        .single()

      if (insertError) throw insertError

      // Adicionar à lista se publicada
      if (data.is_published) {
        brands.value = [{ ...data, user_has_favorited: false }, ...brands.value]
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao criar marca:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Atualizar marca (apenas admin)
  const updateBrand = async (brandId: number, input: BrandUpdateInput) => {
    try {
      const { data, error: updateError } = await supabase
        .from('brands')
        .update(input)
        .eq('id', brandId)
        .select('*')
        .single()

      if (updateError) throw updateError

      // Atualizar na lista local
      const index = brands.value.findIndex(b => b.id === brandId)
      if (index !== -1) {
        brands.value[index] = {
          ...brands.value[index],
          ...data
        }
      }

      // Atualizar currentBrand se for a mesma
      if (currentBrand.value?.id === brandId) {
        currentBrand.value = {
          ...currentBrand.value,
          ...data
        }
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao atualizar marca:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Deletar marca (apenas admin)
  const deleteBrand = async (brandId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId)

      if (deleteError) throw deleteError

      // Remover da lista local
      brands.value = brands.value.filter(b => b.id !== brandId)

      // Limpar currentBrand se for a mesma
      if (currentBrand.value?.id === brandId) {
        currentBrand.value = null
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar marca:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Limpar filtros
  const clearFilters = () => {
    activeFilters.value = {
      category: null,
      tags: null,
      featured_only: false,
      favorites_only: false,
      search: null
    }
  }

  return {
    brands,
    currentBrand,
    loading,
    error,
    activeFilters,
    fetchBrands,
    fetchBrandById,
    favoriteBrand,
    unfavoriteBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    clearFilters
  }
})
