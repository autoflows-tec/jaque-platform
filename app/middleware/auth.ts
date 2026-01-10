export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Se está tentando acessar login e já está autenticado, redireciona para index
  if (to.path === '/login' && user.value) {
    return navigateTo('/')
  }

  // Se não está autenticado e não está na página de login, redireciona para login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
