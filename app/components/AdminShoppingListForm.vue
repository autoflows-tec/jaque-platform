<script setup lang="ts">
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useImageUpload } from '~/composables/useImageUpload'
import type {
  ShoppingListWithFavorite,
  ShoppingListCreateInput,
  ShoppingListUpdateInput,
  ShoppingListItem,
  ShoppingListCategory,
  ShoppingItemCategory
} from '../../shared/types/ShoppingList'
import { ShoppingListCategoryLabels, ShoppingItemCategoryLabels } from '../../shared/types/ShoppingList'

interface Props {
  shoppingList?: ShoppingListWithFavorite | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: ShoppingListCreateInput | ShoppingListUpdateInput): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { uploading, uploadImage, deleteImage } = useImageUpload()

const formData = ref({
  title: '',
  description: '',
  image_url: '',
  category: 'weekly' as ShoppingListCategory,
  items: [] as ShoppingListItem[],
  tags: [] as string[],
  is_published: false
})

const newItem = ref({ item: '', quantity: '', category: 'others' as ShoppingItemCategory })
const newTag = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const oldImageUrl = ref<string>('')

const isEditMode = computed(() => !!props.shoppingList)

const categories = Object.values(ShoppingListCategory)
const itemCategories = Object.values(ShoppingItemCategory)

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    image_url: '',
    category: 'weekly' as ShoppingListCategory,
    items: [],
    tags: [],
    is_published: false
  }
  newItem.value = { item: '', quantity: '', category: 'others' as ShoppingItemCategory }
  newTag.value = ''
  selectedFile.value = null
  previewUrl.value = ''
  oldImageUrl.value = ''
}

