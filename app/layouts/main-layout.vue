<script setup lang="ts">
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

// Estado do menu mobile
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <!-- Sidebar -->
    <Sidebar
      :mobile-menu-open="mobileMenuOpen"
      @close-mobile-menu="closeMobileMenu"
    />

    <!-- Main Content Area -->
    <!-- Desktop: ml-64 (offset da sidebar fixa) -->
    <!-- Mobile: ml-0 (sidebar é drawer overlay) -->
    <div class="flex-1 lg:ml-64 flex flex-col">
      <!-- Header -->
      <Header @toggle-mobile-menu="toggleMobileMenu" />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <slot />
      </main>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>
