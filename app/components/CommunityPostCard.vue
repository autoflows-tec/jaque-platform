<script setup lang="ts">
import BaseButton from '~/components/BaseButton.vue'
import CommunityCommentsList from '~/components/CommunityCommentsList.vue'
import type { CommunityPostWithAuthor } from '../../shared/types/Community'

interface CommunityPostCardProps {
  post: CommunityPostWithAuthor
  canDelete?: boolean
}

interface CommunityPostCardEmits {
  (e: 'like'): void
  (e: 'unlike'): void
  (e: 'delete'): void
}

const props = defineProps<CommunityPostCardProps>()
const emit = defineEmits<CommunityPostCardEmits>()

const showComments = ref(false)

// Formatar data
const formattedDate = computed(() => {
  const date = new Date(props.post.created_at)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return diffInMinutes < 1 ? 'Agora' : `${diffInMinutes}min atrás`
  }

  if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Avatar inicial
const authorInitial = computed(() => {
  return props.post.author?.name?.charAt(0).toUpperCase() || 'U'
})

const handleLikeClick = () => {
  if (props.post.user_has_liked) {
    emit('unlike')
  } else {
    emit('like')
  }
}

const handleDelete = () => {
  if (confirm('Tem certeza que deseja excluir esta publicação?')) {
    emit('delete')
  }
}

const toggleComments = () => {
  showComments.value = !showComments.value
}
</script>

<template>
  <div class="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
    <!-- Header do Post -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
          {{ authorInitial }}
        </div>

        <!-- Autor e Data -->
        <div>
          <h4 class="font-semibold text-foreground">
            {{ post.author?.name || 'Aluna' }}
          </h4>
          <p class="text-xs text-muted-foreground">
            {{ formattedDate }}
          </p>
        </div>
      </div>

      <!-- Botão Deletar (se for dono) -->
      <button
        v-if="canDelete"
        class="text-muted-foreground hover:text-destructive transition-colors"
        @click="handleDelete"
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
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>

    <!-- Conteúdo -->
    <p v-if="post.content" class="text-foreground whitespace-pre-wrap mb-4">
      {{ post.content }}
    </p>

    <!-- Media Gallery -->
    <div
      v-if="post.media_urls && post.media_urls.length > 0"
      class="mb-4 grid gap-2"
      :class="{
        'grid-cols-1': post.media_urls.length === 1,
        'grid-cols-2': post.media_urls.length > 1
      }"
    >
      <div
        v-for="(url, index) in post.media_urls"
        :key="index"
        class="relative aspect-video rounded-lg overflow-hidden bg-muted"
      >
        <!-- Detectar se é vídeo pela extensão -->
        <video
          v-if="url.match(/\.(mp4|webm|ogg|mov)$/i)"
          :src="url"
          class="w-full h-full object-cover"
          controls
          preload="metadata"
        />
        <img
          v-else
          :src="url"
          alt="Mídia do post"
          class="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          loading="lazy"
        >
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-6 pt-4 border-t border-border">
      <!-- Like Button -->
      <button
        class="flex items-center gap-2 text-sm transition-colors"
        :class="post.user_has_liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'"
        @click="handleLikeClick"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
          :fill="post.user_has_liked ? 'currentColor' : 'none'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span class="font-medium">{{ post.likes_count }}</span>
      </button>

      <!-- Comments Button -->
      <button
        class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        @click="toggleComments"
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
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
          />
        </svg>
        <span class="font-medium">{{ post.comments_count }}</span>
      </button>
    </div>

    <!-- Comments Section -->
    <CommunityCommentsList
      v-if="showComments"
      :post-id="post.id"
      class="mt-4 pt-4 border-t border-border"
    />
  </div>
</template>
