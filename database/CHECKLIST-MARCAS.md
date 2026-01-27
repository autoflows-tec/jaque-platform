# ✅ Checklist de Instalação - Página de Marcas

## 📋 Backend (Supabase)

### 1. Tabelas e Banco de Dados
- [ ] Executar `database/brands.sql` no SQL Editor do Supabase
- [ ] Verificar se tabelas foram criadas:
  ```sql
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('brands', 'brand_favorites');
  ```
  **Esperado**: 2 linhas (brands, brand_favorites)

### 2. Storage (Bucket para Logos)
- [ ] Criar bucket `brands` no Supabase Storage
  - Menu: Storage → New bucket
  - Nome: `brands`
  - Public: ✅ SIM (marcar como público)

- [ ] Configurar políticas do bucket (executar no SQL Editor):
  ```sql
  -- Admins podem fazer upload
  CREATE POLICY "Admins podem fazer upload de logos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'brands'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

  -- Admins podem deletar
  CREATE POLICY "Admins podem deletar logos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'brands'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

  -- Todos podem ver (público)
  CREATE POLICY "Logos são públicos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'brands');
  ```

### 3. Verificar RLS (Row Level Security)
- [ ] Confirmar políticas criadas:
  ```sql
  SELECT tablename, policyname
  FROM pg_policies
  WHERE tablename IN ('brands', 'brand_favorites');
  ```
  **Esperado**: 8 políticas (5 para brands, 3 para brand_favorites)

### 4. Verificar Triggers
- [ ] Confirmar triggers criados:
  ```sql
  SELECT trigger_name, event_object_table
  FROM information_schema.triggers
  WHERE event_object_table IN ('brands', 'brand_favorites');
  ```
  **Esperado**: 3 triggers

---

## 💻 Frontend (Aplicação)

### 1. Tipos TypeScript
- [x] ✅ `shared/types/Brand.ts` criado
- [x] ✅ Enum BrandCategory definido
- [x] ✅ Interfaces criadas

### 2. Store Pinia
- [x] ✅ `app/stores/useBrandsStore.ts` criado
- [x] ✅ CRUD completo implementado
- [x] ✅ Sistema de favoritos implementado

### 3. Componentes
- [x] ✅ `app/components/BrandCard.vue`
- [x] ✅ `app/components/BrandFilters.vue`
- [x] ✅ `app/components/BrandDetailModal.vue`
- [x] ✅ `app/components/AdminBrandForm.vue`

### 4. Página
- [x] ✅ `app/pages/marcas.vue` implementada

### 5. Composables
- [x] ✅ `app/composables/useImageUpload.ts` já existe (usado por outros módulos)

---

## 🧪 Testes

### 1. Testar como Usuário Normal
- [ ] Acessar `/marcas`
- [ ] Ver marcas publicadas
- [ ] Favoritar/desfavoritar marca
- [ ] Filtrar por categoria
- [ ] Abrir modal de detalhes
- [ ] Clicar em links externos

### 2. Testar como Admin
- [ ] Acessar `/marcas` como admin
- [ ] Ver botão "Nova Marca"
- [ ] Criar nova marca
  - [ ] Fazer upload de logo
  - [ ] Adicionar tags
  - [ ] Definir categoria
  - [ ] Publicar marca
- [ ] Editar marca existente
- [ ] Deletar marca (com confirmação)
- [ ] Ver marcas não publicadas (rascunhos)

### 3. Testar Filtros
- [ ] Filtro por categoria funciona
- [ ] Filtro "apenas em destaque" funciona
- [ ] Filtro "apenas favoritas" funciona
- [ ] Busca por nome funciona
- [ ] Limpar filtros funciona

---

## 🔧 Variáveis de Ambiente

Verificar se estão configuradas:
- [ ] `SUPABASE_URL` no `.env`
- [ ] `SUPABASE_KEY` no `.env`

---

## 📝 Dados de Teste (Opcional)

O script `brands.sql` inclui 3 marcas de exemplo. Você pode:

**Manter os dados:**
- Basta acessar `/marcas` e verá as 3 marcas

**Remover os dados:**
```sql
DELETE FROM brands WHERE created_by IS NULL;
```

**Criar suas próprias marcas:**
- Login como admin
- Ir em `/marcas`
- Clicar em "Nova Marca"
- Preencher formulário

---

## ⚠️ Troubleshooting

### Erro: "brands table does not exist"
→ Execute `database/brands.sql` novamente

### Erro: "bucket brands does not exist"
→ Crie o bucket manualmente no Storage

### Erro: "permission denied for table brands"
→ Verifique se as políticas RLS foram criadas

### Upload de logo não funciona
→ Verifique:
1. Bucket `brands` existe
2. Bucket está público
3. Políticas do bucket foram criadas
4. Você está logado como admin

### Marcas não aparecem
→ Verifique:
1. Marcas estão com `is_published = true`
2. RLS está configurado corretamente
3. Console do navegador para erros

---

## ✨ Resultado Final

Ao completar todos os itens, você terá:

✅ Sistema completo de marcas recomendadas
✅ Upload de logos
✅ Sistema de favoritos
✅ Filtros avançados
✅ CRUD admin completo
✅ Rating com estrelas
✅ Links externos funcionando
✅ Responsivo mobile/tablet/desktop

---

**Última atualização**: 27/01/2025
