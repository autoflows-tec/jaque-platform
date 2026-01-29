-- =====================================================
-- TRIGGER: Criar profile automaticamente ao cadastrar usuário
-- =====================================================
--
-- Este trigger cria automaticamente um registro na tabela profiles
-- sempre que um novo usuário é cadastrado no auth.users
--
-- =====================================================

-- =====================================================
-- FUNÇÃO: Criar profile para novo usuário
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email), -- Pega nome dos metadados ou usa email
    'user' -- Role padrão
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: Executar função ao criar usuário
-- =====================================================

-- Remover trigger se já existir (para poder recriar)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- COMENTÁRIOS (Documentação)
-- =====================================================

COMMENT ON FUNCTION public.handle_new_user() IS
  'Cria automaticamente um registro na tabela profiles quando um novo usuário é cadastrado';

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS
  'Trigger que executa handle_new_user() após inserção de novo usuário';

-- =====================================================
-- ÍNDICE: Melhorar performance de busca por user_id
-- =====================================================

-- Criar índice único em user_id se ainda não existir
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- =====================================================
-- OPCIONAL: Popular profiles para usuários já existentes
-- =====================================================

-- Execute este bloco APENAS se você já tem usuários sem profile
-- Descomente as linhas abaixo se necessário:

-- INSERT INTO public.profiles (user_id, name, role)
-- SELECT
--   u.id,
--   COALESCE(u.raw_user_meta_data->>'name', u.email),
--   'user'
-- FROM auth.users u
-- LEFT JOIN public.profiles p ON p.user_id = u.id
-- WHERE p.id IS NULL;
