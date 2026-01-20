export interface Module {
  id: number
  created_at: string
  updated_at: string
  title: string
  description: string | null
  thumbnail_url: string | null
  order_index: number
  is_published: boolean
  created_by: string | null
}

export interface ModuleCreateInput {
  title: string
  description?: string | null
  thumbnail_url?: string | null
  order_index?: number
  is_published?: boolean
}

export interface ModuleUpdateInput {
  title?: string
  description?: string | null
  thumbnail_url?: string | null
  order_index?: number
  is_published?: boolean
}
