<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import { useCommunityStore } from '~/stores/useCommunityStore'
import { useUserStore } from '~/stores/useUserStore'
import type { CommunityPostCommentWithAuthor } from '../../shared/types/Community'

interface CommunityCommentsListProps {
  postId: number
}

const props = defineProps<CommunityCommentsListProps>()

const communityStore = useCommunityStore()
const userStore = useUserStore()
const user = useSupabaseUser()

const comments = ref<CommunityPostCommentWithAuthor[]>([])
const newCommentContent = ref('')
const loading = ref(false)
const submitting = ref(false)

// Avatar inicial do usuário
const userInitial = computed(() => {
  return userStore.profile?.name?.charAt(0).toUpperCase() || 'U'
})

// Carregar comentários ao montar
onMounted(async () => {
  await loadComments()
})

const loadComments = async () => {
  loading.value = true
  comments.value = await communityStore.fetchComments(props.postId)
  loading.value = false
}

const handleSubmitComment = async () => {
  if (!newCommentContent.value.trim()) return

  submitting.value = true
  const result = await communityStore.createComment(props.postId, newCommentContent.value.trim())

  if (result.success && result.data) {
    comments.value.push(result.data)
    newCommentContent.value = ''
  }

  submitting.value = false
}

const handleDeleteComment = async (commentId: number) => {
  if (!confirm('Tem certeza que deseja excluir este comentário?')) return

  const result = await communityStore.deleteComment(commentId, props.postId)

  if (result.success) {
    comments.value = comments.value.filter(c => c.id !== commentId)
  }
}

// Verificar se comentário é do usuário atual
const isOwnComment = (comment: CommunityPostCommentWithAuthor) => {
  const userId = user.value?.id || user.value?.sub
  return userId === comment.user_id
}

// Formatar data do comentário
const formatCommentDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return diffInMinutes < 1 ? 'Agora' : `${diffInMinutes}min`
  }

  if (diffInHours < 24) {
    return `${diffInHours}h`
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

// Avatar inicial do comentário
const getCommentInitial = (comment: CommunityPostCommentWithAuthor) => {
  return comment.author?.name?.charAt(0).toUpperCase() || 'U'
}
</script>

<template>
  <div class="comments-section">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="text-center py-4"
    >
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
    </div>

    <!-- Comments List -->
    <div
      v-else
      class="space-y-4"
    >
      <!-- Existing Comments -->
      <div
        v-if="comments.length > 0"
        class="space-y-3"
      >
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-3"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
              {{ getCommentInitial(comment) }}
            </div>
          </div>

          <!-- Comment Content -->
          <div class="flex-1 bg-muted rounded-lg px-4 py-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-semibold text-foreground">
                {{ comment.author?.name || 'Aluna' }}
              </span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                  {{ formatCommentDate(comment.created_at) }}
                </span>
                <button
                  v-if="isOwnComment(comment)"
                  class="text-muted-foreground hover:text-destructive transition-colors"
                  @click="handleDeleteComment(comment.id)"
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-sm text-foreground whitespace-pre-wrap">
              {{ comment.content }}
            </p>
          </div>
        </div>
      </div>

      <!-- New Comment Form -->
      <div class="flex gap-3 pt-3">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
            {{ userInitial }}
          </div>
        </div>

        <!-- Input -->
        <div class="flex-1 flex gap-2">
          <input
            v-model="newCommentContent"
            type="text"
            class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            placeholder="Escreva um comentário..."
            :disabled="submitting"
            @keydown.enter="handleSubmitComment"
          />
          <BaseButton
            variant="accent"
            :disabled="!newCommentContent.trim() || submitting"
            @click="handleSubmitComment"
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
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
