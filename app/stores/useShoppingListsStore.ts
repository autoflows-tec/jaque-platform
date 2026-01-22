import { defineStore } from 'pinia'
import type {
  ShoppingListWithFavorite,
  ShoppingListCreateInput,
  ShoppingListUpdateInput,
  ShoppingListFilters,
  ShoppingListCategory
} from '../../shared/types/ShoppingList'

export const useShoppingListsStore = defineStore('shoppingLists', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const shoppingLists = ref<ShoppingListWithFavorite[]>([])
  const currentShoppingList = ref<ShoppingListWithFavorite | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtros ativos
  const activeFilters = ref<ShoppingListFilters>({
    category: null,
    tags: null,
    favorites_only: false
  })

  // Buscar listas (com filtros opcionais)
  const fetchShoppingLists = async (filters?: ShoppingListFilters) => {
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
        .from('shopping_lists')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (activeFilters.value.category) {
        query = query.eq('category', activeFilters.value.category)
      }

      if (activeFilters.value.tags && activeFilters.value.tags.length > 0) {
        query = query.contains('tags', activeFilters.value.tags)
      }

      const { data: listsData, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Se filtro de favoritos está ativo, buscar apenas listas favoritadas
      let filteredLists = listsData || []

      if (activeFilters.value.favorites_only && userId) {
        const { data: favoritesData } = await supabase
          .from('shopping_list_favorites')
          .select('shopping_list_id')
          .eq('user_id', userId)

        const favoriteIds = (favoritesData || []).map(f => f.shopping_list_id)
        filteredLists = filteredLists.filter(list => favoriteIds.includes(list.id))
      }

      // Para cada lista, verificar se o usuário atual favoritou
      const listsWithFavoriteStatus = await Promise.all(
        filteredLists.map(async (list) => {
          let userHasFavorited = false

          if (userId) {
            const { data } = await supabase
              .from('shopping_list_favorites')
              .select('id')
              .eq('shopping_list_id', list.id)
              .eq('user_id', userId)
              .single()

            userHasFavorited = !!data
          }

          return {
            ...list,
            user_has_favorited: userHasFavorited
          }
        })
      )

      shoppingLists.value = listsWithFavoriteStatus

      return { success: true, data: listsWithFavoriteStatus }
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar listas de compras'
      console.error('Erro ao buscar listas:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Buscar lista por ID
  const fetchShoppingListById = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      const { data: listData, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Verificar se usuário favoritou
      let userHasFavorited = false

      if (userId) {
        const { data } = await supabase
          .from('shopping_list_favorites')
          .select('id')
          .eq('shopping_list_id', id)
          .eq('user_id', userId)
          .single()

        userHasFavorited = !!data
      }

      currentShoppingList.value = {
        ...listData,
        user_has_favorited: userHasFavorited
      }

      return { success: true, data: currentShoppingList.value }
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar lista de compras'
      console.error('Erro ao buscar lista:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Criar nova lista (admin)
  const createShoppingList = async (input: ShoppingListCreateInput) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      const { data, error: createError } = await supabase
        .from('shopping_lists')
        .insert({
          ...input,
          created_by: userId
        })
        .select()
        .single()

      if (createError) throw createError

      return { success: true, data }
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar lista de compras'
      console.error('Erro ao criar lista:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Atualizar lista (admin)
  const updateShoppingList = async (id: number, input: ShoppingListUpdateInput) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('shopping_lists')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return { success: true, data }
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar lista de compras'
      console.error('Erro ao atualizar lista:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Deletar lista (admin)
  const deleteShoppingList = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Remover da lista local
      shoppingLists.value = shoppingLists.value.filter(list => list.id !== id)

      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar lista de compras'
      console.error('Erro ao deletar lista:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Favoritar lista
  const favoriteShoppingList = async (listId: number) => {
    try {
      const userId = user.value?.id || user.value?.sub

      if (!userId) {
        throw new Error('Usuário não autenticado')
      }

      const { error: favoriteError } = await supabase
        .from('shopping_list_favorites')
        .insert({
          shopping_list_id: listId,
          user_id: userId
        })

      if (favoriteError) throw favoriteError

      // Atualizar estado local
      const list = shoppingLists.value.find(l => l.id === listId)
      if (list) {
        list.user_has_favorited = true
        list.favorites_count += 1
      }

      if (currentShoppingList.value?.id === listId) {
        currentShoppingList.value.user_has_favorited = true
        currentShoppingList.value.favorites_count += 1
      }

      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Erro ao favoritar lista de compras'
      console.error('Erro ao favoritar lista:', err)
      return { success: false, error: error.value }
    }
  }

  // Desfavoritar lista
  const unfavoriteShoppingList = async (listId: number) => {
    try {
      const userId = user.value?.id || user.value?.sub

      if (!userId) {
        throw new Error('Usuário não autenticado')
      }

      const { error: unfavoriteError } = await supabase
        .from('shopping_list_favorites')
        .delete()
        .eq('shopping_list_id', listId)
        .eq('user_id', userId)

      if (unfavoriteError) throw unfavoriteError

      // Atualizar estado local
      const list = shoppingLists.value.find(l => l.id === listId)
      if (list) {
        list.user_has_favorited = false
        list.favorites_count = Math.max(0, list.favorites_count - 1)
      }

      if (currentShoppingList.value?.id === listId) {
        currentShoppingList.value.user_has_favorited = false
        currentShoppingList.value.favorites_count = Math.max(0, currentShoppingList.value.favorites_count - 1)
      }

      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Erro ao desfavoritar lista de compras'
      console.error('Erro ao desfavoritar lista:', err)
      return { success: false, error: error.value }
    }
  }

  // Limpar filtros
  const clearFilters = () => {
    activeFilters.value = {
      category: null,
      tags: null,
      favorites_only: false
    }
  }

  return {
    // State
    shoppingLists,
    currentShoppingList,
    loading,
    error,
    activeFilters,

    // Actions
    fetchShoppingLists,
    fetchShoppingListById,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    favoriteShoppingList,
    unfavoriteShoppingList,
    clearFilters
  }
})
