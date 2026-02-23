import type { ActivityType, ActivityLogCreateInput } from '../../shared/types/ActivityLog'

/**
 * Composable para registrar atividades do usuário
 */
export const useActivityLogger = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  /**
   * Registra uma atividade do usuário
   */
  const logActivity = async (
    activityType: ActivityType,
    activityData: Record<string, any> = {},
    metadata: Record<string, any> = {}
  ): Promise<void> => {
    try {
      // Apenas registra se o usuário estiver autenticado
      if (!user.value?.id) {
        return
      }

      const logInput: ActivityLogCreateInput = {
        user_id: user.value.id,
        activity_type: activityType,
        activity_data: activityData,
        metadata: {
          ...metadata,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      }

      const { error } = await supabase
        .from('user_activity_logs')
        .insert(logInput)

      if (error) {
        console.error('Erro ao registrar log de atividade:', error)
      }
    } catch (err) {
      console.error('Erro ao registrar log de atividade:', err)
    }
  }

  return {
    logActivity
  }
}
