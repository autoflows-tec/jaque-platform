<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false
})

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
  ghost: 'bg-transparent hover:bg-accent/10 text-foreground',
  outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground'
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variantClasses[variant]
    ]"
  >
    <slot />
  </button>
</template>
