<script setup lang="ts">
import CommunityPostForm from '~/components/CommunityPostForm.vue'
import CommunityPostCard from '~/components/CommunityPostCard.vue'
import { useCommunityStore } from '~/stores/useCommunityStore'

definePageMeta({
  layout: 'main-layout'
})

const communityStore = useCommunityStore()
const user = useSupabaseUser()

// Carregar posts ao montar
onMounted(async () => {
  await communityStore.fetchPosts()
})

// Criar novo post
const handleCreatePost = async (content: string) => {
  const result = await communityStore.createPost(content)
  if (!result.success) {
    alert('Erro ao criar publicação. Tente novamente.')
  }
}

// Curtir post
const handleLikePost = async (postId: number) => {
  await communityStore.likePost(postId)
}

// Descurtir post
const handleUnlikePost = async (postId: number) => {
  await communityStore.unlikePost(postId)
}

// Deletar post
const handleDeletePost = async (postId: number) => {
  const result = await communityStore.deletePost(postId)
  if (!result.success) {
    alert('Erro ao deletar publicação.')
  }
}

// Verificar se post é do usuário atual
const isOwnPost = (post: any) => {
  const userId = user.value?.id || user.value?.sub
  return userId === post.user_id
}
</script>

<template>
  <div class="comunidade-page">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Comunidade</h1>
      <p class="text-muted-foreground">
        Compartilhe sua jornada e conecte-se com outras alunas
      </p>
    </div>

    <!-- Form para criar post -->
    <CommunityPostForm @submit="handleCreatePost" />

    <!-- Loading state -->
    <div
      v-if="communityStore.loading && communityStore.posts.length === 0"
      class="text-center py-12"
    >
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="text-muted-foreground mt-4">Carregando publicações...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="communityStore.error && communityStore.posts.length === 0"
      class="text-center py-12"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-destructive mx-auto mb-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p class="text-destructive font-medium">Erro ao carregar publicações</p>
      <p class="text-muted-foreground text-sm mt-2">{{ communityStore.error }}</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="communityStore.posts.length === 0"
      class="text-center py-12 bg-card rounded-lg border border-border"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>
      <p class="text-muted-foreground font-medium">Nenhuma publicação ainda</p>
      <p class="text-sm text-muted-foreground mt-2">
        Seja a primeira a compartilhar sua jornada!
      </p>
    </div>

    <!-- Feed de posts -->
    <div
      v-else
      class="space-y-6"
    >
      <CommunityPostCard
        v-for="post in communityStore.posts"
        :key="post.id"
        :post="post"
        :can-delete="isOwnPost(post)"
        @like="handleLikePost(post.id)"
        @unlike="handleUnlikePost(post.id)"
        @delete="handleDeletePost(post.id)"
      />
    </div>
  </div>
</template>
