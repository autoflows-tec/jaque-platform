import { defineStore } from 'pinia'
import type {
  RecipeWithFavorite,
  RecipeCreateInput,
  RecipeUpdateInput,
  RecipeFilters,
  RecipeCategory,
  RecipeDifficulty
} from '../../shared/types/Recipe'

export const useRecipesStore = defineStore('recipes', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const recipes = ref<RecipeWithFavorite[]>([])
  const jaqueRecipes = ref<RecipeWithFavorite[]>([])
  const userRecipes = ref<RecipeWithFavorite[]>([])
  const currentRecipe = ref<RecipeWithFavorite | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtros ativos
  const activeFilters = ref<RecipeFilters>({
    search_query: null,
    category: null,
    difficulty: null,
    tags: null,
    max_prep_time: null,
    favorites_only: false
  })

  // Buscar receitas (com filtros opcionais)
  const fetchRecipes = async (filters?: RecipeFilters) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      // Aplicar filtros se fornecidos
      if (filters) {
        activeFilters.value = { ...activeFilters.value, ...filters }
      }

      // Query base - Busca receitas publicadas OU receitas do próprio usuário
      let query = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (activeFilters.value.category) {
        query = query.eq('category', activeFilters.value.category)
      }

      if (activeFilters.value.difficulty) {
        query = query.eq('difficulty', activeFilters.value.difficulty)
      }

      if (activeFilters.value.max_prep_time) {
        query = query.lte('prep_time_minutes', activeFilters.value.max_prep_time)
      }

      if (activeFilters.value.tags && activeFilters.value.tags.length > 0) {
        query = query.contains('tags', activeFilters.value.tags)
      }

      const { data: recipesData, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Se filtro de favoritos está ativo, buscar apenas receitas favoritadas
      let filteredRecipes = recipesData || []

      if (activeFilters.value.favorites_only && userId) {
        const { data: favoritesData } = await supabase
          .from('recipe_favorites')
          .select('recipe_id')
          .eq('user_id', userId)

        const favoriteIds = (favoritesData || []).map(f => f.recipe_id)
        filteredRecipes = filteredRecipes.filter(r => favoriteIds.includes(r.id))
      }

      // Para cada receita, verificar se o usuário atual favoritou
      const recipesWithFavoriteStatus = await Promise.all(
        filteredRecipes.map(async (recipe) => {
          let userHasFavorited = false

          if (userId) {
            const { data } = await supabase
              .from('recipe_favorites')
              .select('id')
              .eq('recipe_id', recipe.id)
              .eq('user_id', userId)
              .single()

            userHasFavorited = !!data
          }

          return {
            ...recipe,
            user_has_favorited: userHasFavorited
          }
        })
      )

      recipes.value = recipesWithFavoriteStatus

      return { success: true, data: recipesWithFavoriteStatus }
    } catch (err: any) {
      console.error('Erro ao buscar receitas:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Buscar receita por ID
  const fetchRecipeById = async (recipeId: number) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      const { data: recipeData, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

      if (fetchError) throw fetchError

      // Verificar se o usuário favoritou
      let userHasFavorited = false

      if (userId) {
        const { data } = await supabase
          .from('recipe_favorites')
          .select('id')
          .eq('recipe_id', recipeId)
          .eq('user_id', userId)
          .single()

        userHasFavorited = !!data
      }

      const recipeWithFavorite = {
        ...recipeData,
        user_has_favorited: userHasFavorited
      }

      currentRecipe.value = recipeWithFavorite

      return { success: true, data: recipeWithFavorite }
    } catch (err: any) {
      console.error('Erro ao buscar receita:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Favoritar receita
  const favoriteRecipe = async (recipeId: number) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const userId = user.value.id || user.value.sub

      const { error: insertError } = await supabase
        .from('recipe_favorites')
        .insert({
          recipe_id: recipeId,
          user_id: userId
        })

      if (insertError) throw insertError

      // Atualizar estado local
      const recipe = recipes.value.find(r => r.id === recipeId)
      if (recipe) {
        recipe.user_has_favorited = true
        recipe.favorites_count++
      }

      if (currentRecipe.value?.id === recipeId) {
        currentRecipe.value.user_has_favorited = true
        currentRecipe.value.favorites_count++
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao favoritar receita:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Desfavoritar receita
  const unfavoriteRecipe = async (recipeId: number) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const userId = user.value.id || user.value.sub

      const { error: deleteError } = await supabase
        .from('recipe_favorites')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      // Atualizar estado local
      const recipe = recipes.value.find(r => r.id === recipeId)
      if (recipe) {
        recipe.user_has_favorited = false
        recipe.favorites_count--
      }

      if (currentRecipe.value?.id === recipeId) {
        currentRecipe.value.user_has_favorited = false
        currentRecipe.value.favorites_count--
      }

      // Se filtro de favoritos está ativo, remover da lista
      if (activeFilters.value.favorites_only) {
        recipes.value = recipes.value.filter(r => r.id !== recipeId)
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao desfavoritar receita:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Criar receita (usuários autenticados)
  const createRecipe = async (input: RecipeCreateInput) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const userId = user.value.id || user.value.sub

      const recipeInput = {
        ...input,
        created_by: userId,
        // Receitas de usuários comuns são não-publicadas por padrão (pessoais)
        is_published: input.is_published ?? false
      }

      const { data, error: insertError } = await supabase
        .from('recipes')
        .insert(recipeInput)
        .select('*')
        .single()

      if (insertError) throw insertError

      // Sempre adicionar ao início da lista (usuário verá suas próprias receitas)
      recipes.value = [{ ...data, user_has_favorited: false }, ...recipes.value]

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao criar receita:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Atualizar receita (apenas admin)
  const updateRecipe = async (recipeId: number, input: RecipeUpdateInput) => {
    try {
      const { data, error: updateError } = await supabase
        .from('recipes')
        .update(input)
        .eq('id', recipeId)
        .select('*')
        .single()

      if (updateError) throw updateError

      // Atualizar na lista local
      const index = recipes.value.findIndex(r => r.id === recipeId)
      if (index !== -1) {
        recipes.value[index] = {
          ...recipes.value[index],
          ...data
        }
      }

      // Atualizar currentRecipe se for a mesma
      if (currentRecipe.value?.id === recipeId) {
        currentRecipe.value = {
          ...currentRecipe.value,
          ...data
        }
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao atualizar receita:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Deletar receita (apenas admin)
  const deleteRecipe = async (recipeId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)

      if (deleteError) throw deleteError

      // Remover da lista local
      recipes.value = recipes.value.filter(r => r.id !== recipeId)

      // Limpar currentRecipe se for a mesma
      if (currentRecipe.value?.id === recipeId) {
        currentRecipe.value = null
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar receita:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Buscar receitas da Jaque (publicadas)
  const fetchJaqueRecipes = async (filters?: RecipeFilters) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      // Aplicar filtros se fornecidos
      if (filters) {
        activeFilters.value = { ...activeFilters.value, ...filters }
      }

      // Query base - Apenas receitas publicadas
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      // Aplicar filtro de busca por nome
      if (activeFilters.value.search_query) {
        query = query.ilike('title', `%${activeFilters.value.search_query}%`)
      }

      // Aplicar filtros
      if (activeFilters.value.category) {
        query = query.eq('category', activeFilters.value.category)
      }

      if (activeFilters.value.difficulty) {
        query = query.eq('difficulty', activeFilters.value.difficulty)
      }

      if (activeFilters.value.max_prep_time) {
        query = query.lte('prep_time_minutes', activeFilters.value.max_prep_time)
      }

      if (activeFilters.value.tags && activeFilters.value.tags.length > 0) {
        query = query.contains('tags', activeFilters.value.tags)
      }

      const { data: recipesData, error: fetchError } = await query

      if (fetchError) throw fetchError

      let filteredRecipes = recipesData || []

      // Se filtro de favoritos está ativo
      if (activeFilters.value.favorites_only && userId) {
        const { data: favoritesData } = await supabase
          .from('recipe_favorites')
          .select('recipe_id')
          .eq('user_id', userId)

        const favoriteIds = (favoritesData || []).map(f => f.recipe_id)
        filteredRecipes = filteredRecipes.filter(r => favoriteIds.includes(r.id))
      }

      // Verificar status de favorito para cada receita
      const recipesWithFavoriteStatus = await Promise.all(
        filteredRecipes.map(async (recipe) => {
          let userHasFavorited = false

          if (userId) {
            const { data } = await supabase
              .from('recipe_favorites')
              .select('id')
              .eq('recipe_id', recipe.id)
              .eq('user_id', userId)
              .single()

            userHasFavorited = !!data
          }

          return {
            ...recipe,
            user_has_favorited: userHasFavorited
          }
        })
      )

      jaqueRecipes.value = recipesWithFavoriteStatus

      return { success: true, data: recipesWithFavoriteStatus }
    } catch (err: any) {
      console.error('Erro ao buscar receitas da Jaque:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Buscar receitas pessoais do usuário
  const fetchUserRecipes = async (filters?: RecipeFilters) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      if (!userId) {
        userRecipes.value = []
        loading.value = false
        return { success: true, data: [] }
      }

      // Aplicar filtros se fornecidos
      if (filters) {
        activeFilters.value = { ...activeFilters.value, ...filters }
      }

      // Query base - Apenas receitas do usuário não publicadas
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('created_by', userId)
        .eq('is_published', false)
        .order('created_at', { ascending: false })

      // Aplicar filtro de busca por nome
      if (activeFilters.value.search_query) {
        query = query.ilike('title', `%${activeFilters.value.search_query}%`)
      }

      // Aplicar filtros
      if (activeFilters.value.category) {
        query = query.eq('category', activeFilters.value.category)
      }

      if (activeFilters.value.difficulty) {
        query = query.eq('difficulty', activeFilters.value.difficulty)
      }

      if (activeFilters.value.max_prep_time) {
        query = query.lte('prep_time_minutes', activeFilters.value.max_prep_time)
      }

      if (activeFilters.value.tags && activeFilters.value.tags.length > 0) {
        query = query.contains('tags', activeFilters.value.tags)
      }

      const { data: recipesData, error: fetchError } = await query

      if (fetchError) throw fetchError

      let filteredRecipes = recipesData || []

      // Se filtro de favoritos está ativo
      if (activeFilters.value.favorites_only) {
        const { data: favoritesData } = await supabase
          .from('recipe_favorites')
          .select('recipe_id')
          .eq('user_id', userId)

        const favoriteIds = (favoritesData || []).map(f => f.recipe_id)
        filteredRecipes = filteredRecipes.filter(r => favoriteIds.includes(r.id))
      }

      // Verificar status de favorito para cada receita
      const recipesWithFavoriteStatus = await Promise.all(
        filteredRecipes.map(async (recipe) => {
          let userHasFavorited = false

          const { data } = await supabase
            .from('recipe_favorites')
            .select('id')
            .eq('recipe_id', recipe.id)
            .eq('user_id', userId)
            .single()

          userHasFavorited = !!data

          return {
            ...recipe,
            user_has_favorited: userHasFavorited
          }
        })
      )

      userRecipes.value = recipesWithFavoriteStatus

      return { success: true, data: recipesWithFavoriteStatus }
    } catch (err: any) {
      console.error('Erro ao buscar receitas pessoais:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Limpar filtros
  const clearFilters = () => {
    activeFilters.value = {
      search_query: null,
      category: null,
      difficulty: null,
      tags: null,
      max_prep_time: null,
      favorites_only: false
    }
  }

  return {
    recipes,
    jaqueRecipes,
    userRecipes,
    currentRecipe,
    loading,
    error,
    activeFilters,
    fetchRecipes,
    fetchJaqueRecipes,
    fetchUserRecipes,
    fetchRecipeById,
    favoriteRecipe,
    unfavoriteRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    clearFilters
  }
})
