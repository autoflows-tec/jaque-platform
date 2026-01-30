# Configuração de Mídia na Comunidade

Este documento explica como configurar o suporte a fotos e vídeos nos posts da comunidade.

## 1. Executar SQL para adicionar coluna

Execute o arquivo `community-media-support.sql` no SQL Editor do Supabase:

```sql
-- Adicionar coluna media_urls
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS media_urls text[];
```

## 2. Criar bucket no Supabase Storage

1. Acesse o Supabase Dashboard
2. Vá em **Storage** no menu lateral
3. Clique em **New Bucket**
4. Configure o bucket:
   - **Name**: `community-media`
   - **Public**: ❌ Desmarque (acesso controlado por RLS)
   - **Allowed MIME types**: `image/*,video/*`
   - **File size limit**: `52428800` (50MB)

## 3. Criar Políticas RLS para o bucket

Execute as seguintes políticas no SQL Editor:

### a) Permitir upload (usuários autenticados)

```sql
CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'community-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### b) Permitir visualização (todos os usuários autenticados)

```sql
CREATE POLICY "Anyone can view community media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'community-media');
```

### c) Permitir exclusão (apenas do próprio usuário)

```sql
CREATE POLICY "Users can delete their own media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'community-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 4. Estrutura de arquivos no Storage

Os arquivos serão organizados da seguinte forma:

```
community-media/
├─ {user_id_1}/
│  ├─ 1704067200000_abc123.jpg
│  └─ 1704067201000_def456.mp4
└─ {user_id_2}/
   ├─ 1704067300000_ghi789.jpg
   └─ 1704067301000_jkl012.png
```

Cada usuário tem sua própria pasta identificada pelo `user_id`.

## 5. Limites e Restrições

- **Máximo de mídias por post**: 4 arquivos
- **Tamanho máximo por arquivo**: 50MB
- **Formatos aceitos**:
  - Imagens: jpg, jpeg, png, gif, webp
  - Vídeos: mp4, webm, ogg, mov

## 6. Verificar se está funcionando

Depois de configurar:

1. Faça login na aplicação
2. Vá para a página Comunidade
3. Clique no ícone de foto ao criar um post
4. Selecione uma imagem ou vídeo
5. Publique o post
6. Verifique se a mídia aparece corretamente no feed

## Troubleshooting

### Erro: "Bucket not found"
- Certifique-se de que criou o bucket com o nome exato `community-media`

### Erro: "Policy violation"
- Verifique se as políticas RLS foram criadas corretamente
- Confirme que o usuário está autenticado

### Mídia não carrega
- Verifique se o bucket está com as permissões corretas
- Confirme que a política de SELECT está ativa
- Verifique o console do browser para erros específicos
