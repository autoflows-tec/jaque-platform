import { defineStore } from 'pinia'
import type {
  ActivityLog,
  ActivityLogWithProfile,
  ActivityLogFilters,
  ActivityType
} from '../../shared/types/ActivityLog'

export const useActivityLogsStore = defineStore('activityLogs', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const logs = ref<ActivityLogWithProfile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalLogs = ref(0)

  // Paginação
  const currentPage = ref(1)
  const logsPerPage = 50

  // Filtros ativos
  const activeFilters = ref<ActivityLogFilters>({
    user_id: undefined,
    activity_types: undefined,
    date_from: undefined,
    date_to: undefined,
    search: undefined
  })

  /**
   * Buscar logs com filtros e paginação
   */
  const fetchLogs = async (filters?: ActivityLogFilters, page: number = 1) => {
    loading.value = true
    error.value = null

    try {
      // Atualizar filtros ativos
      if (filters) {
        activeFilters.value = { ...activeFilters.value, ...filters }
      }

      currentPage.value = page

      // Query base - apenas admins podem ver
      let query = supabase
        .from('user_activity_logs')
        .select('*, profile:profiles!user_activity_logs_user_id_fkey(*)', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (activeFilters.value.user_id) {
        query = query.eq('user_id', activeFilters.value.user_id)
      }

      if (activeFilters.value.activity_types && activeFilters.value.activity_types.length > 0) {
        query = query.in('activity_type', activeFilters.value.activity_types)
      }

      if (activeFilters.value.date_from) {
        query = query.gte('created_at', activeFilters.value.date_from)
      }

      if (activeFilters.value.date_to) {
        query = query.lte('created_at', activeFilters.value.date_to)
      }

      // Paginação
      const from = (page - 1) * logsPerPage
      const to = from + logsPerPage - 1
      query = query.range(from, to)

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      // Mapear dados com perfil
      logs.value = (data || []).map((log: any) => ({
        ...log,
        profile: log.profile || null
      }))

      totalLogs.value = count || 0
    } catch (err: any) {
      console.error('Erro ao buscar logs:', err)
      error.value = err.message
      logs.value = []
      totalLogs.value = 0
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar estatísticas de atividades
   */
  const fetchActivityStats = async () => {
    try {
      // Buscar total de logs por tipo de atividade
      const { data, error: fetchError } = await supabase
        .from('user_activity_logs')
        .select('activity_type')

      if (fetchError) throw fetchError

      // Contar por tipo
      const stats: Record<ActivityType, number> = {} as any

      data?.forEach((log: any) => {
        const type = log.activity_type as ActivityType
        stats[type] = (stats[type] || 0) + 1
      })

      return stats
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas:', err)
      return {}
    }
  }

  /**
   * Buscar logs de um usuário específico
   */
  const fetchUserLogs = async (userId: string, limit: number = 10) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (fetchError) throw fetchError

      return data || []
    } catch (err: any) {
      console.error('Erro ao buscar logs do usuário:', err)
      return []
    }
  }

  /**
   * Limpar filtros
   */
  const clearFilters = () => {
    activeFilters.value = {
      user_id: undefined,
      activity_types: undefined,
      date_from: undefined,
      date_to: undefined,
      search: undefined
    }
    fetchLogs({}, 1)
  }

  /**
   * Ir para página
   */
  const goToPage = (page: number) => {
    fetchLogs(activeFilters.value, page)
  }

  // Computed para paginação
  const totalPages = computed(() => Math.ceil(totalLogs.value / logsPerPage))
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  return {
    // Estado
    logs,
    loading,
    error,
    totalLogs,
    currentPage,
    logsPerPage,
    activeFilters,

    // Computed
    totalPages,
    hasNextPage,
    hasPrevPage,

    // Métodos
    fetchLogs,
    fetchActivityStats,
    fetchUserLogs,
    clearFilters,
    goToPage
  }
})
