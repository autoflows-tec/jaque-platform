<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import LessonListItem from '~/components/LessonListItem.vue'
import type { Module } from '../../shared/types/Module'
import type { Lesson } from '../../shared/types/Lesson'

interface Props {
  module: Module
  lessons: Lesson[]
  initialLessonIndex?: number
  isAdmin?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'lessonComplete', lessonId: number): void
  (e: 'editLesson', lesson: Lesson): void
  (e: 'deleteLesson', lessonId: number, moduleId: number): void
  (e: 'addLesson', moduleId: number): void
}

const props = withDefaults(defineProps<Props>(), {
  initialLessonIndex: 0,
  isAdmin: false
})

const emit = defineEmits<Emits>()

// Estado
const currentIndex = ref(props.initialLessonIndex)
const completedLessons = ref<number[]>([])

// Computed
const currentLesson = computed(() => props.lessons[currentIndex.value])
const hasVideo = computed(() => {
  return currentLesson.value?.panda_video_url && currentLesson.value.panda_video_url.trim() !== ''
})

const totalDuration = computed(() => {
  return props.lessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0)
})

const canGoPrevious = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < props.lessons.length - 1)

const progressPercentage = computed(() => {
  if (props.lessons.length === 0) return 0
  return Math.round((completedLessons.value.length / props.lessons.length) * 100)
})

// Métodos
const selectLesson = (index: number) => {
  currentIndex.value = index
}

const previousLesson = () => {
  if (canGoPrevious.value) {
    currentIndex.value--
  }
}

const nextLesson = () => {
  if (canGoNext.value) {
    currentIndex.value++
  }
}

const toggleComplete = () => {
  const lessonId = currentLesson.value.id
  const index = completedLessons.value.indexOf(lessonId)

  if (index > -1) {
    // Remover da lista
    completedLessons.value.splice(index, 1)
  } else {
    // Adicionar à lista
    completedLessons.value.push(lessonId)
    emit('lessonComplete', lessonId)
  }
}

const isLessonCompleted = (lessonId: number) => {
  return completedLessons.value.includes(lessonId)
}

const formatTotalDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}

// Handlers admin
const handleEditLesson = () => {
  emit('editLesson', currentLesson.value)
}

const handleDeleteLesson = () => {
  if (confirm(`Tem certeza que deseja excluir a aula "${currentLesson.value.title}"?`)) {
    emit('deleteLesson', currentLesson.value.id, currentLesson.value.module_id)
  }
}

const handleAddLesson = () => {
  emit('addLesson', props.module.id)
}
</script>

<template>
  <div id="module-player-view" class="module-player-view bg-card rounded-lg shadow-lg border border-border overflow-hidden">
    <!-- Layout 2 colunas -->
    <div class="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-0">
      <!-- Coluna Esquerda: Player + Info -->
      <div class="player-column border-r border-border">
        <!-- Player de Vídeo -->
        <div class="relative w-full bg-black">
          <!-- Aspect ratio 16:9 -->
          <div class="relative w-full" style="padding-bottom: 56.25%;">
            <iframe
              v-if="hasVideo"
              :key="currentLesson.id"
              :src="currentLesson.panda_video_url!"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>

            <!-- Fallback se vídeo não configurado -->
            <div
              v-else
              class="absolute inset-0 flex flex-col items-center justify-center p-8 bg-muted/20"
            >
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
                Esta aula ainda não possui um vídeo vinculado.
              </p>
            </div>
          </div>
        </div>

        <!-- Info da Aula -->
        <div class="p-6 space-y-4">
          <!-- Título e Navegação -->
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-start justify-between gap-3 mb-2">
                <h2 class="text-xl md:text-2xl font-bold text-foreground">
                  {{ currentLesson.title }}
                  <span
                    v-if="isAdmin && !currentLesson.is_published"
                    class="ml-2 text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                  >
                    Rascunho
                  </span>
                </h2>

                <!-- Botões admin -->
                <div
                  v-if="isAdmin"
                  class="flex items-center gap-2 shrink-0"
                >
                  <button
                    class="text-sm text-primary hover:text-primary/80 transition-colors px-3 py-1 rounded hover:bg-primary/10"
                    @click="handleEditLesson"
                  >
                    Editar
                  </button>
                  <button
                    class="text-sm text-destructive hover:text-destructive/80 transition-colors px-3 py-1 rounded hover:bg-destructive/10"
                    @click="handleDeleteLesson"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              <p v-if="currentLesson.description" class="text-muted-foreground text-sm">
                {{ currentLesson.description }}
              </p>
            </div>

            <!-- Contador -->
            <div class="text-right shrink-0">
              <div class="text-2xl font-bold text-primary">
                {{ currentIndex + 1 }}/{{ lessons.length }}
              </div>
              <div class="text-xs text-muted-foreground">aulas</div>
            </div>
          </div>

          <!-- Navegação -->
          <div class="flex items-center gap-3">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="canGoPrevious
                ? 'border-border hover:bg-muted'
                : 'border-border/50 cursor-not-allowed'"
              :disabled="!canGoPrevious"
              @click="previousLesson"
            >
              <ChevronLeftIcon class="w-4 h-4" />
              <span class="text-sm font-medium">Anterior</span>
            </button>

            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="canGoNext
                ? 'border-border hover:bg-muted'
                : 'border-border/50 cursor-not-allowed'"
              :disabled="!canGoNext"
              @click="nextLesson"
            >
              <span class="text-sm font-medium">Próxima</span>
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Ações -->
          <div class="flex items-center gap-3 pt-4 border-t border-border">
            <!-- Marcar como concluída -->
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              :class="isLessonCompleted(currentLesson.id)
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-muted text-foreground hover:bg-muted/80'"
              @click="toggleComplete"
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
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm font-medium">
                {{ isLessonCompleted(currentLesson.id) ? 'Concluída' : 'Marcar como concluída' }}
              </span>
            </button>

            <!-- Material (placeholder) -->
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
              disabled
            >
              <DocumentTextIcon class="w-5 h-5" />
              <span class="text-sm font-medium">Material</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Lista de Aulas -->
      <div class="lessons-column bg-muted/20 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <!-- Header -->
        <div class="mb-4 pb-4 border-b border-border">
          <h3 class="font-bold text-foreground mb-2">{{ module.title }}</h3>
          <div class="flex items-center gap-3 text-xs text-muted-foreground">
            <span class="flex items-center gap-1">
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
              {{ lessons.length }} {{ lessons.length === 1 ? 'aula' : 'aulas' }}
            </span>
            <span v-if="totalDuration > 0" class="flex items-center gap-1">
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
              {{ formatTotalDuration(totalDuration) }}
            </span>
          </div>

          <!-- Progresso -->
          <div class="mt-3">
            <div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso</span>
              <span>{{ progressPercentage }}%</span>
            </div>
            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary transition-all duration-300"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Botão adicionar aula (visível apenas para admin) -->
        <div v-if="isAdmin" class="mb-4">
          <button
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
            @click="handleAddLesson"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Adicionar Aula
          </button>
        </div>

        <!-- Lista de Aulas -->
        <div class="space-y-2">
          <LessonListItem
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            :lesson="lesson"
            :index="index"
            :active="index === currentIndex"
            :completed="isLessonCompleted(lesson.id)"
            @click="selectLesson(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scroll customizado para a lista de aulas */
.lessons-column::-webkit-scrollbar {
  width: 6px;
}

.lessons-column::-webkit-scrollbar-track {
  background: transparent;
}

.lessons-column::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

.lessons-column::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
