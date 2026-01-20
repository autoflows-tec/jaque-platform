import { defineStore } from 'pinia'
import type { Module, ModuleCreateInput, ModuleUpdateInput } from '../../shared/types/Module'
import type { Lesson, LessonCreateInput, LessonUpdateInput } from '../../shared/types/Lesson'

export const useModulesStore = defineStore('modules', () => {
  const supabase = useSupabaseClient()

  const modules = ref<Module[]>([])
  const lessonsByModule = ref<Record<number, Lesson[]>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Buscar todos os módulos
  const fetchModules = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true })

      if (fetchError) throw fetchError

      modules.value = data || []
    } catch (err: any) {
      console.error('Erro ao buscar módulos:', err)
      error.value = err.message
      modules.value = []
    } finally {
      loading.value = false
    }
  }

  // Buscar aulas de um módulo específico
  const fetchLessonsByModule = async (moduleId: number) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true })

      if (fetchError) throw fetchError

      lessonsByModule.value[moduleId] = data || []
    } catch (err: any) {
      console.error(`Erro ao buscar aulas do módulo ${moduleId}:`, err)
      error.value = err.message
      lessonsByModule.value[moduleId] = []
    } finally {
      loading.value = false
    }
  }

  // Buscar todos os módulos com suas aulas
  const fetchModulesWithLessons = async () => {
    await fetchModules()

    // Buscar aulas de cada módulo
    for (const module of modules.value) {
      await fetchLessonsByModule(module.id)
    }
  }

  // Criar novo módulo (admin only)
  const createModule = async (input: ModuleCreateInput) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('modules')
        .insert(input)
        .select()
        .single()

      if (insertError) throw insertError

      // Adicionar ao array local
      modules.value.push(data)

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao criar módulo:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Atualizar módulo (admin only)
  const updateModule = async (id: number, input: ModuleUpdateInput) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('modules')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Atualizar no array local
      const index = modules.value.findIndex(m => m.id === id)
      if (index !== -1) {
        modules.value[index] = data
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao atualizar módulo:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Deletar módulo (admin only)
  const deleteModule = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('modules')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Remover do array local
      modules.value = modules.value.filter(m => m.id !== id)
      delete lessonsByModule.value[id]

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar módulo:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Criar nova aula (admin only)
  const createLesson = async (input: LessonCreateInput) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('lessons')
        .insert(input)
        .select()
        .single()

      if (insertError) throw insertError

      // Adicionar ao array local do módulo
      if (!lessonsByModule.value[input.module_id]) {
        lessonsByModule.value[input.module_id] = []
      }
      lessonsByModule.value[input.module_id].push(data)

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao criar aula:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Atualizar aula (admin only)
  const updateLesson = async (id: number, input: LessonUpdateInput) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('lessons')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Atualizar no array local
      const moduleId = data.module_id
      if (lessonsByModule.value[moduleId]) {
        const index = lessonsByModule.value[moduleId].findIndex(l => l.id === id)
        if (index !== -1) {
          lessonsByModule.value[moduleId][index] = data
        }
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Erro ao atualizar aula:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Deletar aula (admin only)
  const deleteLesson = async (id: number, moduleId: number) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Remover do array local
      if (lessonsByModule.value[moduleId]) {
        lessonsByModule.value[moduleId] = lessonsByModule.value[moduleId].filter(l => l.id !== id)
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar aula:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Limpar estado
  const clearState = () => {
    modules.value = []
    lessonsByModule.value = {}
    error.value = null
  }

  return {
    modules,
    lessonsByModule,
    loading,
    error,
    fetchModules,
    fetchLessonsByModule,
    fetchModulesWithLessons,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    clearState
  }
})
