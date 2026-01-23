<script setup lang="ts">
import ModuleCard from '~/components/ModuleCard.vue'
import AdminModuleForm from '~/components/AdminModuleForm.vue'
import AdminLessonForm from '~/components/AdminLessonForm.vue'
import VideoPlayerModal from '~/components/VideoPlayerModal.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useModulesStore } from '~/stores/useModulesStore'
import { useUserStore } from '~/stores/useUserStore'
import type { Module } from '../../shared/types/Module'
import type { Lesson } from '../../shared/types/Lesson'

definePageMeta({
  layout: 'main-layout'
})

const modulesStore = useModulesStore()
const userStore = useUserStore()

// Estados dos modais
const showModuleForm = ref(false)
const showLessonForm = ref(false)
const showVideoModal = ref(false)
const editingModule = ref<Module | null>(null)
const editingLesson = ref<Lesson | null>(null)
const selectedLesson = ref<Lesson | null>(null)
const selectedModuleId = ref<number>(0)

// Verificar se é admin
const isAdmin = computed(() => {
  return userStore.profile?.role === 'admin'
})

// Carregar módulos e aulas ao montar
onMounted(async () => {
  await modulesStore.fetchModulesWithLessons()
})

// Handlers de módulo
const handleAddModule = () => {
  editingModule.value = null
  showModuleForm.value = true
}

const handleEditModule = (module: Module) => {
  editingModule.value = module
  showModuleForm.value = true
}

const handleDeleteModule = async (moduleId: number) => {
  const result = await modulesStore.deleteModule(moduleId)

  if (result.success) {
    console.log('Módulo deletado com sucesso')
  } else {
    alert('Erro ao deletar módulo: ' + result.error)
  }
}

const handleModuleFormSubmit = async (data: any) => {
  let result

  if (editingModule.value) {
    // Atualizar módulo existente
    result = await modulesStore.updateModule(editingModule.value.id, data)
  } else {
    // Criar novo módulo
    result = await modulesStore.createModule(data)
  }

  if (result.success) {
    showModuleForm.value = false
    editingModule.value = null
  } else {
    alert('Erro ao salvar módulo: ' + result.error)
  }
}

// Handlers de aula
const handleAddLesson = (moduleId: number) => {
  selectedModuleId.value = moduleId
  editingLesson.value = null
  showLessonForm.value = true
}

const handleEditLesson = (lesson: Lesson) => {
  editingLesson.value = lesson
  selectedModuleId.value = lesson.module_id
  showLessonForm.value = true
}

const handleDeleteLesson = async (lessonId: number, moduleId: number) => {
  const result = await modulesStore.deleteLesson(lessonId, moduleId)

  if (result.success) {
    console.log('Aula deletada com sucesso')
  } else {
    alert('Erro ao deletar aula: ' + result.error)
  }
}

const handleLessonFormSubmit = async (data: any) => {
  let result

  if (editingLesson.value) {
    // Atualizar aula existente
    result = await modulesStore.updateLesson(editingLesson.value.id, data)
  } else {
    // Criar nova aula
    result = await modulesStore.createLesson(data)
  }

  if (result.success) {
    showLessonForm.value = false
    editingLesson.value = null
  } else {
    alert('Erro ao salvar aula: ' + result.error)
  }
}

// Handler de play - integração com Panda Video
const handlePlayLesson = (lesson: Lesson) => {
  // Verificar se a aula tem vídeo configurado
  if (!lesson.panda_video_url || lesson.panda_video_url.trim() === '') {
    alert(`A aula "${lesson.title}" ainda não possui um vídeo configurado. Entre em contato com o administrador.`)
    return
  }

  // Abrir modal de vídeo
  selectedLesson.value = lesson
  showVideoModal.value = true
}

// Fechar modal de vídeo
const handleCloseVideoModal = () => {
  showVideoModal.value = false
  selectedLesson.value = null
}

// Handler de conclusão de aula
const handleLessonComplete = (lessonId: number) => {
  console.log('Aula concluída:', lessonId)
  // TODO: Implementar persistência no Supabase (futuro)
  // Atualmente apenas registra no console
}
</script>

<template>
  <div class="aulas-page">
    <!-- Header -->
    <div class="mb-6 md:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-foreground mb-2">Aulas</h1>
          <p class="text-sm md:text-base text-muted-foreground">
            Assista às aulas organizadas por módulos
          </p>
        </div>

        <!-- Botão adicionar módulo (visível apenas para admin) -->
        <BaseButton
          v-if="isAdmin"
          variant="accent"
          class="w-full sm:w-auto"
          @click="handleAddModule"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span class="hidden sm:inline">Adicionar Módulo</span>
          <span class="sm:hidden">Novo Módulo</span>
        </BaseButton>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="modulesStore.loading && modulesStore.modules.length === 0"
      class="text-center py-12"
    >
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="text-muted-foreground mt-4">Carregando módulos...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="modulesStore.error"
      class="text-center py-12"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-destructive mx-auto mb-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p class="text-destructive font-medium">Erro ao carregar módulos</p>
      <p class="text-muted-foreground text-sm mt-2">{{ modulesStore.error }}</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="modulesStore.modules.length === 0"
      class="text-center py-12"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <p class="text-muted-foreground font-medium">Nenhum módulo disponível</p>
      <p
        v-if="isAdmin"
        class="text-sm text-muted-foreground mt-2"
      >
        Clique em "Adicionar Módulo" para começar
      </p>
    </div>

    <!-- Lista de módulos -->
    <div
      v-else
      class="space-y-6"
    >
      <ModuleCard
        v-for="module in modulesStore.modules"
        :key="module.id"
        :module="module"
        :lessons="modulesStore.lessonsByModule[module.id] || []"
        :is-admin="isAdmin"
        @edit-module="handleEditModule"
        @delete-module="handleDeleteModule"
        @add-lesson="handleAddLesson"
        @edit-lesson="handleEditLesson"
        @delete-lesson="handleDeleteLesson"
        @play-lesson="handlePlayLesson"
        @lesson-complete="handleLessonComplete"
      />
    </div>

    <!-- Modais -->
    <AdminModuleForm
      :module="editingModule"
      :is-open="showModuleForm"
      @close="showModuleForm = false"
      @submit="handleModuleFormSubmit"
    />

    <AdminLessonForm
      :lesson="editingLesson"
      :module-id="selectedModuleId"
      :is-open="showLessonForm"
      @close="showLessonForm = false"
      @submit="handleLessonFormSubmit"
    />

    <!-- Modal de Player de Vídeo -->
    <VideoPlayerModal
      :lesson="selectedLesson"
      :show="showVideoModal"
      @close="handleCloseVideoModal"
    />
  </div>
</template>
