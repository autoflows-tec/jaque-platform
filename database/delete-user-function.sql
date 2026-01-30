-- =====================================================
-- FUNÇÃO: Deletar usuário via SQL
-- =====================================================
--
-- Esta função permite deletar usuários usando SECURITY DEFINER
-- para ter permissões necessárias na tabela auth.users
--
-- =====================================================

-- Criar função para deletar usuário
CREATE OR REPLACE FUNCTION public.delete_user_by_id(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  -- Buscar email do usuário antes de deletar (para log)
  SELECT email INTO user_email FROM auth.users WHERE id = target_user_id;

  -- Verificar se usuário existe
  IF user_email IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Usuário não encontrado'
    );
  END IF;

  -- Deletar usuário (profile será deletado automaticamente pelo CASCADE)
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Usuário deletado com sucesso',
    'email', user_email,
    'user_id', target_user_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Erro ao deletar usuário: ' || SQLERRM
    );
END;
$$;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON FUNCTION public.delete_user_by_id IS
  'Deleta um usuário pelo ID. O profile será deletado automaticamente pelo CASCADE.';

-- =====================================================
-- EXEMPLO DE USO
-- =====================================================

-- Deletar usuário específico
-- SELECT public.delete_user_by_id('532c5c47-ea80-4a83-b1fb-1af92898af3d');

-- =====================================================
-- FUNÇÃO ALTERNATIVA: Deletar por email
-- =====================================================

CREATE OR REPLACE FUNCTION public.delete_user_by_email(target_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Buscar ID do usuário pelo email
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

  -- Verificar se usuário existe
  IF target_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Usuário não encontrado com esse email'
    );
  END IF;

  -- Deletar usuário
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Usuário deletado com sucesso',
    'email', target_email,
    'user_id', target_user_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Erro ao deletar usuário: ' || SQLERRM
    );
END;
$$;

COMMENT ON FUNCTION public.delete_user_by_email IS
  'Deleta um usuário pelo email. O profile será deletado automaticamente pelo CASCADE.';

-- =====================================================
-- EXEMPLO DE USO POR EMAIL
-- =====================================================

-- SELECT public.delete_user_by_email('usuario@example.com');
