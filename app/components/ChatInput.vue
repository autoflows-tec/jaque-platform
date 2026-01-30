<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

interface Props {
  disabled?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'send', message: string): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: 'Digite os ingredientes que você tem...'
})

const emit = defineEmits<Emits>()

const message = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// Auto-resize textarea
const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

// Enviar mensagem
const handleSend = () => {
  const trimmed = message.value.trim()
  if (trimmed && !props.disabled) {
    emit('send', trimmed)
    message.value = ''

    // Reset textarea height
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  }
}

// Permitir enviar com Enter (Shift+Enter para quebra de linha)
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

// Watch para auto-resize
watch(message, () => {
  adjustHeight()
})

// Focus no input quando montar (apenas desktop)
onMounted(() => {
  if (window.innerWidth >= 1024) {
    textareaRef.value?.focus()
  }
})
</script>

<template>
  <div id="chat-input" class="chat-input bg-card border-t border-border p-3 md:p-4">
    <div class="max-w-3xl mx-auto">
      <!-- Input principal -->
      <div class="flex items-end gap-2 md:gap-3">
        <!-- Textarea -->
        <div class="flex-1 relative">
          <textarea
            ref="textareaRef"
            v-model="message"
            :placeholder="placeholder"
            :disabled="disabled"
            class="w-full resize-none rounded-lg border border-border bg-background px-3 md:px-4 py-2.5 md:py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            :class="disabled ? 'opacity-50' : ''"
            rows="1"
            style="max-height: 120px; min-height: 44px; font-size: 16px;"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Botão Enviar -->
        <button
          :disabled="disabled || !message.trim()"
          class="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          @click="handleSend"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Sugestões rápidas -->
      <div class="mt-2 flex flex-wrap gap-2">
        <button
          v-if="!message && !disabled"
          class="px-3 py-1.5 text-xs md:text-sm bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors"
          @click="message = 'Tenho frango, batata e brócolis'"
        >
          💡 Frango e vegetais
        </button>
        <button
          v-if="!message && !disabled"
          class="px-3 py-1.5 text-xs md:text-sm bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors"
          @click="message = 'Tenho 30 minutos para cozinhar'"
        >
          ⏱️ Receita rápida
        </button>
        <button
          v-if="!message && !disabled"
          class="px-3 py-1.5 text-xs md:text-sm bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors"
          @click="message = 'Quero uma receita vegana'"
        >
          🌱 Receita vegana
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo para scroll do textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
