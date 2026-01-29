import { defineStore } from 'pinia'
import { useChatIA } from '~/composables/useChatIA'
import type {
  ChatConversation,
  ChatMessage,
  ChatConversationCreateInput,
  ChatConversationUpdateInput,
  ChatMessageCreateInput,
  MessageRole
} from '../../shared/types/Chat'

export const useChatStore = defineStore('chat', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { sendToWebhook } = useChatIA()

  // Estado
  const conversations = ref<ChatConversation[]>([])
  const currentConversation = ref<ChatConversation | null>(null)
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sendingMessage = ref(false)

  // =====================================================
  // CONVERSAS
  // =====================================================

  /**
   * Buscar todas as conversas do usuário
   */
  const fetchConversations = async () => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      if (!userId) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: fetchError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      conversations.value = data || []

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao buscar conversas:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Criar nova conversa
   */
  const createConversation = async (title?: string) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      if (!userId) {
        throw new Error('Usuário não autenticado')
      }

      const input: ChatConversationCreateInput = {
        user_id: userId,
        title: title || null,
        status: 'active'
      }

      const { data, error: insertError } = await supabase
        .from('chat_conversations')
        .insert(input)
        .select()
        .single()

      if (insertError) throw insertError

      conversations.value = [data, ...conversations.value]
      currentConversation.value = data

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao criar conversa:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Atualizar conversa
   */
  const updateConversation = async (id: number, input: ChatConversationUpdateInput) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('chat_conversations')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Atualizar na lista
      const index = conversations.value.findIndex(c => c.id === id)
      if (index !== -1) {
        conversations.value[index] = data
      }

      // Atualizar conversa atual se for a mesma
      if (currentConversation.value?.id === id) {
        currentConversation.value = data
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao atualizar conversa:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Deletar conversa
   */
  const deleteConversation = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Remover da lista
      conversations.value = conversations.value.filter(c => c.id !== id)

      // Limpar conversa atual se for a mesma
      if (currentConversation.value?.id === id) {
        currentConversation.value = null
        messages.value = []
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar conversa:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Selecionar conversa atual
   */
  const selectConversation = async (conversation: ChatConversation) => {
    currentConversation.value = conversation
    await fetchMessages(conversation.id)
  }

  // =====================================================
  // MENSAGENS
  // =====================================================

  /**
   * Buscar mensagens de uma conversa
   */
  const fetchMessages = async (conversationId: number) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      messages.value = data || []

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao buscar mensagens:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Enviar mensagem e processar com IA
   */
  const sendMessage = async (content: string) => {
    if (!content.trim()) {
      return { success: false, error: 'Mensagem vazia' }
    }

    sendingMessage.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      if (!userId) {
        throw new Error('Usuário não autenticado')
      }

      // Se não tem conversa atual, criar uma nova
      if (!currentConversation.value) {
        const result = await createConversation()
        if (!result.success || !result.data) {
          throw new Error('Falha ao criar conversa')
        }
      }

      const conversationId = currentConversation.value!.id

      // 1. Criar mensagem do usuário
      const userMessageInput: ChatMessageCreateInput = {
        conversation_id: conversationId,
        user_id: userId,
        role: 'user' as MessageRole,
        content: content.trim(),
        is_loading: false
      }

      const { data: userMessage, error: userError } = await supabase
        .from('chat_messages')
        .insert(userMessageInput)
        .select()
        .single()

      if (userError) throw userError

      // Adicionar mensagem do usuário ao estado (optimistic UI)
      messages.value.push(userMessage)

      // 2. Criar mensagem placeholder da IA (loading)
      const aiMessageInput: ChatMessageCreateInput = {
        conversation_id: conversationId,
        user_id: userId,
        role: 'assistant' as MessageRole,
        content: '',
        is_loading: true
      }

      const { data: aiMessageLoading, error: aiError } = await supabase
        .from('chat_messages')
        .insert(aiMessageInput)
        .select()
        .single()

      if (aiError) throw aiError

      // Adicionar mensagem loading ao estado
      messages.value.push(aiMessageLoading)

      // 3. Enviar para webhook e aguardar resposta
      const webhookResult = await sendToWebhook(userId, content.trim())

      // 4. Atualizar mensagem da IA com a resposta
      if (webhookResult.success && webhookResult.output) {
        const { data: aiMessageUpdated, error: updateError } = await supabase
          .from('chat_messages')
          .update({
            content: webhookResult.output,
            is_loading: false,
            error_message: null
          })
          .eq('id', aiMessageLoading.id)
          .select()
          .single()

        if (updateError) throw updateError

        // Atualizar no estado
        const index = messages.value.findIndex(m => m.id === aiMessageLoading.id)
        if (index !== -1) {
          messages.value[index] = aiMessageUpdated
        }
      } else {
        // Se houve erro no webhook, atualizar mensagem com erro
        const errorMsg = webhookResult.error || 'Erro ao processar resposta da IA'

        const { data: aiMessageError, error: updateError } = await supabase
          .from('chat_messages')
          .update({
            content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
            is_loading: false,
            error_message: errorMsg
          })
          .eq('id', aiMessageLoading.id)
          .select()
          .single()

        if (updateError) throw updateError

        // Atualizar no estado
        const index = messages.value.findIndex(m => m.id === aiMessageLoading.id)
        if (index !== -1) {
          messages.value[index] = aiMessageError
        }

        throw new Error(errorMsg)
      }

      // Atualizar lista de conversas
      await fetchConversations()

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      sendingMessage.value = false
    }
  }

  /**
   * Limpar estado
   */
  const clearState = () => {
    conversations.value = []
    currentConversation.value = null
    messages.value = []
    error.value = null
  }

  return {
    // Estado
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    sendingMessage,

    // Métodos de conversas
    fetchConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    selectConversation,

    // Métodos de mensagens
    fetchMessages,
    sendMessage,

    // Utilitários
    clearState
  }
})
