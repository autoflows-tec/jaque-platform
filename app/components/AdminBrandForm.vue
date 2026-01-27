<script setup lang="ts">
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useImageUpload } from '~/composables/useImageUpload'
import type {
  BrandWithFavorite,
  BrandCreateInput,
  BrandUpdateInput,
  BrandCategory
} from '../../shared/types/Brand'
import { BrandCategoryLabels } from '../../shared/types/Brand'

interface Props {
  brand?: BrandWithFavorite | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: BrandCreateInput | BrandUpdateInput): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { uploading, uploadImage, deleteImage } = useImageUpload()

const formData = ref({
  name: '',
  description: '',
  logo_url: '',
  category: 'alimentos' as BrandCategory,
  website_url: '',
  affiliate_link: '',
  tags: [] as string[],
  is_featured: false,
  is_published: false,
  rating: null as number | null
})

const newTag = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const oldLogoUrl = ref<string>('')

const isEditMode = computed(() => !!props.brand)

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    logo_url: '',
    category: 'alimentos' as BrandCategory,
    website_url: '',
    affiliate_link: '',
    tags: [],
    is_featured: false,
    is_published: false,
    rating: null
  }
  newTag.value = ''
  selectedFile.value = null
  previewUrl.value = ''
  oldLogoUrl.value = ''
}

// Carregar dados da marca quando estiver editando
watch(() => props.brand, (newBrand) => {
  if (newBrand) {
    formData.value = {
      name: newBrand.name,
      description: newBrand.description || '',
      logo_url: newBrand.logo_url || '',
      category: newBrand.category,
      website_url: newBrand.website_url || '',
      affiliate_link: newBrand.affiliate_link || '',
      tags: newBrand.tags ? [...newBrand.tags] : [],
      is_featured: newBrand.is_featured,
      is_published: newBrand.is_published,
      rating: newBrand.rating
    }
    oldLogoUrl.value = newBrand.logo_url || ''
    previewUrl.value = newBrand.logo_url || ''
  } else {
    resetForm()
  }
}, { immediate: true })

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    selectedFile.value = file

    // Criar preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedFile.value = null
  previewUrl.value = ''
  formData.value.logo_url = ''
}

// Gerenciar tags
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    alert('Nome da marca é obrigatório')
    return
  }

  let logoUrl = formData.value.logo_url

  // Se selecionou nova imagem, fazer upload
  if (selectedFile.value) {
    const result = await uploadImage(selectedFile.value, 'logos', 'brands')

    if (!result.success) {
      alert(result.error || 'Erro ao fazer upload da imagem')
      return
    }

    logoUrl = result.url || null

    // Se está editando e tinha logo antiga, deletar do storage
    if (isEditMode.value && oldLogoUrl.value && oldLogoUrl.value !== logoUrl) {
      await deleteImage(oldLogoUrl.value)
    }
  }

  const data: any = {
    name: formData.value.name,
    description: formData.value.description || null,
    logo_url: logoUrl || null,
    category: formData.value.category,
    website_url: formData.value.website_url || null,
    affiliate_link: formData.value.affiliate_link || null,
    tags: formData.value.tags.length > 0 ? formData.value.tags : null,
    is_featured: formData.value.is_featured,
    is_published: formData.value.is_published,
    rating: formData.value.rating
  }

  emit('submit', data)
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="handleClose"
    >
      <div class="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-foreground">
            {{ isEditMode ? 'Editar Marca' : 'Nova Marca' }}
          </h2>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors"
            @click="handleClose"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Nome -->
          <BaseInput
            id="brand-name"
            v-model="formData.name"
            type="text"
            label="Nome da Marca *"
            placeholder="Ex: Marca XYZ"
            required
          />

          <!-- Categoria -->
          <div>
            <label for="brand-category" class="block text-sm font-medium text-foreground mb-2">
              Categoria *
            </label>
            <select
              id="brand-category"
              v-model="formData.category"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option
                v-for="(label, value) in BrandCategoryLabels"
                :key="value"
                :value="value"
              >
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Descrição -->
          <div>
            <label for="brand-description" class="block text-sm font-medium text-foreground mb-2">
              Descrição
            </label>
            <textarea
              id="brand-description"
              v-model="formData.description"
              rows="4"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Descrição da marca..."
            />
          </div>

          <!-- Upload de Logo -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Logo da Marca
            </label>

            <!-- Preview do logo -->
            <div v-if="previewUrl" class="mb-3 relative">
              <div class="w-full h-48 bg-muted rounded-lg border border-border flex items-center justify-center p-4">
                <img
                  :src="previewUrl"
                  alt="Preview"
                  class="max-h-full max-w-full object-contain"
                />
              </div>
              <button
                type="button"
                @click="removeImage"
                class="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Botão de upload -->
            <label
              for="brand-logo-upload"
              class="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': uploading }"
            >
              <svg
                v-if="!uploading"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5 text-muted-foreground"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
              <div
                v-else
                class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"
              ></div>
              <span class="text-sm text-muted-foreground">
                {{ uploading ? 'Fazendo upload...' : previewUrl ? 'Alterar logo' : 'Escolher logo do computador' }}
              </span>
            </label>
            <input
              id="brand-logo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              class="hidden"
              :disabled="uploading"
              @change="handleFileSelect"
            />
            <p class="text-xs text-muted-foreground mt-2">
              Formatos aceitos: JPG, PNG, WebP, SVG. Tamanho máximo: 5MB.
            </p>
          </div>

          <!-- Links -->
          <BaseInput
            id="brand-website"
            v-model="formData.website_url"
            type="url"
            label="Site Oficial"
            placeholder="https://exemplo.com.br"
          />

          <BaseInput
            id="brand-affiliate"
            v-model="formData.affiliate_link"
            type="url"
            label="Link de Afiliado/Desconto"
            placeholder="https://exemplo.com.br/desconto"
          />

          <!-- Rating -->
          <BaseInput
            id="brand-rating"
            v-model.number="formData.rating"
            type="number"
            label="Avaliação (1-5)"
            placeholder="5"
            min="1"
            max="5"
            step="1"
          />

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>

            <!-- Lista de tags -->
            <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="hover:text-destructive transition-colors"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>

            <!-- Input para adicionar tag -->
            <div class="flex gap-2">
              <input
                v-model="newTag"
                type="text"
                placeholder="Adicionar tag..."
                class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                @keyup.enter.prevent="addTag"
              />
              <button
                type="button"
                @click="addTag"
                class="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <PlusIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Checkboxes -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <input
                id="brand-featured"
                v-model="formData.is_featured"
                type="checkbox"
                class="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <label for="brand-featured" class="text-sm font-medium text-foreground cursor-pointer">
                Marca em destaque
              </label>
            </div>

            <div class="flex items-center gap-3">
              <input
                id="brand-published"
                v-model="formData.is_published"
                type="checkbox"
                class="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <label for="brand-published" class="text-sm font-medium text-foreground cursor-pointer">
                Publicar marca (tornar visível para alunas)
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <BaseButton
              type="button"
              variant="ghost"
              @click="handleClose"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              type="submit"
              variant="accent"
              :disabled="uploading"
            >
              {{ isEditMode ? 'Salvar Alterações' : 'Criar Marca' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
