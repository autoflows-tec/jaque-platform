-- =====================================================
-- ALTERAÇÕES: Permitir usuários criarem receitas pessoais
-- =====================================================
--
-- Este script adiciona políticas RLS para permitir que:
-- 1. Usuários vejam suas próprias receitas (mesmo não publicadas)
-- 2. Usuários autenticados possam criar suas próprias receitas
-- 3. Usuários possam editar suas próprias receitas
-- 4. Usuários possam deletar suas próprias receitas
--
-- =====================================================

-- =====================================================
-- POLICY: Usuários podem ver suas próprias receitas
-- =====================================================

CREATE POLICY "Users can view their own recipes"
  ON public.recipes
  FOR SELECT
  USING (auth.uid() = created_by);

-- =====================================================
-- POLICY: Usuários podem criar suas próprias receitas
-- =====================================================

CREATE POLICY "Authenticated users can insert their own recipes"
  ON public.recipes
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- =====================================================
-- POLICY: Usuários podem atualizar suas próprias receitas
-- =====================================================

CREATE POLICY "Users can update their own recipes"
  ON public.recipes
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- =====================================================
-- POLICY: Usuários podem deletar suas próprias receitas
-- =====================================================

CREATE POLICY "Users can delete their own recipes"
  ON public.recipes
  FOR DELETE
  USING (auth.uid() = created_by);

-- =====================================================
-- COMENTÁRIOS (Documentação)
-- =====================================================

COMMENT ON POLICY "Users can view their own recipes" ON public.recipes IS
  'Permite que usuários vejam suas próprias receitas, mesmo que não publicadas';

COMMENT ON POLICY "Authenticated users can insert their own recipes" ON public.recipes IS
  'Permite que usuários autenticados criem suas próprias receitas pessoais';

COMMENT ON POLICY "Users can update their own recipes" ON public.recipes IS
  'Permite que usuários editem apenas suas próprias receitas';

COMMENT ON POLICY "Users can delete their own recipes" ON public.recipes IS
  'Permite que usuários deletem apenas suas próprias receitas';
