// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 horas
      sameSite: 'lax'
    }
  }
})