import { defineStore } from 'pinia'
import type { QuizResponses, QuizResponse } from '../../shared/types/Quiz'
import { calculateQuizScore } from '../../shared/types/Quiz'

export const useQuizStore = defineStore('quiz', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const quizResponse = ref<QuizResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Buscar quiz existente do usuário
  const fetchQuizResponse = async () => {
    if (!user.value?.id && !user.value?.sub) {
      quizResponse.value = null
      return
    }

    const userId = user.value?.id || user.value?.sub

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        // Se não encontrou, não é um erro (usuário ainda não fez quiz)
        if (fetchError.code === 'PGRST116') {
          quizResponse.value = null
          return
        }
        throw fetchError
      }

      quizResponse.value = data
    } catch (err: any) {
      console.error('Erro ao buscar quiz:', err)
      error.value = err.message
      quizResponse.value = null
    } finally {
      loading.value = false
    }
  }

  // Salvar ou atualizar respostas do quiz
  const saveQuizResponse = async (responses: QuizResponses, isCompleted: boolean = false) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false }
    }

    const userId = user.value?.id || user.value?.sub
    const totalScore = calculateQuizScore(responses)

    loading.value = true
    error.value = null

    try {
      // Verificar se já existe um quiz
      const { data: existingQuiz } = await supabase
        .from('quiz_responses')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (existingQuiz) {
        // Atualizar quiz existente
        const { data, error: updateError } = await supabase
          .from('quiz_responses')
          .update({
            responses,
            total_score: totalScore,
            is_completed: isCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single()

        if (updateError) throw updateError

        quizResponse.value = data
      } else {
        // Inserir novo quiz
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

        quizResponse.value = data
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao salvar quiz:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Verificar se o usuário já completou o quiz
  const hasCompletedQuiz = computed(() => {
    return quizResponse.value?.is_completed ?? false
  })

  // Limpar estado
  const clearQuiz = () => {
    quizResponse.value = null
    error.value = null
  }

  return {
    quizResponse,
    loading,
    error,
    hasCompletedQuiz,
    fetchQuizResponse,
    saveQuizResponse,
    clearQuiz
  }
})
