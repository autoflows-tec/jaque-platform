import { ref } from 'vue'

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
}

export const useImageUpload = () => {
  const supabase = useSupabaseClient()
  const uploading = ref(false)

  /**
   * Faz upload de imagem para o Supabase Storage
   * @param file - Arquivo de imagem
   * @param bucket - Nome do bucket (padrão: 'thumbnails')
   * @param folder - Pasta dentro do bucket (opcional)
   * @returns URL pública da imagem ou erro
   */
  const uploadImage = async (
    file: File,
    bucket: string = 'thumbnails',
    folder?: string
  ): Promise<ImageUploadResult> => {
    try {
      uploading.value = true

      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Tipo de arquivo inválido. Use JPG, PNG ou WebP.'
        }
      }

      // Validar tamanho (máx 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'Arquivo muito grande. Máximo de 5MB.'
        }
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 15)
      const fileName = `${timestamp}-${randomStr}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Erro ao fazer upload:', error)
        return {
          success: false,
          error: error.message
        }
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        success: true,
        url: publicUrlData.publicUrl
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error)
      return {
        success: false,
        error: error.message || 'Erro ao fazer upload da imagem'
      }
    } finally {
      uploading.value = false
    }
  }

  /**
   * Remove imagem do Supabase Storage
   * @param url - URL pública da imagem
   * @param bucket - Nome do bucket
   */
  const deleteImage = async (
    url: string,
    bucket: string = 'thumbnails'
  ): Promise<boolean> => {
    try {
      // Extrair caminho do arquivo da URL pública
      const urlParts = url.split(`/${bucket}/`)
      if (urlParts.length < 2) {
        console.error('URL inválida:', url)
        return false
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        console.error('Erro ao deletar imagem:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      return false
    }
  }

  return {
    uploading,
    uploadImage,
    deleteImage
  }
}
