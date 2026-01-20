<script setup lang="ts">
import LessonCard from '~/components/LessonCard.vue'
import BaseButton from '~/components/BaseButton.vue'
import type { Module } from '../../shared/types/Module'
import type { Lesson } from '../../shared/types/Lesson'

interface ModuleCardProps {
  module: Module
  lessons: Lesson[]
  isAdmin: boolean
}

interface ModuleCardEmits {
  (e: 'editModule', module: Module): void
  (e: 'deleteModule', moduleId: number): void
  (e: 'addLesson', moduleId: number): void
  (e: 'editLesson', lesson: Lesson): void
  (e: 'deleteLesson', lessonId: number, moduleId: number): void
  (e: 'playLesson', lesson: Lesson): void
}

const props = defineProps<ModuleCardProps>()
const emit = defineEmits<ModuleCardEmits>()

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleEditModule = () => {
  emit('editModule', props.module)
}

const handleDeleteModule = () => {
  if (confirm(`Tem certeza que deseja excluir o módulo "${props.module.title}"?`)) {
    emit('deleteModule', props.module.id)
  }
}

const handleAddLesson = () => {
  emit('addLesson', props.module.id)
}

const publishedLessons = computed(() => {
  return props.lessons.filter(l => l.is_published)
})

const lessonsToShow = computed(() => {
  return props.isAdmin ? props.lessons : publishedLessons.value
})
</script>

<template>
  <div class="module-card bg-card rounded-lg shadow-lg border border-border overflow-hidden">
    <!-- Header do módulo -->
    <div
      class="module-header p-6 cursor-pointer hover:bg-card/80 transition-colors"
      @click="toggleExpand"
    >
      <div class="flex items-start gap-4">
        <!-- Thumbnail -->
        <div
          v-if="module.thumbnail_url"
          class="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted"
        >
          <img
            :src="module.thumbnail_url"
            :alt="module.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 shrink-0 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-10 h-10 text-primary"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-foreground mb-2">
                {{ module.title }}
                <span
                  v-if="isAdmin && !module.is_published"
                  class="ml-2 text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                >
                  Rascunho
                </span>
              </h3>
              <p
                v-if="module.description"
                class="text-sm text-muted-foreground line-clamp-2"
              >
                {{ module.description }}
              </p>
            </div>

            <!-- Ícone expandir/recolher -->
            <div class="shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6 text-muted-foreground transition-transform"
                :class="{ 'rotate-180': isExpanded }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>

          <!-- Footer com contador de aulas -->
          <div class="mt-3 flex items-center justify-between">
            <span class="text-sm text-muted-foreground">
              {{ lessonsToShow.length }} {{ lessonsToShow.length === 1 ? 'aula' : 'aulas' }}
            </span>

            <!-- Botões admin (visível apenas para admin) -->
            <div
              v-if="isAdmin"
              class="flex items-center gap-2"
              @click.stop
            >
              <button
                class="text-sm text-primary hover:text-primary/80 transition-colors"
                @click="handleEditModule"
              >
                Editar
              </button>
              <button
                class="text-sm text-destructive hover:text-destructive/80 transition-colors"
                @click="handleDeleteModule"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de aulas (expandível) -->
    <div
      v-if="isExpanded"
      class="lessons-list border-t border-border bg-muted/20 p-6"
    >
      <div class="space-y-3">
        <!-- Botão adicionar aula (visível apenas para admin) -->
        <div v-if="isAdmin" class="mb-4">
          <BaseButton
            variant="outline"
            class="w-full"
            @click="handleAddLesson"
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
            Adicionar Aula
          </BaseButton>
        </div>

        <!-- Lista de aulas -->
        <LessonCard
          v-for="lesson in lessonsToShow"
          :key="lesson.id"
          :lesson="lesson"
          :is-admin="isAdmin"
          @edit="emit('editLesson', lesson)"
          @delete="emit('deleteLesson', lesson.id, module.id)"
          @play="emit('playLesson', lesson)"
        />

        <!-- Empty state -->
        <div
          v-if="lessonsToShow.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-12 h-12 mx-auto mb-3 opacity-50"
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
          <p class="text-sm">
            {{ isAdmin ? 'Nenhuma aula cadastrada ainda' : 'Nenhuma aula disponível' }}
          </p>
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
