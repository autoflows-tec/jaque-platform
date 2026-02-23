-- =====================================================
-- TABELA: user_activity_logs
-- Registra atividades das alunas para visualização admin
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id
  ON public.user_activity_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_activity_type
  ON public.user_activity_logs(activity_type);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at
  ON public.user_activity_logs(created_at DESC);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Política 1: Apenas admins podem visualizar todos os logs
CREATE POLICY "Admins can view all activity logs"
  ON public.user_activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Política 2: Todos os usuários autenticados podem inserir seus próprios logs
CREATE POLICY "Users can insert their own activity logs"
  ON public.user_activity_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.user_activity_logs IS 'Registra atividades das alunas para visualização pelos administradores';
COMMENT ON COLUMN public.user_activity_logs.activity_type IS 'Tipo de atividade (LOGIN, QUIZ_COMPLETED, LESSON_WATCHED, etc.)';
COMMENT ON COLUMN public.user_activity_logs.activity_data IS 'Dados específicos da atividade em formato JSON';
COMMENT ON COLUMN public.user_activity_logs.metadata IS 'Metadados adicionais (IP, user agent, etc.)';
