-- =====================================================
-- SOLUÇÃO ALTERNATIVA: Criar profile via Database Webhook
-- =====================================================
--
-- Como não temos permissão para criar triggers em auth.users,
-- vamos usar uma abordagem diferente:
-- 1. Criar a função que será chamada via webhook
-- 2. Configurar webhook no Supabase Dashboard
--
-- =====================================================

-- =====================================================
-- FUNÇÃO: Criar profile para novo usuário
-- =====================================================

CREATE OR REPLACE FUNCTION public.create_profile_for_user(user_id uuid, user_email text, user_name text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_profile_id bigint;
BEGIN
  -- Verificar se já existe profile para este usuário
  IF EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = create_profile_for_user.user_id) THEN
    RETURN json_build_object('success', false, 'message', 'Profile já existe');
  END IF;

  -- Criar profile
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    create_profile_for_user.user_id,
    COALESCE(create_profile_for_user.user_name, create_profile_for_user.user_email),
    'user'
  )
  RETURNING id INTO new_profile_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Profile criado com sucesso',
    'profile_id', new_profile_id
  );
END;
$$;

-- =====================================================
-- ÍNDICE: Melhorar performance de busca por user_id
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- =====================================================
-- POPULAR: Criar profiles para usuários existentes
-- =====================================================

-- Execute este INSERT para criar profiles de usuários que ainda não têm
INSERT INTO public.profiles (user_id, name, role)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', u.email),
  'user'
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS (Documentação)
-- =====================================================

COMMENT ON FUNCTION public.create_profile_for_user IS
  'Cria um profile para um novo usuário. Será chamada via webhook do Supabase Auth';
