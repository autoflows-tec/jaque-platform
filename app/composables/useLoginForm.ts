import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

export const useLoginForm = () => {
  const { login, loading, error } = useAuth()
  const router = useRouter()

  // Estado das abas
  const activeTab = ref<'login' | 'signup'>('login')

  // Estado do formulário de login
  const loginEmail = ref('')
  const loginPassword = ref('')

  // Estado do formulário de cadastro
  const signupEmail = ref('')
  const signupPassword = ref('')
  const signupConfirmPassword = ref('')

  // Handlers
  const handleLogin = async () => {
    const result = await login(loginEmail.value, loginPassword.value)

    if (result.success) {
      // Redirecionar para dashboard ou home
      router.push('/')
    }
  }

  const handleSignup = () => {
    console.log('Signup:', {
      email: signupEmail.value,
      password: signupPassword.value,
      confirmPassword: signupConfirmPassword.value
    })
    // TODO: Implementar lógica de cadastro
  }

  const setActiveTab = (tab: 'login' | 'signup') => {
    activeTab.value = tab
  }

  return {
    // Estado
    activeTab,
    loginEmail,
    loginPassword,
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
