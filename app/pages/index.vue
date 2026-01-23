<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import {
  ChartBarIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const user = useSupabaseUser()

definePageMeta({
  layout: 'main-layout'
})
</script>

<template>
  <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
        Dashboard
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Card: Progresso -->
        <div class="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <ChartBarIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-lg font-semibold text-foreground">Seu Progresso</h2>
          </div>
          <p class="text-sm text-muted-foreground mb-4">Continue evoluindo na sua jornada!</p>
          <div class="w-full bg-muted rounded-full h-2">
            <div class="bg-primary h-2 rounded-full" style="width: 45%"></div>
          </div>
          <p class="text-xs text-muted-foreground mt-2">45% concluído</p>
        </div>

        <!-- Card: Aulas -->
        <div class="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <AcademicCapIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-lg font-semibold text-foreground">Aulas</h2>
          </div>
          <p class="text-sm text-muted-foreground mb-4">Continue de onde parou</p>
          <NuxtLink to="/aulas" class="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
            Ir para Aulas
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Card: 21 Dias -->
        <div class="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <CalendarDaysIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-lg font-semibold text-foreground">Desafio 21 Dias</h2>
          </div>
          <p class="text-sm text-muted-foreground mb-4">Dia 12 de 21</p>
          <NuxtLink to="/21-dias" class="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
            Ver Desafio
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Card: Comunidade -->
        <div class="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <UserGroupIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-lg font-semibold text-foreground">Comunidade</h2>
          </div>
          <p class="text-sm text-muted-foreground mb-4">Veja o que as alunas estão compartilhando</p>
          <NuxtLink to="/comunidade" class="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
            Ir para Comunidade
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Card: Receitas -->
        <div class="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <ClipboardDocumentListIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-lg font-semibold text-foreground">Receitas</h2>
          </div>
          <p class="text-sm text-muted-foreground mb-4">Explore novas receitas ancestrais</p>
          <NuxtLink to="/receitas" class="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
            Ver Receitas
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Card: Lista de Compras -->
        <div class="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <ShoppingCartIcon class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-lg font-semibold text-foreground">Lista de Compras</h2>
          </div>
          <p class="text-sm text-muted-foreground mb-4">Organize suas compras</p>
          <NuxtLink to="/lista-compras" class="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
            Ver Lista
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-6 md:mt-8 bg-card border border-border rounded-lg p-4 md:p-6">
        <div class="flex items-center gap-3 mb-4">
          <SparklesIcon class="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <h2 class="text-lg md:text-xl font-semibold text-foreground">Atividades Recentes</h2>
        </div>
        <div class="space-y-2 md:space-y-3">
          <div class="flex items-center gap-3 text-xs md:text-sm p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div class="p-1.5 md:p-2 bg-green-500/10 rounded-full shrink-0">
              <CheckCircleIcon class="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            </div>
            <span class="text-muted-foreground flex-1 min-w-0 break-words">Você completou a aula "Introdução à AA"</span>
            <span class="text-xs text-muted-foreground shrink-0 hidden sm:inline">Há 2 horas</span>
          </div>
          <div class="flex items-center gap-3 text-xs md:text-sm p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div class="p-1.5 md:p-2 bg-blue-500/10 rounded-full shrink-0">
              <ChatBubbleLeftIcon class="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            </div>
            <span class="text-muted-foreground flex-1 min-w-0 break-words">Nova resposta no seu comentário</span>
            <span class="text-xs text-muted-foreground shrink-0 hidden sm:inline">Ontem</span>
          </div>
          <div class="flex items-center gap-3 text-xs md:text-sm p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div class="p-1.5 md:p-2 bg-purple-500/10 rounded-full shrink-0">
              <CheckCircleIcon class="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
            </div>
            <span class="text-muted-foreground flex-1 min-w-0 break-words">Você completou o Dia 11 do desafio</span>
            <span class="text-xs text-muted-foreground shrink-0 hidden sm:inline">Há 3 dias</span>
          </div>
        </div>
      </div>
    </div>
</template>
