export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  // Aguarda a sessão ser carregada (importante para SSR/client hydration)
  if (process.client) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  // Se está tentando acessar login e já está autenticado, redireciona para index
  if (to.path === '/login' && user.value) {
    return navigateTo('/')
  }

  // Se não está autenticado e não está na página de login, redireciona para login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
