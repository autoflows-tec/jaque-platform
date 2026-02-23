<template>
  <div id="admin-atividades" class="min-h-screen bg-background">
    <Header />

    <div class="flex">
      <Sidebar />

      <main class="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <div class="max-w-7xl mx-auto">
          <!-- Cabeçalho -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-foreground mb-2">
              Logs de Atividades
            </h1>
            <p class="text-muted-foreground">
              Acompanhe todas as atividades das alunas na plataforma
            </p>
          </div>

          <!-- Filtros -->
          <div class="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-lg font-semibold text-foreground mb-4">Filtros</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Filtro por tipo de atividade -->
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">
                  Tipo de Atividade
                </label>
                <select
                  v-model="selectedActivityType"
                  class="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
                  @change="applyFilters"
                >
                  <option value="">Todos</option>
                  <option value="LOGIN">Login</option>
                  <option value="SIGNUP">Cadastro</option>
                  <option value="QUIZ_COMPLETED">Quiz Completado</option>
                  <option value="RECIPE_CREATED">Receita Criada</option>
                  <option value="COMMUNITY_POST_CREATED">Post Criado</option>
                  <option value="CHAT_MESSAGE_SENT">Mensagem no Chat</option>
                </select>
              </div>

              <!-- Filtro por data inicial -->
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">
                  Data Inicial
                </label>
                <input
                  v-model="dateFrom"
                  type="date"
                  class="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
                  @change="applyFilters"
                />
              </div>

              <!-- Filtro por data final -->
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">
                  Data Final
                </label>
                <input
                  v-model="dateTo"
                  type="date"
                  class="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
                  @change="applyFilters"
                />
              </div>
            </div>

            <div class="flex gap-3 mt-4">
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Aplicar Filtros
              </button>
              <button
                @click="clearFilters"
                class="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80"
              >
                Limpar Filtros
              </button>
            </div>
          </div>

          <!-- Estatísticas -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-card rounded-lg shadow-md p-6">
              <div class="text-sm text-muted-foreground mb-1">Total de Logs</div>
              <div class="text-2xl font-bold text-foreground">{{ totalLogs }}</div>
            </div>

            <div class="bg-card rounded-lg shadow-md p-6">
              <div class="text-sm text-muted-foreground mb-1">Página Atual</div>
              <div class="text-2xl font-bold text-foreground">{{ currentPage }} / {{ totalPages }}</div>
            </div>

            <div class="bg-card rounded-lg shadow-md p-6">
              <div class="text-sm text-muted-foreground mb-1">Logs por Página</div>
              <div class="text-2xl font-bold text-foreground">{{ logsPerPage }}</div>
            </div>

            <div class="bg-card rounded-lg shadow-md p-6">
              <div class="text-sm text-muted-foreground mb-1">Filtros Ativos</div>
              <div class="text-2xl font-bold text-foreground">{{ activeFiltersCount }}</div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p class="text-muted-foreground mt-4">Carregando logs...</p>
          </div>

          <!-- Tabela de Logs -->
          <div v-else-if="logs.length > 0" class="bg-card rounded-lg shadow-md overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-muted">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Aluna
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Atividade
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr
                    v-for="log in logs"
                    :key="log.id"
                    class="hover:bg-muted/50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {{ formatActivityDate(log.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {{ log.profile?.name || 'Usuário sem nome' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getActivityTypeColor(log.activity_type)}-100 text-${getActivityTypeColor(log.activity_type)}-800`"
                      >
                        {{ getActivityTypeLabel(log.activity_type) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-muted-foreground">
                      <pre class="text-xs">{{ JSON.stringify(log.activity_data, null, 2) }}</pre>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginação -->
            <div class="bg-muted px-6 py-4 flex items-center justify-between border-t border-border">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  @click="goToPrevPage"
                  :disabled="!hasPrevPage"
                  class="relative inline-flex items-center px-4 py-2 border border-input text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  @click="goToNextPage"
                  :disabled="!hasNextPage"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-input text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-muted-foreground">
                    Mostrando
                    <span class="font-medium">{{ (currentPage - 1) * logsPerPage + 1 }}</span>
                    até
                    <span class="font-medium">{{ Math.min(currentPage * logsPerPage, totalLogs) }}</span>
                    de
                    <span class="font-medium">{{ totalLogs }}</span>
                    resultados
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      @click="goToPrevPage"
                      :disabled="!hasPrevPage"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-input bg-background text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      @click="goToNextPage"
                      :disabled="!hasNextPage"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-input bg-background text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensagem vazia -->
          <div v-else class="bg-card rounded-lg shadow-md p-12 text-center">
            <p class="text-muted-foreground">Nenhum log encontrado</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActivityLogsStore } from '~/stores/useActivityLogsStore'
import { useUserStore } from '~/stores/useUserStore'
import {
  getActivityTypeLabel,
  getActivityTypeColor,
  formatActivityDate,
  ActivityType
} from '../../../shared/types/ActivityLog'

const activityLogsStore = useActivityLogsStore()
const userStore = useUserStore()

// Acessar estado da store
const {
  logs,
  loading,
  totalLogs,
  currentPage,
  logsPerPage,
  totalPages,
  hasNextPage,
  hasPrevPage
} = storeToRefs(activityLogsStore)

// Filtros locais
const selectedActivityType = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Computed para contar filtros ativos
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedActivityType.value) count++
  if (dateFrom.value) count++
  if (dateTo.value) count++
  return count
})

// Aplicar filtros
const applyFilters = () => {
  const filters = {
    activity_types: selectedActivityType.value ? [selectedActivityType.value as ActivityType] : undefined,
    date_from: dateFrom.value || undefined,
    date_to: dateTo.value || undefined
  }

  activityLogsStore.fetchLogs(filters, 1)
}

// Limpar filtros
const clearFilters = () => {
  selectedActivityType.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  activityLogsStore.clearFilters()
}

// Navegação de páginas
const goToNextPage = () => {
  if (hasNextPage.value) {
    activityLogsStore.goToPage(currentPage.value + 1)
  }
}

const goToPrevPage = () => {
  if (hasPrevPage.value) {
    activityLogsStore.goToPage(currentPage.value - 1)
  }
}

// Verificar se usuário é admin
onMounted(async () => {
  await userStore.fetchProfile()

  if (userStore.profile?.role !== 'admin') {
    navigateTo('/')
    return
  }

  // Carregar logs
  activityLogsStore.fetchLogs()
})
</script>
