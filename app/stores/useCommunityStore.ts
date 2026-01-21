import { defineStore } from 'pinia'
import type {
  CommunityPostWithAuthor,
  CommunityPostCommentWithAuthor,
  CommunityPostCreateInput,
  CommunityPostCommentCreateInput
} from '../../shared/types/Community'

export const useCommunityStore = defineStore('community', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const posts = ref<CommunityPostWithAuthor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Buscar posts do feed (com informações do autor e se user curtiu)
  const fetchPosts = async (limit: number = 20, offset: number = 0) => {
    loading.value = true
    error.value = null

    try {
      const userId = user.value?.id || user.value?.sub

      // Query principal: buscar posts
      const { data: postsData, error: fetchError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (fetchError) throw fetchError

      // Para cada post, buscar autor e verificar se o usuário atual curtiu
      const postsWithLikeStatus = await Promise.all(
        (postsData || []).map(async (post) => {
          // Buscar dados do autor
          const { data: authorData } = await supabase
            .from('profiles')
            .select('name, user_id')
            .eq('user_id', post.user_id)
            .single()

          let userHasLiked = false

          if (userId) {
            const { data } = await supabase
              .from('community_post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', userId)
              .single()

            userHasLiked = !!data
          }

          return {
            ...post,
            author: authorData || { name: null, user_id: post.user_id },
            user_has_liked: userHasLiked
          }
        })
      )

      // Atualizar ou adicionar ao array existente
      if (offset === 0) {
        posts.value = postsWithLikeStatus
      } else {
        posts.value = [...posts.value, ...postsWithLikeStatus]
      }
    } catch (err: any) {
      console.error('Erro ao buscar posts:', err)
      error.value = err.message
      posts.value = []
    } finally {
      loading.value = false
    }
  }

  // Criar novo post
  const createPost = async (content: string) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false }
    }

    const userId = user.value?.id || user.value?.sub

    loading.value = true
    error.value = null

    try {
      const input: CommunityPostCreateInput = {
        user_id: userId,
        content,
        is_published: true
      }

      const { data, error: insertError } = await supabase
        .from('community_posts')
        .insert(input)
        .select('*')
        .single()

      if (insertError) throw insertError

      // Buscar dados do autor
      const { data: authorData } = await supabase
        .from('profiles')
        .select('name, user_id')
        .eq('user_id', data.user_id)
        .single()

      const postWithAuthor = {
        ...data,
        author: authorData || { name: null, user_id: data.user_id },
        user_has_liked: false
      }

      // Adicionar no início do array
      posts.value = [postWithAuthor, ...posts.value]

      return { success: true, data: postWithAuthor }
    } catch (err: any) {
      console.error('Erro ao criar post:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Deletar post
  const deletePost = async (postId: number) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)

      if (deleteError) throw deleteError

      // Remover do array
      posts.value = posts.value.filter(p => p.id !== postId)

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar post:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Curtir post
  const likePost = async (postId: number) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false }
    }

    const userId = user.value?.id || user.value?.sub

    try {
      const { error: likeError } = await supabase
        .from('community_post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        })

      if (likeError) throw likeError

      // Atualizar estado local
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.likes_count++
        post.user_has_liked = true
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao curtir post:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Descurtir post
  const unlikePost = async (postId: number) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false }
    }

    const userId = user.value?.id || user.value?.sub

    try {
      const { error: unlikeError } = await supabase
        .from('community_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)

      if (unlikeError) throw unlikeError

      // Atualizar estado local
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.likes_count--
        post.user_has_liked = false
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao descurtir post:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Buscar comentários de um post
  const fetchComments = async (postId: number) => {
    try {
      const { data: commentsData, error: fetchError } = await supabase
        .from('community_post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      // Para cada comentário, buscar dados do autor
      const commentsWithAuthor = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: authorData } = await supabase
            .from('profiles')
            .select('name, user_id')
            .eq('user_id', comment.user_id)
            .single()

          return {
            ...comment,
            author: authorData || { name: null, user_id: comment.user_id }
          }
        })
      )

      return commentsWithAuthor as CommunityPostCommentWithAuthor[]
    } catch (err: any) {
      console.error('Erro ao buscar comentários:', err)
      error.value = err.message
      return []
    }
  }

  // Criar comentário
  const createComment = async (postId: number, content: string) => {
    if (!user.value?.id && !user.value?.sub) {
      error.value = 'Usuário não autenticado'
      return { success: false }
    }

    const userId = user.value?.id || user.value?.sub

    try {
      const input: CommunityPostCommentCreateInput = {
        post_id: postId,
        user_id: userId,
        content
      }

      const { data, error: insertError } = await supabase
        .from('community_post_comments')
        .insert(input)
        .select('*')
        .single()

      if (insertError) throw insertError

      // Buscar dados do autor
      const { data: authorData } = await supabase
        .from('profiles')
        .select('name, user_id')
        .eq('user_id', data.user_id)
        .single()

      const commentWithAuthor = {
        ...data,
        author: authorData || { name: null, user_id: data.user_id }
      }

      // Atualizar contador local
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.comments_count++
      }

      return { success: true, data: commentWithAuthor }
    } catch (err: any) {
      console.error('Erro ao criar comentário:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Deletar comentário
  const deleteComment = async (commentId: number, postId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('community_post_comments')
        .delete()
        .eq('id', commentId)

      if (deleteError) throw deleteError

      // Atualizar contador local
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.comments_count--
      }

      return { success: true }
    } catch (err: any) {
      console.error('Erro ao deletar comentário:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Limpar estado
  const clearPosts = () => {
    posts.value = []
    error.value = null
  }

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    fetchComments,
    createComment,
    deleteComment,
    clearPosts
  }
})
