-- =====================================================
-- DEBUG: Verificar logs de atividades
-- =====================================================

-- 1. Verificar se a tabela existe
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'user_activity_logs'
) AS tabela_existe;

-- 2. Contar total de logs
SELECT COUNT(*) AS total_logs
FROM public.user_activity_logs;

-- 3. Ver todos os logs (últimos 20)
SELECT
  id,
  created_at,
  user_id,
  activity_type,
  activity_data,
  metadata
FROM public.user_activity_logs
ORDER BY created_at DESC
LIMIT 20;

-- 4. Contar logs por tipo
SELECT
  activity_type,
  COUNT(*) AS quantidade
FROM public.user_activity_logs
GROUP BY activity_type
ORDER BY quantidade DESC;

-- 5. Ver logs com perfil do usuário
SELECT
  l.id,
  l.created_at,
  l.activity_type,
  p.name AS usuario_nome,
  p.role AS usuario_role,
  l.activity_data
FROM public.user_activity_logs l
LEFT JOIN public.profiles p ON p.user_id = l.user_id
ORDER BY l.created_at DESC
LIMIT 20;

-- 6. Verificar RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'user_activity_logs';

-- 7. Testar se seu usuário é admin
SELECT
  id,
  user_id,
  name,
  role
FROM public.profiles
WHERE user_id = auth.uid();
