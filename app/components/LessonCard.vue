<script setup lang="ts">
import type { Lesson } from '../../shared/types/Lesson'

interface LessonCardProps {
  lesson: Lesson
  isAdmin: boolean
}

interface LessonCardEmits {
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'play'): void
}

const props = defineProps<LessonCardProps>()
const emit = defineEmits<LessonCardEmits>()

const formatDuration = (minutes: number | null): string => {
  if (!minutes) return ''

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}

const handleEdit = (e: Event) => {
  e.stopPropagation()
  emit('edit')
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  if (confirm(`Tem certeza que deseja excluir a aula "${props.lesson.title}"?`)) {
    emit('delete')
  }
}

const handlePlay = () => {
  emit('play')
}
</script>

<template>
  <div
    class="lesson-card bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-all cursor-pointer group"
    @click="handlePlay"
  >
    <div class="flex items-start gap-4">
      <!-- Thumbnail/Play Icon -->
      <div
        class="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all"
      >
        <div
          v-if="lesson.thumbnail_url"
          class="absolute inset-0"
        >
          <img
            :src="lesson.thumbnail_url"
            :alt="lesson.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Play icon overlay -->
        <div class="relative z-10 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 text-primary-foreground ml-0.5"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h4 class="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {{ lesson.title }}
              <span
                v-if="isAdmin && !lesson.is_published"
                class="ml-2 text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
              >
                Rascunho
              </span>
            </h4>
            <p
              v-if="lesson.description"
              class="text-sm text-muted-foreground line-clamp-2 mb-2"
            >
              {{ lesson.description }}
            </p>

            <!-- Metadata -->
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
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
                {{ formatDuration(lesson.duration_minutes) }}
              </span>

              <span
                v-if="lesson.panda_video_id"
                class="flex items-center gap-1 text-primary"
              >
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Vídeo configurado
              </span>
            </div>
          </div>

          <!-- Botões admin -->
          <div
            v-if="isAdmin"
            class="flex items-center gap-2 shrink-0"
          >
            <button
              class="text-sm text-primary hover:text-primary/80 transition-colors"
              @click="handleEdit"
            >
              Editar
            </button>
            <button
              class="text-sm text-destructive hover:text-destructive/80 transition-colors"
              @click="handleDelete"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
