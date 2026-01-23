<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="min-h-16 bg-card border-t border-border flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 md:py-0 text-xs md:text-sm text-muted-foreground gap-2 md:gap-0">
    <div class="text-center md:text-left">
      <p class="leading-relaxed">
        <span class="hidden sm:inline">&copy; {{ currentYear }} GDAA - Guia Definitivo da Alimentação Ancestral</span>
        <span class="sm:hidden">&copy; {{ currentYear }} GDAA</span>
      </p>
    </div>

    <div class="flex items-center gap-3 md:gap-4 text-center">
      <a href="#" class="hover:text-foreground transition-colors">Termos de Uso</a>
      <span>•</span>
      <a href="#" class="hover:text-foreground transition-colors">Política de Privacidade</a>
    </div>
  </footer>
</template>
