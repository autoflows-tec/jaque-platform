<script setup lang="ts">
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
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

const formData = ref({
  title: '',
  description: '',
  thumbnail_url: '',
  order_index: 0,
  is_published: false
})

const isEditMode = computed(() => !!props.module)

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    thumbnail_url: '',
    order_index: 0,
    is_published: false
  }
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
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    alert('Título é obrigatório')
    return
  }

  const data = {
    title: formData.value.title,
    description: formData.value.description || null,
    thumbnail_url: formData.value.thumbnail_url || null,
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

          <BaseInput
            id="module-thumbnail"
            v-model="formData.thumbnail_url"
            type="url"
            label="URL da Imagem de Capa"
            placeholder="https://exemplo.com/imagem.jpg"
          />

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
