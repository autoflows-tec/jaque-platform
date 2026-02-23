// =====================================================
// TIPOS PARA LOGS DE ATIVIDADE DE USUÁRIO
// =====================================================

import type { Profile } from './Profile'

// Tipos de atividades rastreadas
export enum ActivityType {
  // Autenticação
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SIGNUP = 'SIGNUP',

  // Quiz
  QUIZ_STARTED = 'QUIZ_STARTED',
  QUIZ_COMPLETED = 'QUIZ_COMPLETED',
  QUIZ_DELETED = 'QUIZ_DELETED',

  // Aulas
  LESSON_WATCHED = 'LESSON_WATCHED',
  MODULE_VIEWED = 'MODULE_VIEWED',

  // Receitas
  RECIPE_CREATED = 'RECIPE_CREATED',
  RECIPE_UPDATED = 'RECIPE_UPDATED',
  RECIPE_DELETED = 'RECIPE_DELETED',
  RECIPE_FAVORITED = 'RECIPE_FAVORITED',
  RECIPE_UNFAVORITED = 'RECIPE_UNFAVORITED',

  // Listas de compras
  SHOPPING_LIST_CREATED = 'SHOPPING_LIST_CREATED',
  SHOPPING_LIST_UPDATED = 'SHOPPING_LIST_UPDATED',
  SHOPPING_LIST_DELETED = 'SHOPPING_LIST_DELETED',
  SHOPPING_LIST_FAVORITED = 'SHOPPING_LIST_FAVORITED',
  SHOPPING_LIST_UNFAVORITED = 'SHOPPING_LIST_UNFAVORITED',

  // Marcas
  BRAND_FAVORITED = 'BRAND_FAVORITED',
  BRAND_UNFAVORITED = 'BRAND_UNFAVORITED',

  // Comunidade
  COMMUNITY_POST_CREATED = 'COMMUNITY_POST_CREATED',
  COMMUNITY_POST_DELETED = 'COMMUNITY_POST_DELETED',
  COMMUNITY_POST_LIKED = 'COMMUNITY_POST_LIKED',
  COMMUNITY_POST_UNLIKED = 'COMMUNITY_POST_UNLIKED',
  COMMUNITY_COMMENT_CREATED = 'COMMUNITY_COMMENT_CREATED',
  COMMUNITY_COMMENT_DELETED = 'COMMUNITY_COMMENT_DELETED',

  // Chat IA
  CHAT_CONVERSATION_CREATED = 'CHAT_CONVERSATION_CREATED',
  CHAT_MESSAGE_SENT = 'CHAT_MESSAGE_SENT',
  CHAT_CONVERSATION_DELETED = 'CHAT_CONVERSATION_DELETED',

  // Perfil
  PROFILE_UPDATED = 'PROFILE_UPDATED'
}

// Interface principal do log de atividade
export interface ActivityLog {
  id: number
  created_at: string
  user_id: string
  activity_type: ActivityType
  activity_data: Record<string, any>
  metadata: Record<string, any>
}

// ActivityLog com informações do perfil do usuário
export interface ActivityLogWithProfile extends ActivityLog {
  profile: Profile | null
}

// Filtros para buscar logs
export interface ActivityLogFilters {
  user_id?: string
  activity_types?: ActivityType[]
  date_from?: string
  date_to?: string
  search?: string
}

// Input para criar log
export interface ActivityLogCreateInput {
  user_id: string
  activity_type: ActivityType
  activity_data?: Record<string, any>
  metadata?: Record<string, any>
}

// =====================================================
// HELPER: Obter label em português para tipo de atividade
// =====================================================

