<script setup lang="ts">
import { ChatBubbleLeftRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import ChatConversationList from '~/components/ChatConversationList.vue'
import ChatMessageBubble from '~/components/ChatMessageBubble.vue'
import ChatInput from '~/components/ChatInput.vue'
import { useChatStore } from '~/stores/useChatStore'
import type { ChatConversation } from '../../shared/types/Chat'

definePageMeta({
  layout: 'main-layout'
})

const chatStore = useChatStore()
const messagesContainerRef = ref<HTMLDivElement | null>(null)
const showMobileMenu = ref(false)

// Auto-scroll para a última mensagem
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
    }
  })
}

// Scroll quando mensagens mudam
watch(() => chatStore.messages, () => {
  scrollToBottom()
}, { deep: true })

// Carregar conversas ao montar
onMounted(async () => {
  await chatStore.fetchConversations()
})

// Handlers
const handleSelectConversation = async (conversation: ChatConversation) => {
  await chatStore.selectConversation(conversation)
  showMobileMenu.value = false
  scrollToBottom()
}

const handleCreateConversation = async () => {
  const result = await chatStore.createConversation()
  if (result.success && result.data) {
    await chatStore.selectConversation(result.data)
    showMobileMenu.value = false
  }
}

const handleDeleteConversation = async (conversationId: number) => {
  await chatStore.deleteConversation(conversationId)
}

const handleSendMessage = async (message: string) => {
  await chatStore.sendMessage(message)
  scrollToBottom()
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<template>
  <div id="chat-receitas-page" class="h-[calc(100vh-4rem)] flex flex-col bg-background">
    <!-- Header Mobile -->
    <div class="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
      <div class="flex items-center gap-2">
        <ChatBubbleLeftRightIcon class="w-6 h-6 text-primary" />
        <h1 class="text-lg font-bold">Chat IA - Receitas</h1>
      </div>
      <button
        class="p-2 hover:bg-muted rounded-lg transition-colors"
        @click="toggleMobileMenu"
      >
        <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
        <XMarkIcon v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Layout Principal -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar de Conversas - Desktop -->
      <div class="hidden lg:block w-80 border-r border-border">
        <ChatConversationList
          :conversations="chatStore.conversations"
          :current-conversation-id="chatStore.currentConversation?.id || null"
          :loading="chatStore.loading"
          @select="handleSelectConversation"
          @create="handleCreateConversation"
          @delete="handleDeleteConversation"
        />
      </div>

      <!-- Sidebar de Conversas - Mobile (Drawer) -->
      <Transition
        enter-active-class="transition-transform duration-300"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div
          v-if="showMobileMenu"
          class="lg:hidden fixed inset-0 z-50 bg-background"
        >
          <ChatConversationList
            :conversations="chatStore.conversations"
            :current-conversation-id="chatStore.currentConversation?.id || null"
            :loading="chatStore.loading"
            @select="handleSelectConversation"
            @create="handleCreateConversation"
            @delete="handleDeleteConversation"
          />
        </div>
      </Transition>

      <!-- Área do Chat -->
      <div class="flex-1 flex flex-col bg-background overflow-hidden">
        <!-- Header Desktop -->
        <div class="hidden lg:flex items-center gap-3 p-4 border-b border-border bg-card">
          <ChatBubbleLeftRightIcon class="w-6 h-6 text-primary" />
          <div class="flex-1">
            <h1 class="text-lg font-bold">
              {{ chatStore.currentConversation?.title || 'Chat IA - Receitas' }}
            </h1>
            <p class="text-xs text-muted-foreground">
              Informe seus ingredientes e receba sugestões de receitas
            </p>
          </div>
        </div>

        <!-- Área de Mensagens -->
        <div
          ref="messagesContainerRef"
          class="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <!-- Empty State - Nenhuma conversa selecionada -->
          <div
            v-if="!chatStore.currentConversation"
            class="h-full flex flex-col items-center justify-center text-center px-4"
          >
            <ChatBubbleLeftRightIcon class="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
            <h2 class="text-xl font-bold mb-2">Bem-vindo ao Chat IA!</h2>
            <p class="text-sm text-muted-foreground max-w-md mb-6">
              Informe os ingredientes que você tem disponível e receba sugestões personalizadas de receitas.
            </p>
            <button
              class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              @click="handleCreateConversation"
            >
              Iniciar Nova Conversa
            </button>
          </div>

          <!-- Empty State - Conversa sem mensagens -->
          <div
            v-else-if="chatStore.messages.length === 0 && !chatStore.loading"
            class="h-full flex flex-col items-center justify-center text-center px-4"
          >
            <ChatBubbleLeftRightIcon class="w-12 h-12 text-muted-foreground opacity-50 mb-3" />
            <p class="text-sm text-muted-foreground max-w-md">
              Digite sua mensagem abaixo para começar a conversa
            </p>
          </div>

          <!-- Loading inicial -->
          <div
            v-else-if="chatStore.loading && chatStore.messages.length === 0"
            class="h-full flex items-center justify-center"
          >
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          </div>

          <!-- Lista de Mensagens -->
          <div
            v-else
            class="max-w-4xl mx-auto space-y-4"
          >
            <ChatMessageBubble
              v-for="message in chatStore.messages"
              :key="message.id"
              :message="message"
            />
          </div>
        </div>

        <!-- Input de Mensagem -->
        <ChatInput
          v-if="chatStore.currentConversation"
          :disabled="chatStore.sendingMessage"
          :placeholder="chatStore.sendingMessage ? 'Aguarde a resposta...' : 'Digite os ingredientes que você tem...'"
          @send="handleSendMessage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scroll customizado */
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
