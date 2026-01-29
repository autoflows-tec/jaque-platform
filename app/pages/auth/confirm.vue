<script setup lang="ts">
definePageMeta({
  layout: 'auth-layout',
  middleware: []
})

const user = useSupabaseUser()
const router = useRouter()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

// Monitorar autenticação do usuário
watch(user, async (newUser) => {
  if (newUser) {
    status.value = 'success'

    // Aguardar 2 segundos antes de redirecionar
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
}, { immediate: true })

// Verificar se houve erro na URL (hash)
onMounted(() => {
  const hash = window.location.hash
  if (hash.includes('error')) {
    status.value = 'error'
    const params = new URLSearchParams(hash.substring(1))
    errorMessage.value = params.get('error_description') || 'Erro ao confirmar email'
  }

  // Se após 5 segundos ainda estiver loading, mostrar erro
  setTimeout(() => {
    if (status.value === 'loading') {
      status.value = 'error'
      errorMessage.value = 'Tempo de confirmação expirado. Tente fazer login novamente.'
    }
  }, 5000)
})
</script>

<template>
  <div id="confirm-page" class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <!-- Loading State -->
      <div
        v-if="status === 'loading'"
        class="bg-card border border-border rounded-lg p-8 text-center"
      >
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
        <h1 class="text-2xl font-bold text-foreground mb-2">
          Confirmando seu email...
        </h1>
        <p class="text-muted-foreground">
          Aguarde enquanto validamos sua conta
        </p>
      </div>

      <!-- Success State -->
      <div
        v-else-if="status === 'success'"
        class="bg-card border border-border rounded-lg p-8 text-center"
      >
        <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-8 h-8 text-green-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-foreground mb-2">
          Email confirmado!
        </h1>
        <p class="text-muted-foreground mb-6">
          Sua conta foi verificada com sucesso
        </p>

        <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          <span>Redirecionando para a plataforma...</span>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else
        class="bg-card border border-border rounded-lg p-8 text-center"
      >
        <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-8 h-8 text-destructive"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-foreground mb-2">
          Erro na confirmação
        </h1>
        <p class="text-muted-foreground mb-6">
          {{ errorMessage }}
        </p>

        <NuxtLink
          to="/login"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Ir para Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
