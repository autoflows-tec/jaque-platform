<template>
  <div class="min-h-screen bg-background p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-foreground mb-8">Debug - Verificação Admin</h1>

      <div class="space-y-6">
        <!-- User Info -->
        <div class="bg-card p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Supabase User</h2>
          <pre class="bg-muted p-4 rounded text-sm overflow-auto">{{ JSON.stringify(user, null, 2) }}</pre>
        </div>

        <!-- Profile Info -->
        <div class="bg-card p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Profile (useUserStore)</h2>
          <pre class="bg-muted p-4 rounded text-sm overflow-auto">{{ JSON.stringify(profile, null, 2) }}</pre>
        </div>

        <!-- Is Admin -->
        <div class="bg-card p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">É Admin?</h2>
          <div class="text-2xl font-bold" :class="isAdmin ? 'text-green-600' : 'text-red-600'">
            {{ isAdmin ? 'SIM ✅' : 'NÃO ❌' }}
          </div>
          <div class="mt-4 text-sm text-muted-foreground">
            <p>profile?.role = {{ profile?.role || 'undefined' }}</p>
            <p>profile?.role === 'admin' = {{ profile?.role === 'admin' }}</p>
          </div>
        </div>

        <!-- Fetch Profile Button -->
        <div class="bg-card p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Ações</h2>
          <button
            @click="reloadProfile"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            :disabled="loading"
          >
            {{ loading ? 'Carregando...' : 'Recarregar Profile' }}
          </button>
          <p v-if="error" class="text-red-600 mt-2">Erro: {{ error }}</p>
        </div>

        <!-- Manual SQL Check -->
        <div class="bg-card p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Verificação Manual</h2>
          <p class="text-sm text-muted-foreground mb-4">
            Execute este SQL no Supabase para verificar seu profile:
          </p>
          <pre class="bg-muted p-4 rounded text-xs overflow-auto">SELECT * FROM profiles WHERE user_id = '{{ user?.id }}';

UPDATE profiles
SET role = 'admin'
WHERE user_id = '{{ user?.id }}';</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/useUserStore'

const userStore = useUserStore()
const user = useSupabaseUser()

const { profile, loading, error } = storeToRefs(userStore)

const isAdmin = computed(() => profile.value?.role === 'admin')

const reloadProfile = async () => {
  await userStore.fetchProfile()
}

// Carregar profile ao montar
onMounted(async () => {
  await userStore.fetchProfile()
})
</script>
