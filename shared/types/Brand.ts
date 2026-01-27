// =====================================================
// TIPOS PARA O SISTEMA DE MARCAS RECOMENDADAS
// =====================================================

// =====================================================
// ENUMS: Categorias
// =====================================================

export enum BrandCategory {
  ALIMENTOS = 'alimentos',
  SUPLEMENTOS = 'suplementos',
  UTENSILIOS = 'utensilios',
  LIVROS = 'livros',
  OUTROS = 'outros'
}

// =====================================================
// INTERFACE: Marca
// =====================================================

export interface Brand {
  id: number
  created_at: string
  updated_at: string

  // Informações básicas
  name: string
  description: string | null
  logo_url: string | null

  // Categorização
  category: BrandCategory

  // Links
  website_url: string | null
  affiliate_link: string | null

  // Tags
  tags: string[] | null

  // Destaque e publicação
  is_featured: boolean
  is_published: boolean

  // Rating e favoritos
  rating: number | null // 1-5
  favorites_count: number

  // Metadados
  created_by: string | null
}

// =====================================================
// INTERFACE: Marca com status de favorito
// =====================================================

export interface BrandWithFavorite extends Brand {
  user_has_favorited?: boolean // Se o usuário atual favoritou
}

// =====================================================
// INTERFACE: Favorito de Marca
// =====================================================

export interface BrandFavorite {
  id: number
  created_at: string
  brand_id: number
  user_id: string
}

// =====================================================
// TYPES: Input para criar/atualizar
// =====================================================

export interface BrandCreateInput {
  name: string
  description?: string | null
  logo_url?: string | null
  category: BrandCategory
  website_url?: string | null
  affiliate_link?: string | null
  tags?: string[] | null
  is_featured?: boolean
  is_published?: boolean
  rating?: number | null
  created_by?: string | null
}

export interface BrandUpdateInput {
  name?: string
  description?: string | null
  logo_url?: string | null
  category?: BrandCategory
  website_url?: string | null
  affiliate_link?: string | null
  tags?: string[] | null
  is_featured?: boolean
  is_published?: boolean
  rating?: number | null
}

// =====================================================
// TYPES: Filtros
// =====================================================

export interface BrandFilters {
  category?: BrandCategory | null
  tags?: string[] | null
  featured_only?: boolean
  favorites_only?: boolean
  search?: string | null
}

// =====================================================
// HELPERS: Labels para exibição
// =====================================================

export const BrandCategoryLabels: Record<BrandCategory, string> = {
  [BrandCategory.ALIMENTOS]: 'Alimentos',
  [BrandCategory.SUPLEMENTOS]: 'Suplementos',
  [BrandCategory.UTENSILIOS]: 'Utensílios',
  [BrandCategory.LIVROS]: 'Livros',
  [BrandCategory.OUTROS]: 'Outros'
}
