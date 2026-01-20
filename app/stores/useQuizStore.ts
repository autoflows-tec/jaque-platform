import { defineStore } from 'pinia'
import type { QuizResponses, QuizResponse, QuizHistoryItem } from '../../shared/types/Quiz'
import { calculateQuizScore } from '../../shared/types/Quiz'

export const useQuizStore = defineStore('quiz', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const quizHistory = ref<QuizHistoryItem[]>([])
  const currentQuizDetail = ref<QuizResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Buscar histórico de quizzes do usuário (apenas resumo)
  const fetchQuizHistory = async () => {
    if (!user.value?.id && !user.value?.sub) {
      quizHistory.value = []
      return
    }

    const userId = user.value?.id || user.value?.sub

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('quiz_responses')
        .select('id, created_at, total_score, is_completed')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      quizHistory.value = data || []
    } catch (err: any) {
      console.error('Erro ao buscar histórico de quizzes:', err)
      error.value = err.message
      quizHistory.value = []
    } finally {
      loading.value = false
    }
  }

  // Buscar quiz específico por ID (com todas as respostas)
  const fetchQuizById = async (quizId: number) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('id', quizId)
        .single()

      if (fetchError) throw fetchError

      currentQuizDetail.value = data
      return data
    } catch (err: any) {
      console.error('Erro ao buscar quiz:', err)
      error.value = err.message
      currentQuizDetail.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // Buscar o quiz mais recente completado (para verificar redirect)
  const fetchLatestCompletedQuiz = async () => {
    if (!user.value?.id && !user.value?.sub) {
      return null
    }

    const userId = user.value?.id || user.value?.sub

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError) {
        // Se não encontrou, não é um erro (usuário ainda não completou nenhum quiz)
        if (fetchError.code === 'PGRST116') {
          return null
        }
        throw fetchError
      }

      return data
    } catch (err: any) {
      console.error('Erro ao buscar último quiz:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Criar NOVO quiz (sempre cria, nunca atualiza)
  const createQuizResponse = async (responses: QuizResponses, isCompleted: boolean = false) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false }
    }

    const userId = user.value?.id || user.value?.sub
    const totalScore = calculateQuizScore(responses)

    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: userId,
          responses,
          total_score: totalScore,
          is_completed: isCompleted
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Atualizar histórico
      await fetchQuizHistory()

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao criar quiz:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Deletar quiz específico (opcional)
  const deleteQuiz = async (quizId: number) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('quiz_responses')
        .delete()
        .eq('id', quizId)

      if (deleteError) throw deleteError

      // Atualizar histórico
      await fetchQuizHistory()

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar quiz:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Verificar se o usuário já completou PELO MENOS UM quiz
  const hasCompletedQuiz = computed(() => {
    return quizHistory.value.some(quiz => quiz.is_completed)
  })

  // Limpar estado
  const clearQuiz = () => {
    quizHistory.value = []
    currentQuizDetail.value = null
    error.value = null
  }

  return {
    quizHistory,
    currentQuizDetail,
    loading,
    error,
    hasCompletedQuiz,
    fetchQuizHistory,
    fetchQuizById,
    fetchLatestCompletedQuiz,
    createQuizResponse,
    deleteQuiz,
    clearQuiz
  }
})
