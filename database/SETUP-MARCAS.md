# Setup da Página de Marcas - Supabase

## 📋 Passo a Passo

### 1. Executar o Script SQL no Supabase

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Abra o arquivo `database/brands.sql` e copie todo o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **Run** ou pressione `Ctrl + Enter`

### 2. O que o script cria:

#### ✅ Tabela `brands`
- `id` - ID único da marca
- `created_at` / `updated_at` - Timestamps automáticos
- `name` - Nome da marca (obrigatório)
- `description` - Descrição detalhada
- `logo_url` - URL do logo
- `category` - Categoria (enum: alimentos, suplementos, utensilios, livros, outros)
- `website_url` - Site oficial
- `affiliate_link` - Link de afiliado/desconto
- `tags` - Array de tags
- `is_featured` - Marca em destaque (boolean)
- `is_published` - Marca publicada/visível (boolean)
- `rating` - Avaliação de 1 a 5
- `favorites_count` - Contador de favoritos (atualizado automaticamente)
- `created_by` - ID do usuário que criou (admin)

#### ✅ Tabela `brand_favorites`
- `id` - ID único do favorito
- `created_at` - Timestamp
- `brand_id` - Referência à marca
- `user_id` - Referência ao usuário
- Constraint única: um usuário só pode favoritar uma marca uma vez

#### ✅ Enum `brand_category`
- `alimentos`
- `suplementos`
- `utensilios`
- `livros`
- `outros`

#### ✅ Índices para Performance
- Índices em `category`, `is_published`, `is_featured`, `created_at`, `name`
- Índice GIN em `tags` para busca eficiente
- Índices em favoritos para queries rápidas

#### ✅ Triggers Automáticos
- **Atualização de `updated_at`**: Atualiza automaticamente ao editar marca
- **Contador de favoritos**: Incrementa/decrementa automaticamente quando usuário favorita/desfavorita

#### ✅ Row Level Security (RLS)
**Brands:**
- ✅ Todos podem ver marcas publicadas
- ✅ Admins podem ver TODAS as marcas (incluindo rascunhos)
- ✅ Admins podem criar, editar e deletar marcas

**Brand Favorites:**
- ✅ Usuários autenticados podem ver favoritos
- ✅ Usuários podem favoritar/desfavoritar marcas
- ✅ Usuários só podem deletar seus próprios favoritos

## 🎨 Storage para Logos

### Criar Bucket para Logos

1. No Supabase, vá em **Storage** (menu lateral)
2. Clique em **Create Bucket**
3. Nome: `brands` (ou `logos`)
4. **Public**: `true` (para logos serem públicos)
5. Clique em **Create**

### Configurar Políticas do Bucket

Execute no SQL Editor:

```sql
-- Permitir upload de logos apenas para admins
CREATE POLICY "Admins podem fazer upload de logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'brands'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Permitir deletar logos apenas para admins
CREATE POLICY "Admins podem deletar logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'brands'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Todos podem ver logos (público)
CREATE POLICY "Logos são públicos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'brands');
```

## 🧪 Testando

### Verificar Tabelas Criadas
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('brands', 'brand_favorites');
```

### Verificar Políticas RLS
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('brands', 'brand_favorites');
```

### Verificar Dados de Exemplo (se inseriu)
```sql
SELECT id, name, category, is_published, is_featured, favorites_count
FROM brands;
```

## 📝 Dados de Exemplo

O script inclui 3 marcas de exemplo. Para remover, execute:
```sql
DELETE FROM brands WHERE created_by IS NULL;
```

## 🔧 Troubleshooting

### Erro: "relation already exists"
Se você já executou o script antes, delete as tabelas:
```sql
DROP TABLE IF EXISTS brand_favorites CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TYPE IF EXISTS brand_category CASCADE;
```

### Erro: "permission denied"
Verifique se você está usando um usuário com permissões de admin no Supabase.

### Favoritos não atualizam o contador
Verifique se os triggers foram criados:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'brand_favorites';
```

## ✨ Próximos Passos

1. ✅ Execute o script `database/brands.sql`
2. ✅ Crie o bucket de storage `brands`
3. ✅ Configure as políticas do bucket
4. ✅ Teste a página `/marcas` na aplicação
5. ✅ Crie sua primeira marca como admin!

---

**Observação**: Certifique-se de que a tabela `profiles` existe e tem o campo `role` para as políticas RLS funcionarem corretamente.
