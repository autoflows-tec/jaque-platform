<script setup lang="ts">
import { ClockIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { PlayCircleIcon } from '@heroicons/vue/24/outline'
import type { Lesson } from '../../shared/types/Lesson'

interface Props {
  lesson: Lesson
  active?: boolean
  completed?: boolean
  index: number
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  completed: false
})

const emit = defineEmits<Emits>()

const formatDuration = (minutes: number | null): string => {
  if (!minutes) return ''

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}
</script>

<template>
  <div
    id="lesson-list-item"
    class="lesson-list-item flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border"
    :class="{
      'bg-primary/10 border-primary': active,
      'bg-card border-border hover:bg-muted/50': !active
    }"
    @click="emit('click')"
  >
    <!-- Status Icon -->
    <div class="flex-shrink-0 mt-0.5">
      <CheckCircleIcon
        v-if="completed"
        class="w-5 h-5 text-green-500"
      />
      <PlayCircleIcon
        v-else-if="active"
        class="w-5 h-5 text-primary"
      />
      <div
        v-else
        class="w-5 h-5 rounded-full border-2 border-muted-foreground/30"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <h4
          class="text-sm font-medium line-clamp-2"
          :class="{
            'text-primary font-semibold': active,
            'text-foreground': !active
          }"
        >
          {{ index + 1 }}. {{ lesson.title }}
        </h4>
      </div>

      <!-- Metadata -->
      <div class="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        <span v-if="lesson.duration_minutes" class="flex items-center gap-1">
          <ClockIcon class="w-3 h-3" />
          {{ formatDuration(lesson.duration_minutes) }}
        </span>

        <span
          v-if="lesson.panda_video_id"
          class="flex items-center gap-1"
          :class="{ 'text-primary': active }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-3 h-3"
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
          Vídeo
        </span>
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
