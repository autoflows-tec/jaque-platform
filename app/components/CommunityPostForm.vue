<script setup lang="ts">
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/BaseButton.vue'
import { useUserStore } from '~/stores/useUserStore'

interface CommunityPostFormEmits {
  (e: 'submit', content: string, mediaFiles: File[]): void
}

const emit = defineEmits<CommunityPostFormEmits>()
const userStore = useUserStore()

const content = ref('')
const isSubmitting = ref(false)
const mediaFiles = ref<File[]>([])
const mediaPreview = ref<string[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleSubmit = () => {
  if (!content.value.trim() && mediaFiles.value.length === 0) {
    return
  }

  emit('submit', content.value.trim(), mediaFiles.value)
  content.value = ''
  mediaFiles.value = []
  mediaPreview.value = []
}

// Avatar inicial do usuário
const userInitial = computed(() => {
  return userStore.profile?.name?.charAt(0).toUpperCase() || 'U'
})

// Handler para seleção de arquivos
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files).filter(file => {
      // Aceitar apenas imagens e vídeos
      return file.type.startsWith('image/') || file.type.startsWith('video/')
    })

    // Limitar a 4 arquivos no total
    if (mediaFiles.value.length + newFiles.length > 4) {
      alert('Você pode adicionar no máximo 4 mídias por post')
      return
    }

    // Limitar tamanho individual a 50MB
    const maxSize = 50 * 1024 * 1024 // 50MB
    const oversizedFiles = newFiles.filter(f => f.size > maxSize)
    if (oversizedFiles.length > 0) {
      alert('Cada arquivo deve ter no máximo 50MB')
      return
    }

    // Adicionar arquivos
    mediaFiles.value.push(...newFiles)

    // Criar previews
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        mediaPreview.value.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  // Reset input
  if (target) {
    target.value = ''
  }
}

// Remover mídia
const removeMedia = (index: number) => {
  mediaFiles.value.splice(index, 1)
  mediaPreview.value.splice(index, 1)
}

// Abrir file picker
const openFilePicker = () => {
  fileInputRef.value?.click()
}

// Check se arquivo é vídeo
const isVideo = (file: File) => {
  return file.type.startsWith('video/')
}
</script>

<template>
  <div class="bg-card rounded-lg border border-border p-4 md:p-6 mb-6">
    <div class="flex gap-3 md:gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm md:text-base">
          {{ userInitial }}
        </div>
      </div>

      <!-- Form -->
      <div class="flex-1 min-w-0">
        <textarea
          id="post-content"
          v-model="content"
          rows="3"
          class="w-full rounded-md border border-input bg-background px-3 md:px-4 py-2 md:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Compartilhe sua jornada com a comunidade..."
          :disabled="isSubmitting"
        />

        <!-- Media Previews -->
        <div
          v-if="mediaPreview.length > 0"
          class="grid grid-cols-2 gap-2 mt-3"
          :class="mediaPreview.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
        >
          <div
            v-for="(preview, index) in mediaPreview"
            :key="index"
            class="relative aspect-video rounded-lg overflow-hidden bg-muted"
          >
            <!-- Preview de imagem -->
            <img
              v-if="mediaFiles[index] && !isVideo(mediaFiles[index])"
              :src="preview"
              alt="Preview"
              class="w-full h-full object-cover"
            >

            <!-- Preview de vídeo -->
            <video
              v-else-if="mediaFiles[index]"
              :src="preview"
              class="w-full h-full object-cover"
              controls
            />

            <!-- Botão remover -->
            <button
              class="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
              @click="removeMedia(index)"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between mt-3 gap-2">
          <!-- Botões de mídia -->
          <div class="flex items-center gap-2">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*,video/*"
              multiple
              class="hidden"
              @change="handleFileSelect"
            >

            <button
              type="button"
              class="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
              :disabled="isSubmitting || mediaFiles.length >= 4"
              @click="openFilePicker"
            >
              <PhotoIcon class="w-5 h-5" />
            </button>

            <p class="text-xs text-muted-foreground hidden md:block">
              {{ content.length }} / 1000
            </p>
          </div>

          <!-- Botão Publicar -->
          <BaseButton
            variant="accent"
            :disabled="(!content.trim() && mediaFiles.length === 0) || content.length > 1000 || isSubmitting"
            @click="handleSubmit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4 md:w-5 md:h-5 md:mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            <span class="hidden md:inline">{{ isSubmitting ? 'Publicando...' : 'Publicar' }}</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
