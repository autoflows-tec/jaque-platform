<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="h-16 bg-card border-t border-border flex items-center justify-between px-6 text-sm text-muted-foreground">
    <div>
      <p>&copy; {{ currentYear }} GDAA - Guia Definitivo da Alimentação Ancestral</p>
    </div>

    <div class="flex items-center gap-4">
      <a href="#" class="hover:text-foreground transition-colors">Termos de Uso</a>
      <span>•</span>
      <a href="#" class="hover:text-foreground transition-colors">Política de Privacidade</a>
    </div>
  </footer>
</template>
