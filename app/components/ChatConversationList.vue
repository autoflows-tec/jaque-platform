<script setup lang="ts">
import { PlusIcon, TrashIcon, ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'
import type { ChatConversation } from '../../shared/types/Chat'
import { formatMessageTime } from '../../shared/types/Chat'

interface Props {
  conversations: ChatConversation[]
  currentConversationId: number | null
  loading?: boolean
}

interface Emits {
  (e: 'select', conversation: ChatConversation): void
  (e: 'create'): void
  (e: 'delete', conversationId: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const handleSelect = (conversation: ChatConversation) => {
  emit('select', conversation)
}

const handleCreate = () => {
  emit('create')
}

const handleDelete = (event: Event, conversationId: number, title: string | null) => {
  event.stopPropagation()
  if (confirm(`Deletar conversa "${title || 'Sem título'}"?`)) {
    emit('delete', conversationId)
  }
}

const formatConversationTime = (conversation: ChatConversation) => {
  return formatMessageTime(conversation.last_message_at || conversation.created_at)
}
</script>

<template>
  <div id="chat-conversation-list" class="chat-conversation-list h-full flex flex-col bg-muted/30">
    <!-- Header -->
    <div class="p-4 border-b border-border">
      <button
        class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        @click="handleCreate"
      >
        <PlusIcon class="w-5 h-5" />
        <span>Nova Conversa</span>
      </button>
    </div>

    <!-- Lista de conversas -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading state -->
      <div
        v-if="loading && conversations.length === 0"
        class="flex items-center justify-center p-8"
      >
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="conversations.length === 0"
        class="flex flex-col items-center justify-center p-8 text-center"
      >
        <ChatBubbleLeftIcon class="w-12 h-12 text-muted-foreground opacity-50 mb-3" />
        <p class="text-sm text-muted-foreground">
          Nenhuma conversa ainda
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          Clique em "Nova Conversa" para começar
        </p>
      </div>

      <!-- Lista -->
      <div v-else class="divide-y divide-border">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="relative group cursor-pointer hover:bg-muted/50 transition-colors"
          :class="currentConversationId === conversation.id ? 'bg-muted' : ''"
          @click="handleSelect(conversation)"
        >
          <div class="p-4">
            <!-- Título -->
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3
                class="font-medium text-sm line-clamp-2 flex-1"
                :class="currentConversationId === conversation.id ? 'text-foreground' : 'text-muted-foreground'"
              >
                {{ conversation.title || 'Nova conversa' }}
              </h3>

              <!-- Botão deletar -->
              <button
                class="opacity-0 group-hover:opacity-100 shrink-0 p-1 hover:bg-destructive/10 rounded transition-all"
                @click="(e) => handleDelete(e, conversation.id, conversation.title)"
              >
                <TrashIcon class="w-4 h-4 text-destructive" />
              </button>
            </div>

            <!-- Metadados -->
            <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{{ conversation.messages_count }} {{ conversation.messages_count === 1 ? 'mensagem' : 'mensagens' }}</span>
              <span>{{ formatConversationTime(conversation) }}</span>
            </div>
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

/* Scroll customizado */
.chat-conversation-list > div::-webkit-scrollbar {
  width: 6px;
}

.chat-conversation-list > div::-webkit-scrollbar-track {
  background: transparent;
}

.chat-conversation-list > div::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

.chat-conversation-list > div::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
