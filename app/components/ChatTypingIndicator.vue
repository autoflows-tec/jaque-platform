<script setup lang="ts">
// Componente simples de indicador de digitação
</script>

<template>
  <div id="chat-typing-indicator" class="chat-typing-indicator flex items-center gap-1 py-1">
    <div class="dot animate-bounce" style="animation-delay: 0ms"></div>
    <div class="dot animate-bounce" style="animation-delay: 150ms"></div>
    <div class="dot animate-bounce" style="animation-delay: 300ms"></div>
  </div>
</template>

<style scoped>
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.6;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
