import { ref } from 'vue'
import type { ChatWebhookRequest, ChatWebhookResponse } from '../../shared/types/Chat'
import { CHAT_WEBHOOK_URL, CHAT_WEBHOOK_TIMEOUT } from '../../shared/types/Chat'

export const useChatIA = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Envia mensagem para o webhook de IA e retorna a resposta
   * @param userId - ID do usuário
   * @param message - Mensagem do usuário
   * @returns Promise com a resposta da IA ou erro
   */
  const sendToWebhook = async (
    userId: string,
    message: string
  ): Promise<{ success: boolean; output?: string; error?: string }> => {
    loading.value = true
    error.value = null

    try {
      // Criar controller para timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), CHAT_WEBHOOK_TIMEOUT)

      // Preparar payload
      const payload: ChatWebhookRequest = {
        user_id: userId,
        message: message
      }

      // Fazer requisição POST para o webhook
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      // Parse da resposta
      const data: ChatWebhookResponse = await response.json()

      // Verificar se há erro na resposta
      if (data.error) {
        throw new Error(data.error)
      }

      // Verificar se há output
      if (!data.output) {
        throw new Error('Resposta da IA vazia')
      }

      return {
        success: true,
        output: data.output
      }
    } catch (err: any) {
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro ao comunicar com a IA'

      if (err.name === 'AbortError') {
        errorMessage = 'Timeout: A IA está demorando muito para responder. Tente novamente.'
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.'
      } else if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503')) {
        errorMessage = 'Serviço da IA temporariamente indisponível. Tente em alguns minutos.'
      } else if (err.message.includes('429')) {
        errorMessage = 'Muitas requisições. Aguarde alguns segundos.'
      } else if (err.message) {
        errorMessage = err.message
      }

      console.error('Erro no webhook:', err)
      error.value = errorMessage

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa estado de erro
   */
  const clearError = () => {
    error.value = null
  }

  return {
    loading,
    error,
    sendToWebhook,
    clearError
  }
}
