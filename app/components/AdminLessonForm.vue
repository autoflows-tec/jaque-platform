<script setup lang="ts">
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import type { Lesson, LessonCreateInput, LessonUpdateInput } from '../../shared/types/Lesson'

interface AdminLessonFormProps {
  lesson?: Lesson | null
  moduleId: number
  isOpen: boolean
}

interface AdminLessonFormEmits {
  (e: 'close'): void
  (e: 'submit', data: LessonCreateInput | LessonUpdateInput): void
}

const props = defineProps<AdminLessonFormProps>()
const emit = defineEmits<AdminLessonFormEmits>()

const formData = ref({
  title: '',
  description: '',
  duration_minutes: null as number | null,
  thumbnail_url: '',
  order_index: 0,
  is_published: false,
  panda_video_id: '',
  panda_video_url: ''
})

const isEditMode = computed(() => !!props.lesson)

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    duration_minutes: null,
    thumbnail_url: '',
    order_index: 0,
    is_published: false,
    panda_video_id: '',
    panda_video_url: ''
  }
}

// Carregar dados da aula quando estiver editando
watch(() => props.lesson, (newLesson) => {
  if (newLesson) {
    formData.value = {
      title: newLesson.title,
      description: newLesson.description || '',
      duration_minutes: newLesson.duration_minutes,
      thumbnail_url: newLesson.thumbnail_url || '',
      order_index: newLesson.order_index,
      is_published: newLesson.is_published,
      panda_video_id: newLesson.panda_video_id || '',
      panda_video_url: newLesson.panda_video_url || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    alert('Título é obrigatório')
    return
  }

  const data: any = {
    title: formData.value.title,
    description: formData.value.description || null,
    duration_minutes: formData.value.duration_minutes,
    thumbnail_url: formData.value.thumbnail_url || null,
    order_index: formData.value.order_index,
    is_published: formData.value.is_published,
    panda_video_id: formData.value.panda_video_id || null,
    panda_video_url: formData.value.panda_video_url || null
  }

  // Adicionar module_id apenas se for criação (não edição)
  if (!isEditMode.value) {
    data.module_id = props.moduleId
  }

  emit('submit', data)
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="handleClose"
    >
      <div class="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-foreground">
            {{ isEditMode ? 'Editar Aula' : 'Nova Aula' }}
          </h2>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors"
            @click="handleClose"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <BaseInput
            id="lesson-title"
            v-model="formData.title"
            type="text"
            label="Título da Aula *"
            placeholder="Ex: Aula 1 - Introdução ao tema"
            required
          />

          <div>
            <label
              for="lesson-description"
              class="block text-sm font-medium text-foreground mb-2"
            >
              Descrição
            </label>
            <textarea
              id="lesson-description"
              v-model="formData.description"
              rows="4"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Descrição da aula..."
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <BaseInput
              id="lesson-duration"
              v-model.number="formData.duration_minutes"
              type="number"
              label="Duração (minutos)"
              placeholder="30"
              min="0"
            />

            <BaseInput
              id="lesson-order"
              v-model.number="formData.order_index"
              type="number"
              label="Ordem de Exibição"
              placeholder="0"
              min="0"
            />
          </div>

          <BaseInput
            id="lesson-thumbnail"
            v-model="formData.thumbnail_url"
            type="url"
            label="URL da Imagem de Capa"
            placeholder="https://exemplo.com/imagem.jpg"
          />

          <!-- Panda Video Section -->
          <div class="p-4 rounded-lg bg-muted/50 border border-border space-y-4">
            <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                />
              </svg>
              Integração Panda Video
            </h3>

            <BaseInput
              id="panda-video-id"
              v-model="formData.panda_video_id"
              type="text"
              label="ID do Vídeo Panda"
              placeholder="Será configurado futuramente"
            />

            <BaseInput
              id="panda-video-url"
              v-model="formData.panda_video_url"
              type="url"
              label="URL de Embed Panda Video"
              placeholder="Será configurado futuramente"
            />

            <p class="text-xs text-muted-foreground">
              💡 Os campos do Panda Video serão configurados quando a integração estiver ativa
            </p>
          </div>

          <div class="flex items-center gap-3">
            <input
              id="lesson-published"
              v-model="formData.is_published"
              type="checkbox"
              class="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label
              for="lesson-published"
              class="text-sm font-medium text-foreground cursor-pointer"
            >
              Publicar aula (tornar visível para alunas)
            </label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <BaseButton
              type="button"
              variant="ghost"
              @click="handleClose"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              type="submit"
              variant="accent"
            >
              {{ isEditMode ? 'Salvar Alterações' : 'Criar Aula' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
