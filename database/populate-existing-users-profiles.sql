-- =====================================================
-- POPULAR PROFILES PARA USUÁRIOS EXISTENTES
-- =====================================================
-- Execute este SQL para criar profiles para todos os usuários
-- que já existem na tabela auth.users mas não têm profile ainda
-- =====================================================

-- Inserir profiles para usuários sem profile
INSERT INTO public.profiles (user_id, name, role)
SELECT
  u.id AS user_id,
  COALESCE(
    u.raw_user_meta_data->>'name',  -- Tentar pegar nome dos metadados
    u.email                          -- Se não tiver, usar email
  ) AS name,
  'user' AS role                     -- Role padrão
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL;  -- Apenas usuários sem profile

-- Verificar quantos profiles foram criados
SELECT
  COUNT(*) AS total_profiles_criados
FROM public.profiles;

-- Listar todos os profiles criados
SELECT
  p.id,
  p.user_id,
  p.name,
  p.role,
  p.created_at,
  u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
ORDER BY p.created_at DESC;
