<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { Lesson } from '../../shared/types/Lesson'

interface Props {
  lesson: Lesson | null
  show: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Fechar modal com ESC
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Verificar se vídeo está configurado
const hasVideo = computed(() => {
  return props.lesson?.panda_video_url && props.lesson.panda_video_url.trim() !== ''
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show && lesson"
      id="video-player-modal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="relative w-full max-w-6xl bg-card rounded-lg shadow-2xl overflow-hidden">
        <!-- Botão de fechar -->
        <button
          class="absolute top-4 right-4 z-20 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          @click="emit('close')"
        >
          <XMarkIcon class="w-6 h-6 text-foreground" />
        </button>

        <!-- Container do vídeo -->
        <div v-if="hasVideo" class="relative w-full bg-black">
          <!-- Aspect ratio 16:9 -->
          <div class="relative w-full" style="padding-bottom: 56.25%;">
            <iframe
              :src="lesson.panda_video_url!"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Fallback se vídeo não estiver configurado -->
        <div
          v-else
          class="w-full bg-muted/20 flex items-center justify-center"
          style="padding-bottom: 56.25%; position: relative;"
        >
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-16 h-16 text-muted-foreground mb-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p class="text-foreground font-semibold mb-2">Vídeo não configurado</p>
            <p class="text-sm text-muted-foreground text-center max-w-md">
              Esta aula ainda não possui um vídeo vinculado. Entre em contato com o administrador.
            </p>
          </div>
        </div>

        <!-- Informações da aula -->
        <div class="p-6 border-t border-border">
          <h2 class="text-2xl font-bold text-foreground mb-2">
            {{ lesson.title }}
          </h2>

          <p
            v-if="lesson.description"
            class="text-muted-foreground"
          >
            {{ lesson.description }}
          </p>

          <!-- Metadata -->
          <div class="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span v-if="lesson.duration_minutes" class="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ lesson.duration_minutes }} min
            </span>

            <span v-if="hasVideo" class="flex items-center gap-1 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
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
              Panda Video
            </span>
          </div>

          <!-- Dica para fechar -->
          <div class="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            💡 Dica: Pressione <kbd class="px-2 py-1 bg-background rounded border border-border font-mono">ESC</kbd> ou clique no X para fechar
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

kbd {
  font-size: 0.75rem;
}
</style>
