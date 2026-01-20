-- =====================================================
-- VERIFICAÇÃO RÁPIDA: Sistema de Comunidade
-- Execute este script para um check rápido
-- =====================================================

-- ✅ VERIFICAÇÃO 1: Tabelas existem?
SELECT
  CASE
    WHEN COUNT(*) = 3 THEN '✅ OK - Todas as 3 tabelas existem'
    ELSE '❌ ERRO - Faltam tabelas. Encontradas: ' || COUNT(*)::text
  END AS status_tabelas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('community_posts', 'community_post_likes', 'community_post_comments');

-- ✅ VERIFICAÇÃO 2: RLS está ativado?
SELECT
  tablename,
  CASE
    WHEN rowsecurity = true THEN '✅ Ativado'
    ELSE '❌ Desativado'
  END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments')
ORDER BY tablename;

-- ✅ VERIFICAÇÃO 3: Triggers estão criados?
SELECT
  CASE
    WHEN COUNT(*) >= 6 THEN '✅ OK - ' || COUNT(*)::text || ' triggers encontrados'
    ELSE '⚠️ ATENÇÃO - Apenas ' || COUNT(*)::text || ' triggers (esperado: 6)'
  END AS status_triggers
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('community_posts', 'community_post_likes', 'community_post_comments');

-- ✅ VERIFICAÇÃO 4: Policies RLS estão criadas?
SELECT
  CASE
    WHEN COUNT(*) >= 11 THEN '✅ OK - ' || COUNT(*)::text || ' policies encontradas'
    ELSE '⚠️ ATENÇÃO - Apenas ' || COUNT(*)::text || ' policies (esperado: 11+)'
  END AS status_policies
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments');

-- ✅ VERIFICAÇÃO 5: Índices estão criados?
SELECT
  CASE
    WHEN COUNT(*) >= 8 THEN '✅ OK - ' || COUNT(*)::text || ' índices criados'
    ELSE '⚠️ ATENÇÃO - Apenas ' || COUNT(*)::text || ' índices (esperado: 8+)'
  END AS status_indices
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments')
  AND indexname NOT LIKE '%pkey%'; -- Excluir índices PK automáticos

-- ✅ VERIFICAÇÃO 6: Teste de inserção (simula criação de post)
-- NOTA: Isto NÃO vai inserir dados de verdade, apenas testa se a estrutura permite
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'community_posts'
        AND column_name = 'content'
        AND data_type = 'text'
    ) THEN '✅ OK - Estrutura de posts pronta'
    ELSE '❌ ERRO - Coluna content não encontrada'
  END AS status_estrutura;

-- 📊 RESUMO FINAL
SELECT
  '🎯 RESUMO DA VERIFICAÇÃO' AS titulo,
  '' AS separador;

SELECT
  'Tabelas' AS item,
  COUNT(*)::text || '/3' AS resultado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('community_posts', 'community_post_likes', 'community_post_comments')
UNION ALL
SELECT
  'Triggers' AS item,
  COUNT(*)::text || '/6+' AS resultado
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('community_posts', 'community_post_likes', 'community_post_comments')
UNION ALL
SELECT
  'Policies' AS item,
  COUNT(*)::text || '/11+' AS resultado
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments')
UNION ALL
SELECT
  'Índices' AS item,
  COUNT(*)::text || '/8+' AS resultado
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'community_post_likes', 'community_post_comments')
  AND indexname NOT LIKE '%pkey%';
