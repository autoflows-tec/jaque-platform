import { ref } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { navigateTo } from '#app'

const loading = ref(false)
const error = ref<string | null>(null)

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (loginError) {
        error.value = loginError.message
        return { success: false, error: loginError.message }
      }

      // Login bem-sucedido
      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (signupError) {
        error.value = signupError.message
        return { success: false, error: signupError.message }
      }

      // Cadastro bem-sucedido
      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: logoutError } = await supabase.auth.signOut()

      if (logoutError) {
        error.value = logoutError.message
        return { success: false, error: logoutError.message }
      }

      await navigateTo('/login')
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout
  }
}
