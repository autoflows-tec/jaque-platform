<script setup lang="ts">
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useImageUpload } from '~/composables/useImageUpload'
import type {
  RecipeWithFavorite,
  RecipeCreateInput,
  RecipeUpdateInput,
  RecipeIngredient,
  RecipeCategory,
  RecipeDifficulty
} from '../../shared/types/Recipe'
import { RecipeCategoryLabels, RecipeDifficultyLabels } from '../../shared/types/Recipe'

interface Props {
  recipe?: RecipeWithFavorite | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: RecipeCreateInput | RecipeUpdateInput): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { uploading, uploadImage, deleteImage } = useImageUpload()

const formData = ref({
  title: '',
  description: '',
  image_url: '',
  category: 'lunch' as RecipeCategory,
  difficulty: 'medium' as RecipeDifficulty,
  prep_time_minutes: null as number | null,
  cook_time_minutes: null as number | null,
  servings: 1,
  ingredients: [] as RecipeIngredient[],
  instructions: [] as string[],
  calories_per_serving: null as number | null,
  tags: [] as string[],
  is_published: false
})

const newIngredient = ref({ item: '', amount: '' })
const newInstruction = ref('')
const newTag = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const oldImageUrl = ref<string>('')

const isEditMode = computed(() => !!props.recipe)

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    image_url: '',
    category: 'lunch' as RecipeCategory,
    difficulty: 'medium' as RecipeDifficulty,
    prep_time_minutes: null,
    cook_time_minutes: null,
    servings: 1,
    ingredients: [],
    instructions: [],
    calories_per_serving: null,
    tags: [],
    is_published: false
  }
  newIngredient.value = { item: '', amount: '' }
  newInstruction.value = ''
  newTag.value = ''
  selectedFile.value = null
  previewUrl.value = ''
  oldImageUrl.value = ''
}

