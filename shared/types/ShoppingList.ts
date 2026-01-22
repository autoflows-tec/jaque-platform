// =====================================================
// TIPOS PARA O SISTEMA DE LISTAS DE COMPRAS
// =====================================================

// =====================================================
// ENUMS: Categorias de Lista e Categorias de Item
// =====================================================

export enum ShoppingListCategory {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SPECIAL = 'special'
}

export enum ShoppingItemCategory {
  FRUITS = 'fruits',
  VEGETABLES = 'vegetables',
  PROTEINS = 'proteins',
  GRAINS = 'grains',
  DAIRY = 'dairy',
  OTHERS = 'others'
}

// =====================================================
// INTERFACES: Item da Lista
// =====================================================

export interface ShoppingListItem {
  item: string
  quantity: string
  category: ShoppingItemCategory
}

// =====================================================
// INTERFACE: Lista de Compras
// =====================================================

export interface ShoppingList {
  id: number
  created_at: string
  updated_at: string

  // Informações básicas
  title: string
  description: string | null
  image_url: string | null

  // Categorização
  category: ShoppingListCategory

  // Itens
  items: ShoppingListItem[]

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
// INTERFACE: Lista com status de favorito
// =====================================================

export interface ShoppingListWithFavorite extends ShoppingList {
  user_has_favorited?: boolean // Se o usuário atual favoritou
}

// =====================================================
// INTERFACE: Favorito de Lista
// =====================================================

export interface ShoppingListFavorite {
  id: number
  created_at: string
  shopping_list_id: number
  user_id: string
}

// =====================================================
// TYPES: Input para criar/atualizar
// =====================================================

export interface ShoppingListCreateInput {
  title: string
  description?: string | null
  image_url?: string | null
  category?: ShoppingListCategory
  items: ShoppingListItem[]
  tags?: string[] | null
  is_published?: boolean
  created_by?: string | null
}

export interface ShoppingListUpdateInput {
  title?: string
  description?: string | null
  image_url?: string | null
  category?: ShoppingListCategory
  items?: ShoppingListItem[]
  tags?: string[] | null
  is_published?: boolean
}

// =====================================================
// TYPES: Filtros
// =====================================================

export interface ShoppingListFilters {
  category?: ShoppingListCategory | null
  tags?: string[] | null
  favorites_only?: boolean
}

// =====================================================
// HELPERS: Labels para exibição
// =====================================================

export const ShoppingListCategoryLabels: Record<ShoppingListCategory, string> = {
  [ShoppingListCategory.WEEKLY]: 'Semanal',
  [ShoppingListCategory.MONTHLY]: 'Mensal',
  [ShoppingListCategory.SPECIAL]: 'Especial'
}

export const ShoppingItemCategoryLabels: Record<ShoppingItemCategory, string> = {
  [ShoppingItemCategory.FRUITS]: 'Frutas',
  [ShoppingItemCategory.VEGETABLES]: 'Vegetais e Verduras',
  [ShoppingItemCategory.PROTEINS]: 'Proteínas',
  [ShoppingItemCategory.GRAINS]: 'Grãos e Cereais',
  [ShoppingItemCategory.DAIRY]: 'Laticínios',
  [ShoppingItemCategory.OTHERS]: 'Outros'
}
