<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import { useUserStore } from '~/stores/useUserStore'

interface CommunityPostFormEmits {
  (e: 'submit', content: string): void
}

const emit = defineEmits<CommunityPostFormEmits>()
const userStore = useUserStore()

const content = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!content.value.trim()) {
    return
  }

  emit('submit', content.value.trim())
  content.value = ''
}

// Avatar inicial do usuário
const userInitial = computed(() => {
  return userStore.profile?.name?.charAt(0).toUpperCase() || 'U'
})
</script>

<template>
  <div class="bg-card rounded-lg border border-border p-6 mb-6">
    <div class="flex gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
          {{ userInitial }}
        </div>
      </div>

      <!-- Form -->
      <div class="flex-1">
        <textarea
          id="post-content"
          v-model="content"
          rows="3"
          class="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
          placeholder="Compartilhe sua jornada com a comunidade..."
          :disabled="isSubmitting"
        />

        <div class="flex items-center justify-between mt-3">
          <p class="text-xs text-muted-foreground">
            {{ content.length }} / 1000 caracteres
          </p>

          <BaseButton
            variant="accent"
            :disabled="!content.trim() || content.length > 1000 || isSubmitting"
            @click="handleSubmit"
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
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            {{ isSubmitting ? 'Publicando...' : 'Publicar' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
