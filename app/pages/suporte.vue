<script setup lang="ts">
import {
  ChatBubbleLeftRightIcon,
  PlayCircleIcon,
  QuestionMarkCircleIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'main-layout'
})

// Handler para WhatsApp (placeholder sem link por enquanto)
const handleWhatsAppClick = () => {
  alert('Em breve: link direto para o WhatsApp de suporte será configurado!')
}
</script>

<template>
  <div id="suporte-page" class="suporte-page">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Suporte</h1>
      <p class="text-muted-foreground">
        Estamos aqui para ajudar você em sua jornada
      </p>
    </div>

    <!-- Seção: Contato WhatsApp -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <ChatBubbleLeftRightIcon class="w-6 h-6 text-primary" />
        Fale Conosco
      </h2>

      <!-- Card WhatsApp destacado -->
      <div
        id="whatsapp-card"
        class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-8 hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col md:flex-row items-center gap-6">
          <!-- Ícone -->
          <div class="flex-shrink-0">
            <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                class="w-12 h-12"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                />
              </svg>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="flex-1 text-center md:text-left">
            <h3 class="text-2xl font-bold text-foreground mb-2">
              WhatsApp de Suporte
            </h3>
            <p class="text-muted-foreground mb-4">
              Tire suas dúvidas, solicite ajuda ou compartilhe feedback diretamente pelo WhatsApp.
              Nossa equipe está pronta para te atender!
            </p>
            <button
              class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              @click="handleWhatsAppClick"
            >
              <PhoneIcon class="w-5 h-5" />
              <span>Falar no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção: Vídeos Tutoriais (Em Breve) -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <PlayCircleIcon class="w-6 h-6 text-primary" />
        Vídeos Tutoriais
      </h2>

      <!-- Empty state elegante -->
      <div
        id="tutorials-placeholder"
        class="bg-card border border-border rounded-lg p-12 text-center"
      >
        <div class="max-w-md mx-auto">
          <!-- Ícone grande -->
          <div class="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
            <PlayCircleIcon class="w-16 h-16 text-primary" />
          </div>

          <!-- Texto -->
          <h3 class="text-xl font-semibold text-foreground mb-3">
            Em Breve: Tutoriais em Vídeo
          </h3>
          <p class="text-muted-foreground mb-6">
            Estamos preparando uma série de vídeos tutoriais para te ajudar a navegar na plataforma
            e aproveitar ao máximo todos os recursos disponíveis.
          </p>

          <!-- Lista de tópicos futuros -->
          <div class="bg-muted/50 rounded-lg p-4 text-left">
            <p class="text-sm font-medium text-foreground mb-2">O que você vai aprender:</p>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5">•</span>
                <span>Como navegar pela plataforma</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5">•</span>
                <span>Aproveitar ao máximo as aulas e módulos</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5">•</span>
                <span>Utilizar o sistema de receitas e lista de compras</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5">•</span>
                <span>Participar ativamente da comunidade</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5">•</span>
                <span>Acompanhar seu progresso no desafio</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção: Perguntas Frequentes (Futuro) -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <QuestionMarkCircleIcon class="w-6 h-6 text-primary" />
        Perguntas Frequentes
      </h2>

      <!-- Empty state simples -->
      <div
        id="faq-placeholder"
        class="bg-card border border-dashed border-border rounded-lg p-8 text-center"
      >
        <QuestionMarkCircleIcon class="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p class="text-muted-foreground">
          Em breve adicionaremos uma seção com as perguntas mais frequentes e suas respostas.
        </p>
      </div>
    </div>

    <!-- Footer com dica -->
    <div class="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
      <p class="text-sm text-muted-foreground">
        💡 <span class="font-medium text-foreground">Dica:</span>
        Enquanto os tutoriais não ficam prontos, explore a plataforma livremente.
        Se tiver alguma dúvida, não hesite em nos contatar pelo WhatsApp!
      </p>
    </div>
  </div>
</template>
