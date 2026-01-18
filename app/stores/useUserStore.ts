import { defineStore } from 'pinia'
import type { Profile } from '../../shared/types/Profile'

export const useUserStore = defineStore('user', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async () => {
    const userId = user.value?.id || user.value?.sub

    if (!userId) {
      console.log('❌ fetchProfile: user ID não encontrado', user.value)
      profile.value = null
      return
    }

    console.log('🔍 fetchProfile: buscando perfil para user_id:', userId)

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      console.log('📦 Resultado da query:', { data, error: fetchError })

      if (fetchError) throw fetchError

      profile.value = data
      console.log('✅ Profile salvo no store:', profile.value)
    } catch (err: any) {
      console.error('❌ Erro ao buscar profile:', err)
      error.value = err.message
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile
  }
})
