-- =====================================================
-- ADICIONAR SUPORTE A MÍDIA (FOTOS/VÍDEOS) NOS POSTS DA COMUNIDADE
-- =====================================================

-- 1. Adicionar coluna media_urls na tabela community_posts
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS media_urls text[];

-- 2. Criar bucket para mídia da comunidade no Supabase Storage
-- IMPORTANTE: Execute este comando via Dashboard do Supabase > Storage > New Bucket
-- Nome do bucket: "community-media"
-- Configurações:
--   - Public: false (acesso controlado por RLS)
--   - Allowed MIME types: image/*, video/*
--   - Max file size: 50MB

-- 3. Políticas de acesso ao bucket "community-media"

-- Política: Usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'community-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política: Usuários podem visualizar toda mídia da comunidade
CREATE POLICY "Anyone can view community media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'community-media');

-- Política: Usuários podem deletar apenas suas próprias mídias
CREATE POLICY "Users can delete their own media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'community-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Comentário sobre estrutura de pastas no storage
-- A estrutura será: community-media/{user_id}/{timestamp}_{filename}
-- Exemplo: community-media/123e4567-e89b-12d3-a456-426614174000/1704067200000_foto.jpg
