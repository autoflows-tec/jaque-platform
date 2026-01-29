<script setup lang="ts">
import { UserCircleIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import ChatTypingIndicator from '~/components/ChatTypingIndicator.vue'
import type { ChatMessage, MessageRole } from '../../shared/types/Chat'
import { formatMessageTime } from '../../shared/types/Chat'

interface Props {
  message: ChatMessage
  showAvatar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true
})

const isUser = computed(() => props.message.role === 'user')
const isAssistant = computed(() => props.message.role === 'assistant')
const formattedTime = computed(() => formatMessageTime(props.message.created_at))
</script>

<template>
  <div
    id="chat-message-bubble"
    class="chat-message-bubble flex gap-3 mb-4"
    :class="isUser ? 'flex-row-reverse' : 'flex-row'"
  >
    <!-- Avatar -->
    <div
      v-if="showAvatar"
      class="shrink-0"
    >
      <div
        v-if="isAssistant"
        class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <SparklesIcon class="w-5 h-5 text-primary" />
      </div>
      <div
        v-else
        class="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
      >
        <UserCircleIcon class="w-5 h-5 text-muted-foreground" />
      </div>
    </div>

    <!-- Mensagem -->
    <div
      class="flex flex-col gap-1"
      :class="isUser ? 'items-end' : 'items-start'"
    >
      <!-- Bolha de mensagem -->
      <div
        class="max-w-[85%] md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl break-words"
        :class="isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'"
      >
        <!-- Loading state -->
        <div v-if="message.is_loading">
          <ChatTypingIndicator />
        </div>

        <!-- Conteúdo da mensagem -->
        <div
          v-else
          class="text-sm md:text-base whitespace-pre-wrap"
        >
          {{ message.content }}
        </div>

        <!-- Mensagem de erro (se houver) -->
        <div
          v-if="message.error_message"
          class="mt-2 pt-2 border-t border-current/20 text-xs opacity-75"
        >
          ⚠️ {{ message.error_message }}
        </div>
      </div>

      <!-- Timestamp -->
      <span class="text-xs text-muted-foreground px-1">
        {{ formattedTime }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.chat-message-bubble {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
