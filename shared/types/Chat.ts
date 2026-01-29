// =====================================================
// TIPOS PARA O SISTEMA DE CHAT IA - RECEITAS
// =====================================================

// =====================================================
// ENUMS
// =====================================================

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

// =====================================================
// INTERFACE: Conversa
// =====================================================

export interface ChatConversation {
  id: number
  created_at: string
  updated_at: string
  user_id: string

  // Informações da conversa
  title: string | null
  status: ConversationStatus

  // Contador denormalizado (atualizado via trigger)
  messages_count: number

  // Última mensagem (para preview)
  last_message_at: string | null
}

// =====================================================
// INTERFACE: Mensagem
// =====================================================

export interface ChatMessage {
  id: number
  created_at: string

  // Relacionamentos
  conversation_id: number
  user_id: string

  // Conteúdo
  role: MessageRole
  content: string

  // Estado (para UI de loading)
  is_loading: boolean

  // Metadados opcionais
  error_message: string | null
}

// =====================================================
// INTERFACE: Mensagem com dados do autor
// =====================================================

export interface ChatMessageWithAuthor extends ChatMessage {
  author?: {
    name: string | null
    email: string | null
  }
}

// =====================================================
// INTERFACE: Conversa com última mensagem
// =====================================================

export interface ChatConversationWithLastMessage extends ChatConversation {
  last_message?: ChatMessage | null
}

// =====================================================
// TYPES: Input para criar/atualizar
// =====================================================

export interface ChatConversationCreateInput {
  user_id: string
  title?: string | null
  status?: ConversationStatus
}

export interface ChatConversationUpdateInput {
  title?: string | null
  status?: ConversationStatus
}

export interface ChatMessageCreateInput {
  conversation_id: number
  user_id: string
  role: MessageRole
  content: string
  is_loading?: boolean
  error_message?: string | null
}

export interface ChatMessageUpdateInput {
  content?: string
  is_loading?: boolean
  error_message?: string | null
}

// =====================================================
// TYPES: Request/Response para Webhook
// =====================================================

export interface ChatWebhookRequest {
  user_id: string
  message: string
}

export interface ChatWebhookResponse {
  output: string
  error?: string
}

// =====================================================
// HELPERS: Labels e Constantes
// =====================================================

export const CHAT_WEBHOOK_URL = 'https://webhook.namasteagrofloresta.com.br/webhook/jaque-ia-receitas'
export const CHAT_WEBHOOK_TIMEOUT = 30000 // 30 segundos

export const MessageRoleLabels: Record<MessageRole, string> = {
  [MessageRole.USER]: 'Você',
  [MessageRole.ASSISTANT]: 'IA Receitas'
}

export const ConversationStatusLabels: Record<ConversationStatus, string> = {
  [ConversationStatus.ACTIVE]: 'Ativa',
  [ConversationStatus.ARCHIVED]: 'Arquivada'
}

// =====================================================
// HELPERS: Funções utilitárias
// =====================================================

/**
 * Gera título automático baseado na primeira mensagem
 */
export const generateConversationTitle = (firstMessage: string): string => {
  const maxLength = 50
  if (firstMessage.length <= maxLength) {
    return firstMessage
  }
  return firstMessage.substring(0, maxLength) + '...'
}

/**
 * Formata timestamp para exibição relativa
 */
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'Agora'
  if (diffInMinutes < 60) return `${diffInMinutes}min`
  if (diffInHours < 24) return `${diffInHours}h`
  if (diffInDays < 7) return `${diffInDays}d`

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}
