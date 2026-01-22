<script setup lang="ts">
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useImageUpload } from '~/composables/useImageUpload'
import type { Module, ModuleCreateInput, ModuleUpdateInput } from '../../shared/types/Module'

interface AdminModuleFormProps {
  module?: Module | null
  isOpen: boolean
}

interface AdminModuleFormEmits {
  (e: 'close'): void
  (e: 'submit', data: ModuleCreateInput | ModuleUpdateInput): void
}

const props = defineProps<AdminModuleFormProps>()
const emit = defineEmits<AdminModuleFormEmits>()

const { uploading, uploadImage, deleteImage } = useImageUpload()

const formData = ref({
  title: '',
  description: '',
  thumbnail_url: '',
  order_index: 0,
  is_published: false
})

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const oldThumbnailUrl = ref<string>('')

const isEditMode = computed(() => !!props.module)

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    thumbnail_url: '',
    order_index: 0,
    is_published: false
  }
  selectedFile.value = null
  previewUrl.value = ''
  oldThumbnailUrl.value = ''
}

// Carregar dados do módulo quando estiver editando
watch(() => props.module, (newModule) => {
  if (newModule) {
    formData.value = {
      title: newModule.title,
      description: newModule.description || '',
      thumbnail_url: newModule.thumbnail_url || '',
      order_index: newModule.order_index,
      is_published: newModule.is_published
    }
    oldThumbnailUrl.value = newModule.thumbnail_url || ''
    previewUrl.value = newModule.thumbnail_url || ''
  } else {
    resetForm()
  }
}, { immediate: true })

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    selectedFile.value = file

    // Criar preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedFile.value = null
  previewUrl.value = ''
  formData.value.thumbnail_url = ''
}

const handleSubmit = async () => {
  if (!formData.value.title.trim()) {
    alert('Título é obrigatório')
    return
  }

  let thumbnailUrl = formData.value.thumbnail_url

  // Se selecionou nova imagem, fazer upload
  if (selectedFile.value) {
    const result = await uploadImage(selectedFile.value, 'thumbnails', 'modules')

    if (!result.success) {
      alert(result.error || 'Erro ao fazer upload da imagem')
      return
    }

    thumbnailUrl = result.url || null

    // Se está editando e tinha imagem antiga, deletar do storage
    if (isEditMode.value && oldThumbnailUrl.value && oldThumbnailUrl.value !== thumbnailUrl) {
      await deleteImage(oldThumbnailUrl.value)
    }
  }

  const data = {
    title: formData.value.title,
    description: formData.value.description || null,
    thumbnail_url: thumbnailUrl || null,
    order_index: formData.value.order_index,
    is_published: formData.value.is_published
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
            {{ isEditMode ? 'Editar Módulo' : 'Novo Módulo' }}
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
            id="module-title"
            v-model="formData.title"
            type="text"
            label="Título do Módulo *"
            placeholder="Ex: Módulo 1 - Introdução"
            required
          />

          <div>
            <label
              for="module-description"
              class="block text-sm font-medium text-foreground mb-2"
            >
              Descrição
            </label>
            <textarea
              id="module-description"
              v-model="formData.description"
              rows="4"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Descrição do módulo..."
            />
          </div>

          <!-- Upload de Imagem -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Imagem de Capa
            </label>

            <!-- Preview da imagem -->
            <div v-if="previewUrl" class="mb-3 relative">
              <img
                :src="previewUrl"
                alt="Preview"
                class="w-full h-48 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                @click="removeImage"
                class="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Botão de upload -->
            <label
              for="module-thumbnail-upload"
              class="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': uploading }"
            >
              <svg
                v-if="!uploading"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5 text-muted-foreground"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
              <div
                v-else
                class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"
              ></div>
              <span class="text-sm text-muted-foreground">
                {{ uploading ? 'Fazendo upload...' : previewUrl ? 'Alterar imagem' : 'Escolher imagem do computador' }}
              </span>
            </label>
            <input
              id="module-thumbnail-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              class="hidden"
              :disabled="uploading"
              @change="handleFileSelect"
            />
            <p class="text-xs text-muted-foreground mt-2">
              Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 5MB.
            </p>
          </div>

          <BaseInput
            id="module-order"
            v-model.number="formData.order_index"
            type="number"
            label="Ordem de Exibição"
            placeholder="0"
            min="0"
          />

          <div class="flex items-center gap-3">
            <input
              id="module-published"
              v-model="formData.is_published"
              type="checkbox"
              class="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label
              for="module-published"
              class="text-sm font-medium text-foreground cursor-pointer"
            >
              Publicar módulo (tornar visível para alunas)
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
              {{ isEditMode ? 'Salvar Alterações' : 'Criar Módulo' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
