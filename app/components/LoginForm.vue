<script setup lang="ts">
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useLoginForm } from '~/composables/useLoginForm'

const {
  activeTab,
  loginEmail,
  loginPassword,
  signupEmail,
  signupPassword,
  signupConfirmPassword,
  loading,
  error,
  handleLogin,
  handleSignup,
  setActiveTab
} = useLoginForm()
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-border">
        <button
          :class="[
            'flex-1 px-6 py-4 text-sm font-medium transition-colors',
            activeTab === 'login'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          ]"
          @click="setActiveTab('login')"
        >
          Entrar
        </button>
        <button
          :class="[
            'flex-1 px-6 py-4 text-sm font-medium transition-colors',
            activeTab === 'signup'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          ]"
          @click="setActiveTab('signup')"
        >
          Criar Conta
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {{ error }}
        </div>

        <!-- Login Tab -->
        <form
          v-if="activeTab === 'login'"
          @submit.prevent="handleLogin"
          class="space-y-4"
        >
          <BaseInput
            id="login-email"
            v-model="loginEmail"
            type="email"
            label="Email"
            placeholder="seu@email.com"
          />

          <BaseInput
            id="login-password"
            v-model="loginPassword"
            type="password"
            label="Senha"
            placeholder="••••••••"
          />

          <BaseButton
            type="submit"
            variant="accent"
            class="w-full"
            :disabled="loading"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </BaseButton>
        </form>

        <!-- Signup Tab -->
        <form
          v-if="activeTab === 'signup'"
          @submit.prevent="handleSignup"
          class="space-y-4"
        >
          <BaseInput
            id="signup-email"
            v-model="signupEmail"
            type="email"
            label="Email"
            placeholder="seu@email.com"
          />

          <BaseInput
            id="signup-password"
            v-model="signupPassword"
            type="password"
            label="Senha"
            placeholder="••••••••"
          />

          <BaseInput
            id="signup-confirm-password"
            v-model="signupConfirmPassword"
            type="password"
            label="Confirmar Senha"
            placeholder="••••••••"
          />

          <BaseButton
            type="submit"
            variant="accent"
            class="w-full"
          >
            Criar Conta
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>
