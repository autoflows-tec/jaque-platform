// =====================================================
// TIPOS PARA O SISTEMA DE FEED DA COMUNIDADE
// =====================================================

// =====================================================
// TYPES: Tipos de mídia suportados
// =====================================================

export type MediaType = 'image' | 'video'

export interface PostMedia {
  url: string
  type: MediaType
  thumbnail?: string // Para vídeos, thumbnail opcional
}

// =====================================================
// INTERFACE: Post da Comunidade
// =====================================================

export interface CommunityPost {
  id: number
  created_at: string
  updated_at: string
  user_id: string
  content: string
  media_urls?: string[] | null // URLs de imagens/vídeos
  is_published: boolean
  likes_count: number
  comments_count: number
}

// =====================================================
// INTERFACE: Post com informações do autor (JOIN)
// =====================================================

export interface CommunityPostWithAuthor extends CommunityPost {
  author: {
    name: string | null
    user_id: string
  }
  user_has_liked?: boolean // Se o usuário atual curtiu
}

// =====================================================
// INTERFACE: Curtida em Post
// =====================================================

export interface CommunityPostLike {
  id: number
  created_at: string
  post_id: number
  user_id: string
}

// =====================================================
// INTERFACE: Comentário em Post
// =====================================================

export interface CommunityPostComment {
  id: number
  created_at: string
  updated_at: string
  post_id: number
  user_id: string
  content: string
}

// =====================================================
// INTERFACE: Comentário com informações do autor (JOIN)
// =====================================================

export interface CommunityPostCommentWithAuthor extends CommunityPostComment {
  author: {
    name: string | null
    user_id: string
  }
}

// =====================================================
// TYPES: Input para criar/atualizar
// =====================================================

export interface CommunityPostCreateInput {
  user_id: string
  content: string
  media_urls?: string[] | null
  is_published?: boolean
}

export interface CommunityPostUpdateInput {
  content?: string
  media_urls?: string[] | null
  is_published?: boolean
}

export interface CommunityPostCommentCreateInput {
  post_id: number
  user_id: string
  content: string
}

export interface CommunityPostCommentUpdateInput {
  content: string
}
