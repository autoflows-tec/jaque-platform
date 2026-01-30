<script setup lang="ts">
interface Tab {
  id: string
  label: string
}

interface Props {
  tabs: Tab[]
  activeTab: string
  counts?: Record<string, number>
}

interface Emits {
  (e: 'change', tabId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleTabClick = (tabId: string) => {
  emit('change', tabId)
}
</script>

<template>
  <div id="recipe-tabs" class="recipe-tabs border-b border-border mb-6">
    <div class="flex gap-1 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-4 py-3 font-medium text-sm sm:text-base transition-colors relative whitespace-nowrap flex items-center gap-2',
          activeTab === tab.id
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        ]"
        @click="handleTabClick(tab.id)"
      >
        <span>{{ tab.label }}</span>

        <!-- Contador de receitas -->
        <span
          v-if="counts && counts[tab.id] !== undefined"
          :class="[
            'px-2 py-0.5 rounded-full text-xs font-semibold',
            activeTab === tab.id
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          ]"
        >
          {{ counts[tab.id] }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.recipe-tabs {
  -webkit-overflow-scrolling: touch;
}

.recipe-tabs::-webkit-scrollbar {
  height: 4px;
}

.recipe-tabs::-webkit-scrollbar-track {
  background: transparent;
}

.recipe-tabs::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 2px;
}

.recipe-tabs::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}
</style>
