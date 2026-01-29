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

// Focus no input quando montar
onMounted(() => {
  textareaRef.value?.focus()
})
</script>

<template>
  <div id="chat-input" class="chat-input bg-card border-t border-border p-4">
    <div class="max-w-4xl mx-auto flex items-end gap-3">
      <!-- Textarea -->
      <div class="flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="message"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="disabled ? 'opacity-50' : ''"
          rows="1"
          style="max-height: 150px; min-height: 48px;"
          @keydown="handleKeydown"
        />

        <!-- Hint de teclas -->
        <div class="absolute bottom-1 right-3 text-xs text-muted-foreground pointer-events-none">
          <span v-if="!disabled && message.trim()">Enter para enviar</span>
        </div>
      </div>

      <!-- Botão Enviar -->
      <button
        :disabled="disabled || !message.trim()"
        class="shrink-0 w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        @click="handleSend"
      >
        <PaperAirplaneIcon
          class="w-5 h-5 transform -rotate-45"
          :class="disabled ? '' : 'group-hover:scale-110'"
        />
      </button>
    </div>

    <!-- Sugestões rápidas (opcional) -->
    <div class="max-w-4xl mx-auto mt-3 flex flex-wrap gap-2">
      <button
        v-if="!message && !disabled"
        class="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
        @click="message = 'Tenho frango, batata e brócolis'"
      >
        💡 Frango e vegetais
      </button>
      <button
        v-if="!message && !disabled"
        class="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
        @click="message = 'Tenho 30 minutos para cozinhar'"
      >
        ⏱️ Receita rápida
      </button>
      <button
        v-if="!message && !disabled"
        class="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
        @click="message = 'Quero uma receita vegana'"
      >
        🌱 Receita vegana
      </button>
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