// Carregar dados da receita quando estiver editando
watch(() => props.recipe, (newRecipe) => {
  if (newRecipe) {
    formData.value = {
      title: newRecipe.title,
      description: newRecipe.description || '',
      image_url: newRecipe.image_url || '',
      category: newRecipe.category,
      difficulty: newRecipe.difficulty,
      prep_time_minutes: newRecipe.prep_time_minutes,
      cook_time_minutes: newRecipe.cook_time_minutes,
      servings: newRecipe.servings,
      ingredients: [...newRecipe.ingredients],
      instructions: [...newRecipe.instructions],
      calories_per_serving: newRecipe.calories_per_serving,
      tags: newRecipe.tags ? [...newRecipe.tags] : [],
      is_published: newRecipe.is_published
    }
    oldImageUrl.value = newRecipe.image_url || ''
    previewUrl.value = newRecipe.image_url || ''
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

// Adicionar ingrediente
const addIngredient = () => {
  if (newIngredient.value.item.trim() && newIngredient.value.amount.trim()) {
    formData.value.ingredients.push({ ...newIngredient.value })
    newIngredient.value = { item: '', amount: '' }
  }
}

// Remover ingrediente
const removeIngredient = (index: number) => {
  formData.value.ingredients.splice(index, 1)
}

// Adicionar instrução
const addInstruction = () => {
  if (newInstruction.value.trim()) {
    formData.value.instructions.push(newInstruction.value.trim())
    newInstruction.value = ''
  }
}

// Remover instrução
const removeInstruction = (index: number) => {
  formData.value.instructions.splice(index, 1)
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

  if (formData.value.ingredients.length === 0) {
    alert('Adicione pelo menos um ingrediente')
    return
  }

  if (formData.value.instructions.length === 0) {
    alert('Adicione pelo menos uma instrução')
    return
  }

  let imageUrl = formData.value.image_url

  // Se selecionou nova imagem, fazer upload
  if (selectedFile.value) {
    const result = await uploadImage(selectedFile.value, 'thumbnails', 'recipes')

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
    difficulty: formData.value.difficulty,
    prep_time_minutes: formData.value.prep_time_minutes,
    cook_time_minutes: formData.value.cook_time_minutes,
    servings: formData.value.servings,
    ingredients: formData.value.ingredients,
    instructions: formData.value.instructions,
    calories_per_serving: formData.value.calories_per_serving,
    nutritional_info: null,
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
      id="admin-recipe-form-modal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div class="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-2xl font-bold text-foreground">
            {{ isEditMode ? 'Editar Receita' : 'Nova Receita' }}
          </h2>
          <button
            class="p-2 hover:bg-muted rounded-lg transition-colors"
            @click="handleClose"
          >
            <XMarkIcon class="w-6 h-6 text-foreground" />
          </button>
        </div>

        <!-- Form scrollável -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Informações básicas -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-foreground">Informações Básicas</h3>

            <!-- Título -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">
                Título *
              </label>
              <input
                v-model="formData.title"
                type="text"
                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nome da receita"
              />
            </div>

            <!-- Descrição -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">
                Descrição
              </label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Breve descrição da receita"
              ></textarea>
            </div>

            <!-- Upload de Imagem -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Imagem da Receita
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
                for="recipe-image-upload"
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
                id="recipe-image-upload"
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

            <!-- Grid: Categoria, Dificuldade -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">
                  Categoria *
                </label>
                <select
                  v-model="formData.category"
                  class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option
                    v-for="(label, value) in RecipeCategoryLabels"
                    :key="value"
                    :value="value"
                  >
                    {{ label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">
                  Dificuldade *
                </label>
                <select
                  v-model="formData.difficulty"
                  class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option
                    v-for="(label, value) in RecipeDifficultyLabels"
                    :key="value"
                    :value="value"
                  >
                    {{ label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Grid: Tempos e porções -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">
                  Tempo de Preparo (min)
                </label>
                <input
                  v-model.number="formData.prep_time_minutes"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">
                  Tempo de Cozimento (min)
                </label>
                <input
                  v-model.number="formData.cook_time_minutes"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">
                  Porções *
                </label>
                <input
                  v-model.number="formData.servings"
                  type="number"
                  min="1"
                  class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <!-- Calorias -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">
                Calorias por Porção
              </label>
              <input
                v-model.number="formData.calories_per_serving"
                type="number"
                min="0"
                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <!-- Ingredientes -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-foreground">Ingredientes *</h3>

            <!-- Lista de ingredientes -->
            <ul class="space-y-2">
              <li
                v-for="(ingredient, index) in formData.ingredients"
                :key="index"
                class="flex items-center gap-2 p-2 bg-muted rounded-lg"
              >
                <span class="flex-1 text-sm text-foreground">
                  <span class="font-medium">{{ ingredient.amount }}</span> {{ ingredient.item }}
                </span>
                <button
                  class="p-1 hover:bg-destructive/10 text-destructive rounded"
                  @click="removeIngredient(index)"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </li>
            </ul>

            <!-- Adicionar ingrediente -->
            <div class="flex gap-2">
              <input
                v-model="newIngredient.amount"
                type="text"
                class="w-1/3 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Quantidade"
                @keyup.enter="addIngredient"
              />
              <input
                v-model="newIngredient.item"
                type="text"
                class="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Ingrediente"
                @keyup.enter="addIngredient"
              />
              <button
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                @click="addIngredient"
              >
                <PlusIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Modo de preparo -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-foreground">Modo de Preparo *</h3>

            <!-- Lista de instruções -->
            <ol class="space-y-2">
              <li
                v-for="(step, index) in formData.instructions"
                :key="index"
                class="flex gap-2 p-2 bg-muted rounded-lg"
              >
                <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                  {{ index + 1 }}
                </span>
                <span class="flex-1 text-sm text-foreground">{{ step }}</span>
                <button
                  class="p-1 hover:bg-destructive/10 text-destructive rounded"
                  @click="removeInstruction(index)"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </li>
            </ol>

            <!-- Adicionar instrução -->
            <div class="flex gap-2">
              <textarea
                v-model="newInstruction"
                rows="2"
                class="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                placeholder="Descreva o passo"
                @keyup.enter.exact="addInstruction"
              ></textarea>
              <button
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors self-start"
                @click="addInstruction"
              >
                <PlusIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-foreground">Tags</h3>

            <!-- Lista de tags -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {{ tag }}
                <button
                  class="hover:text-primary/70"
                  @click="removeTag(index)"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </span>
            </div>

            <!-- Adicionar tag -->
            <div class="flex gap-2">
              <input
                v-model="newTag"
                type="text"
                class="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Ex: sem-gluten, vegano, low-carb"
                @keyup.enter="addTag"
              />
              <button
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                @click="addTag"
              >
                <PlusIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Publicar -->
          <div class="flex items-center gap-2">
            <input
              id="is-published"
              v-model="formData.is_published"
              type="checkbox"
              class="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary"
            />
            <label
              for="is-published"
              class="text-sm font-medium text-foreground cursor-pointer"
            >
              Publicar receita
            </label>
          </div>
        </div>

        <!-- Footer com botões -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            class="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            @click="handleClose"
          >
            Cancelar
          </button>
          <button
            class="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            @click="handleSubmit"
          >
            {{ isEditMode ? 'Salvar Alterações' : 'Criar Receita' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