// Carregar dados da lista quando estiver editando
watch(() => props.shoppingList, (newList) => {
  if (newList) {
    formData.value = {
      title: newList.title,
      description: newList.description || '',
      image_url: newList.image_url || '',
      category: newList.category,
      items: [...newList.items],
      tags: newList.tags ? [...newList.tags] : [],
      is_published: newList.is_published
    }
    oldImageUrl.value = newList.image_url || ''
    previewUrl.value = newList.image_url || ''
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
  formData.value.image_url = ''
}

// Adicionar item
const addItem = () => {
  if (newItem.value.item.trim() && newItem.value.quantity.trim()) {
    formData.value.items.push({ ...newItem.value })
    newItem.value = { item: '', quantity: '', category: 'others' as ShoppingItemCategory }
  }
}

// Remover item
const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

// Adicionar tag
const addTag = () => {
  if (newTag.value.trim() && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

// Remover tag
const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const handleSubmit = async () => {
  if (!formData.value.title.trim()) {
    alert('Título é obrigatório')
    return
  }

  if (formData.value.items.length === 0) {
    alert('Adicione pelo menos um item')
    return
  }

  let imageUrl = formData.value.image_url

  // Se selecionou nova imagem, fazer upload
  if (selectedFile.value) {
    const result = await uploadImage(selectedFile.value, 'thumbnails', 'shopping-lists')

    if (!result.success) {
      alert(result.error || 'Erro ao fazer upload da imagem')
      return
    }

    imageUrl = result.url || null

    // Se está editando e tinha imagem antiga, deletar do storage
    if (isEditMode.value && oldImageUrl.value && oldImageUrl.value !== imageUrl) {
      await deleteImage(oldImageUrl.value)
    }
  }

  const data = {
    title: formData.value.title,
    description: formData.value.description || null,
    image_url: imageUrl || null,
    category: formData.value.category,
    items: formData.value.items,
    tags: formData.value.tags.length > 0 ? formData.value.tags : null,
    is_published: formData.value.is_published
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
      <div class="bg-card rounded-lg shadow-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-foreground">
            {{ isEditMode ? 'Editar Lista de Compras' : 'Nova Lista de Compras' }}
          </h2>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors"
            @click="handleClose"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Grid: Informações Básicas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Título -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-foreground mb-1">
                Título *
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Lista Semanal - Básico"
              />
            </div>

            <!-- Descrição -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-foreground mb-1">
                Descrição
              </label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Breve descrição da lista"
              ></textarea>
            </div>

            <!-- Upload de Imagem -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-foreground mb-2">
                Imagem da Lista
              </label>

              <!-- Preview da imagem -->
              <div v-if="previewUrl" class="mb-3 relative">
                <img
                  :src="previewUrl"
                  alt="Preview"
                  class="w-full h-48 object-cover rounded-lg border border-border"
                />
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
                for="shopping-list-image-upload"
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
                  {{ uploading ? 'Fazendo upload...' : previewUrl ? 'Alterar imagem' : 'Escolher imagem do computador' }}
                </span>
              </label>
              <input
                id="shopping-list-image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                class="hidden"
                :disabled="uploading"
                @change="handleFileSelect"
              />
              <p class="text-xs text-muted-foreground mt-2">
                Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 5MB.
              </p>
            </div>

            <!-- Categoria -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">
                Categoria
              </label>
              <select
                v-model="formData.category"
                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ ShoppingListCategoryLabels[category] }}
                </option>
              </select>
            </div>
          </div>

          <!-- Itens da Lista -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">
              Itens da Lista *
            </h3>

            <!-- Lista de itens adicionados -->
            <div
              v-if="formData.items.length > 0"
              class="space-y-2 max-h-64 overflow-y-auto p-4 bg-muted/30 rounded-lg"
            >
              <div
                v-for="(item, index) in formData.items"
                :key="index"
                class="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
              >
                <div class="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <p class="text-sm font-medium text-foreground">{{ item.item }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">{{ item.quantity }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">{{ ShoppingItemCategoryLabels[item.category] }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Adicionar novo item -->
            <div class="p-4 bg-muted/30 rounded-lg space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  v-model="newItem.item"
                  type="text"
                  placeholder="Nome do item"
                  class="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  @keypress.enter.prevent="addItem"
                />
                <input
                  v-model="newItem.quantity"
                  type="text"
                  placeholder="Quantidade (ex: 1kg, 2 unidades)"
                  class="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  @keypress.enter.prevent="addItem"
                />
                <select
                  v-model="newItem.category"
                  class="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option
                    v-for="category in itemCategories"
                    :key="category"
                    :value="category"
                  >
                    {{ ShoppingItemCategoryLabels[category] }}
                  </option>
                </select>
              </div>
              <button
                type="button"
                @click="addItem"
                class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <PlusIcon class="w-4 h-4" />
                Adicionar Item
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-foreground">
              Tags
            </label>

            <!-- Tags adicionadas -->
            <div
              v-if="formData.tags.length > 0"
              class="flex flex-wrap gap-2"
            >
              <div
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="flex items-center gap-1 px-3 py-1 bg-muted text-foreground rounded-md text-sm"
              >
                <span>{{ tag }}</span>
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="text-muted-foreground hover:text-foreground"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </div>
            </div>

            <!-- Adicionar tag -->
            <div class="flex gap-2">
              <input
                v-model="newTag"
                type="text"
                placeholder="Ex: vegetariana, econômica"
                class="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                @keypress.enter.prevent="addTag"
              />
              <button
                type="button"
                @click="addTag"
                class="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm flex items-center gap-1"
              >
                <PlusIcon class="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>

          <!-- Publicar -->
          <div class="flex items-center gap-3">
            <input
              id="shopping-list-published"
              v-model="formData.is_published"
              type="checkbox"
              class="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label
              for="shopping-list-published"
              class="text-sm font-medium text-foreground cursor-pointer"
            >
              Publicar lista (tornar visível para usuárias)
            </label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              class="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              @click="handleClose"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              :disabled="uploading"
            >
              {{ isEditMode ? 'Salvar Alterações' : 'Criar Lista' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
