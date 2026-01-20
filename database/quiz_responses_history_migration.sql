-- =====================================================
-- MIGRATION: Permitir múltiplos quiz responses por usuário
-- Objetivo: Criar histórico de quizzes ao longo do tempo
-- =====================================================

-- 1. Remover constraint unique que impede múltiplos quizzes
ALTER TABLE public.quiz_responses
DROP CONSTRAINT IF EXISTS quiz_responses_user_id_unique;

-- 2. Adicionar índice composto para buscar histórico ordenado eficientemente
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_history
ON public.quiz_responses (user_id, created_at DESC);

-- 3. Comentário atualizado
COMMENT ON TABLE public.quiz_responses IS 'Armazena histórico de respostas do quiz inicial (permite múltiplas versões por usuário)';
COMMENT ON INDEX idx_quiz_responses_user_history IS 'Índice para buscar histórico de quizzes de um usuário ordenado por data';
