import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useActivityLogger } from '~/composables/useActivityLogger'
import { ActivityType } from '../../shared/types/ActivityLog'
import { navigateTo } from '#app'

export const useLoginForm = () => {
  const { login, signup, loading, error } = useAuth()
  const { logActivity } = useActivityLogger()

  // Estado das abas
  const activeTab = ref<'login' | 'signup'>('login')

  // Estado do formulário de login
  const loginEmail = ref('')
  const loginPassword = ref('')

  // Estado do formulário de cadastro
  const signupName = ref('')
  const signupEmail = ref('')
  const signupPassword = ref('')
  const signupConfirmPassword = ref('')

  // Handlers
  const handleLogin = async () => {
    const result = await login(loginEmail.value, loginPassword.value)

    if (result.success) {
      // Registrar atividade de login
      await logActivity(ActivityType.LOGIN)

      // Aguardar um pouco para sessão ser estabelecida
      await new Promise(resolve => setTimeout(resolve, 500))
      // Forçar reload completo da página para garantir que o middleware pegue o user
      window.location.href = '/'
    }
  }

  const handleSignup = async () => {
    // Validações básicas
    if (signupPassword.value !== signupConfirmPassword.value) {
      error.value = 'As senhas não coincidem'
      return
    }

    if (!signupName.value.trim()) {
      error.value = 'Nome é obrigatório'
      return
    }

    const result = await signup(signupEmail.value, signupPassword.value, signupName.value)

    if (result.success) {
      // Registrar atividade de cadastro
      await logActivity(ActivityType.SIGNUP, { name: signupName.value })

      // Aguardar um pouco para sessão ser estabelecida
      await new Promise(resolve => setTimeout(resolve, 500))
      // Redirecionar para quiz após cadastro
      window.location.href = '/quiz'
    }
  }

  const setActiveTab = (tab: 'login' | 'signup') => {
    activeTab.value = tab
  }

  return {
    // Estado
    activeTab,
    loginEmail,
    loginPassword,
    signupName,
    signupEmail,
    signupPassword,
    signupConfirmPassword,
    loading,
    error,

    // Métodos
    handleLogin,
    handleSignup,
    setActiveTab
  }
}