export function getActivityTypeLabel(type: ActivityType): string {
  const labels: Record<ActivityType, string> = {
    [ActivityType.LOGIN]: 'Login',
    [ActivityType.LOGOUT]: 'Logout',
    [ActivityType.SIGNUP]: 'Cadastro',

    [ActivityType.QUIZ_STARTED]: 'Iniciou o quiz',
    [ActivityType.QUIZ_COMPLETED]: 'Completou o quiz',
    [ActivityType.QUIZ_DELETED]: 'Deletou o quiz',

    [ActivityType.LESSON_WATCHED]: 'Assistiu uma aula',
    [ActivityType.MODULE_VIEWED]: 'Visualizou um módulo',

    [ActivityType.RECIPE_CREATED]: 'Criou uma receita',
    [ActivityType.RECIPE_UPDATED]: 'Atualizou uma receita',
    [ActivityType.RECIPE_DELETED]: 'Deletou uma receita',
    [ActivityType.RECIPE_FAVORITED]: 'Favoritou uma receita',
    [ActivityType.RECIPE_UNFAVORITED]: 'Desfavoritou uma receita',

    [ActivityType.SHOPPING_LIST_CREATED]: 'Criou uma lista de compras',
    [ActivityType.SHOPPING_LIST_UPDATED]: 'Atualizou uma lista de compras',
    [ActivityType.SHOPPING_LIST_DELETED]: 'Deletou uma lista de compras',
    [ActivityType.SHOPPING_LIST_FAVORITED]: 'Favoritou uma lista de compras',
    [ActivityType.SHOPPING_LIST_UNFAVORITED]: 'Desfavoritou uma lista de compras',

    [ActivityType.BRAND_FAVORITED]: 'Favoritou uma marca',
    [ActivityType.BRAND_UNFAVORITED]: 'Desfavoritou uma marca',

    [ActivityType.COMMUNITY_POST_CREATED]: 'Criou um post na comunidade',
    [ActivityType.COMMUNITY_POST_DELETED]: 'Deletou um post na comunidade',
    [ActivityType.COMMUNITY_POST_LIKED]: 'Curtiu um post',
    [ActivityType.COMMUNITY_POST_UNLIKED]: 'Descurtiu um post',
    [ActivityType.COMMUNITY_COMMENT_CREATED]: 'Comentou em um post',
    [ActivityType.COMMUNITY_COMMENT_DELETED]: 'Deletou um comentário',

    [ActivityType.CHAT_CONVERSATION_CREATED]: 'Criou uma conversa no chat IA',
    [ActivityType.CHAT_MESSAGE_SENT]: 'Enviou mensagem no chat IA',
    [ActivityType.CHAT_CONVERSATION_DELETED]: 'Deletou uma conversa no chat IA',

    [ActivityType.PROFILE_UPDATED]: 'Atualizou o perfil'
  }

  return labels[type] || type
}

// =====================================================
// HELPER: Obter cor do badge por categoria
// =====================================================

export function getActivityTypeColor(type: ActivityType): string {
  if (type.startsWith('LOGIN') || type.startsWith('LOGOUT') || type.startsWith('SIGNUP')) {
    return 'blue'
  }
  if (type.startsWith('QUIZ')) {
    return 'purple'
  }
  if (type.startsWith('LESSON') || type.startsWith('MODULE')) {
    return 'green'
  }
  if (type.startsWith('RECIPE')) {
    return 'orange'
  }
  if (type.startsWith('SHOPPING_LIST')) {
    return 'yellow'
  }
  if (type.startsWith('BRAND')) {
    return 'pink'
  }
  if (type.startsWith('COMMUNITY')) {
    return 'indigo'
  }
  if (type.startsWith('CHAT')) {
    return 'cyan'
  }
  if (type.startsWith('PROFILE')) {
    return 'gray'
  }
  return 'gray'
}

// =====================================================
// HELPER: Formatar data relativa
// =====================================================

export function formatActivityDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return 'Agora mesmo'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`
  } else if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  } else if (diffInDays === 1) {
    return 'Ontem'
  } else if (diffInDays < 7) {
    return `${diffInDays} dias atrás`
  } else {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
