-- =====================================================
-- SCRIPT DE VERIFICAÇÃO: Tabelas de Comunidade
-- Execute este script no Supabase SQL Editor para verificar
-- =====================================================

-- 1. Verificar se as tabelas existem
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('community_posts', 'community_post_likes', 'community_post_comments')
ORDER BY table_name;

-- 2. Verificar colunas da tabela community_posts
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'community_posts'
ORDER BY ordinal_position;

-- 3. Verificar colunas da tabela community_post_likes
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'community_post_likes'
ORDER BY ordinal_position;

-- 4. Verificar colunas da tabela community_post_comments
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'community_post_comments'
ORDER BY ordinal_position;

-- 5. Verificar constraints (chaves estrangeiras, unique, etc)
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  CASE contype
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'f' THEN 'FOREIGN KEY'
    WHEN 'u' THEN 'UNIQUE'
    WHEN 'c' THEN 'CHECK'
    ELSE contype::text
  END AS constraint_description
FROM pg_constraint
WHERE conrelid IN (
  SELECT oid FROM pg_class
  WHERE relname IN ('community_posts', 'community_post_likes', 'community_post_comments')
)
ORDER BY conrelid::regclass::text, contype;

-- 6. Verificar índices criados
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments')
ORDER BY tablename, indexname;

-- 7. Verificar triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('community_posts', 'community_post_likes', 'community_post_comments')
ORDER BY event_object_table, trigger_name;

-- 8. Verificar RLS (Row Level Security)
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments')
ORDER BY tablename;

-- 9. Verificar policies RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments')
ORDER BY tablename, policyname;

-- 10. Contar registros (se houver dados)
SELECT
  'community_posts' AS table_name,
  COUNT(*) AS total_records
FROM public.community_posts
UNION ALL
SELECT
  'community_post_likes' AS table_name,
  COUNT(*) AS total_records
FROM public.community_post_likes
UNION ALL
SELECT
  'community_post_comments' AS table_name,
  COUNT(*) AS total_records
FROM public.community_post_comments;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
--
-- 1. Tabelas: 3 tabelas devem aparecer
-- 2. Colunas community_posts: 8 colunas (id, created_at, updated_at, user_id, content, is_published, likes_count, comments_count)
-- 3. Colunas community_post_likes: 4 colunas (id, created_at, post_id, user_id)
-- 4. Colunas community_post_comments: 6 colunas (id, created_at, updated_at, post_id, user_id, content)
-- 5. Constraints: PKs, FKs e UNIQUE constraint
-- 6. Índices: Mínimo de 8 índices
-- 7. Triggers: 6 triggers (2 para updated_at, 4 para contadores)
-- 8. RLS: Todas as 3 tabelas com RLS ativado (true)
-- 9. Policies: Mínimo de 11 policies
-- 10. Registros: Deve mostrar 0 para todas (se recém criado)
