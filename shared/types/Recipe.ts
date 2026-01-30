// =====================================================
// TIPOS PARA O SISTEMA DE RECEITAS
// =====================================================

// =====================================================
// ENUMS: Categorias e Dificuldade
// =====================================================

export enum RecipeCategory {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  DESSERT = 'dessert'
}

export enum RecipeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// =====================================================
// INTERFACES: Ingrediente e Informações Nutricionais
// =====================================================

export interface RecipeIngredient {
  item: string
  amount: string
}

export interface RecipeNutritionalInfo {
  protein?: number // gramas
  carbs?: number // gramas
  fats?: number // gramas
  fiber?: number // gramas
}

// =====================================================
// INTERFACE: Receita
// =====================================================

export interface Recipe {
  id: number
  created_at: string
  updated_at: string

  // Informações básicas
  title: string
  description: string | null
  image_url: string | null

  // Categorização
  category: RecipeCategory
  difficulty: RecipeDifficulty
  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number

  // Conteúdo
  ingredients: RecipeIngredient[]
  instructions: string[]

  // Nutrição
  calories_per_serving: number | null
  nutritional_info: RecipeNutritionalInfo | null

  // Tags
  tags: string[] | null

  // Publicação
  is_published: boolean

  // Contador
  favorites_count: number

  // Metadados
  created_by: string | null
}

// =====================================================
// INTERFACE: Receita com status de favorito
// =====================================================

export interface RecipeWithFavorite extends Recipe {
  user_has_favorited?: boolean // Se o usuário atual favoritou
}

// =====================================================
// INTERFACE: Favorito de Receita
// =====================================================

export interface RecipeFavorite {
  id: number
  created_at: string
  recipe_id: number
  user_id: string
}

// =====================================================
// TYPES: Input para criar/atualizar
// =====================================================

export interface RecipeCreateInput {
  title: string
  description?: string | null
  image_url?: string | null
  category: RecipeCategory
  difficulty?: RecipeDifficulty
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  servings?: number
  ingredients: RecipeIngredient[]
  instructions: string[]
  calories_per_serving?: number | null
  nutritional_info?: RecipeNutritionalInfo | null
  tags?: string[] | null
  is_published?: boolean
  created_by?: string | null
}

export interface RecipeUpdateInput {
  title?: string
  description?: string | null
  image_url?: string | null
  category?: RecipeCategory
  difficulty?: RecipeDifficulty
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  servings?: number
  ingredients?: RecipeIngredient[]
  instructions?: string[]
  calories_per_serving?: number | null
  nutritional_info?: RecipeNutritionalInfo | null
  tags?: string[] | null
  is_published?: boolean
}

// =====================================================
// TYPES: Filtros
// =====================================================

export interface RecipeFilters {
  search_query?: string | null // Busca por nome
  category?: RecipeCategory | null
  difficulty?: RecipeDifficulty | null
  tags?: string[] | null
  max_prep_time?: number | null // em minutos
  favorites_only?: boolean
}

// =====================================================
// HELPERS: Labels para exibição
// =====================================================

export const RecipeCategoryLabels: Record<RecipeCategory, string> = {
  [RecipeCategory.BREAKFAST]: 'Café da Manhã',
  [RecipeCategory.LUNCH]: 'Almoço',
  [RecipeCategory.DINNER]: 'Jantar',
  [RecipeCategory.SNACK]: 'Lanche',
  [RecipeCategory.DESSERT]: 'Sobremesa'
}

export const RecipeDifficultyLabels: Record<RecipeDifficulty, string> = {
  [RecipeDifficulty.EASY]: 'Fácil',
  [RecipeDifficulty.MEDIUM]: 'Médio',
  [RecipeDifficulty.HARD]: 'Difícil'
}
