-- =====================================================
-- SQL MIGRATION: Sistema de Chat IA para Receitas
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Criar ENUMs
CREATE TYPE message_role AS ENUM ('user', 'assistant');
CREATE TYPE conversation_status AS ENUM ('active', 'archived');

-- 2. Criar tabela de conversas
CREATE TABLE chat_conversations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Relacionamento com usuário
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Informações da conversa
  title TEXT,
  status conversation_status NOT NULL DEFAULT 'active',

  -- Contadores denormalizados
  messages_count INTEGER NOT NULL DEFAULT 0,

  -- Última mensagem (para ordenação e preview)
  last_message_at TIMESTAMPTZ
);

-- 3. Criar tabela de mensagens
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Relacionamentos
  conversation_id BIGINT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteúdo
  role message_role NOT NULL,
  content TEXT NOT NULL,

  -- Estado (para UI de loading durante processamento)
  is_loading BOOLEAN NOT NULL DEFAULT FALSE,

  -- Metadados opcionais
  error_message TEXT
);

-- 4. Criar índices para performance
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX idx_chat_conversations_last_message_at ON chat_conversations(last_message_at DESC);
CREATE INDEX idx_chat_conversations_created_at ON chat_conversations(created_at DESC);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at ASC);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);

-- 5. Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_chat_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_chat_conversation_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_conversation_updated_at();

-- 6. Criar trigger para atualizar contador de mensagens
CREATE OR REPLACE FUNCTION update_chat_messages_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chat_conversations
    SET
      messages_count = messages_count + 1,
      last_message_at = NEW.created_at,
      updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE chat_conversations
    SET
      messages_count = GREATEST(messages_count - 1, 0),
      updated_at = NOW()
    WHERE id = OLD.conversation_id;

    -- Atualizar last_message_at para a mensagem mais recente restante
    UPDATE chat_conversations
    SET last_message_at = (
      SELECT MAX(created_at)
      FROM chat_messages
      WHERE conversation_id = OLD.conversation_id
    )
    WHERE id = OLD.conversation_id;

    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_chat_messages_count_insert
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_messages_count();

CREATE TRIGGER trigger_chat_messages_count_delete
  AFTER DELETE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_messages_count();

-- 7. Criar trigger para auto-gerar título da conversa
CREATE OR REPLACE FUNCTION auto_generate_conversation_title()
RETURNS TRIGGER AS $$
BEGIN
  -- Se é a primeira mensagem do usuário e a conversa não tem título
  IF NEW.role = 'user' AND NEW.conversation_id IN (
    SELECT id FROM chat_conversations WHERE title IS NULL
  ) THEN
    UPDATE chat_conversations
    SET title = CASE
      WHEN LENGTH(NEW.content) <= 50 THEN NEW.content
      ELSE SUBSTRING(NEW.content FROM 1 FOR 47) || '...'
    END
    WHERE id = NEW.conversation_id AND title IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_title
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_conversation_title();

-- 8. Habilitar Row Level Security (RLS)
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 9. Políticas de segurança para chat_conversations

-- Usuários podem ver apenas suas próprias conversas
CREATE POLICY "Usuários veem apenas suas conversas"
  ON chat_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias conversas
CREATE POLICY "Usuários podem criar conversas"
  ON chat_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias conversas
CREATE POLICY "Usuários podem atualizar suas conversas"
  ON chat_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem deletar suas próprias conversas
CREATE POLICY "Usuários podem deletar suas conversas"
  ON chat_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- 10. Políticas de segurança para chat_messages

-- Usuários podem ver mensagens de suas conversas
CREATE POLICY "Usuários veem mensagens de suas conversas"
  ON chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- Usuários podem criar mensagens em suas conversas
CREATE POLICY "Usuários podem criar mensagens"
  ON chat_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- Usuários podem atualizar suas mensagens (para is_loading e error_message)
CREATE POLICY "Usuários podem atualizar suas mensagens"
  ON chat_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- Usuários podem deletar mensagens de suas conversas
CREATE POLICY "Usuários podem deletar suas mensagens"
  ON chat_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL - remova se não quiser)
-- =====================================================

-- Exemplo: criar uma conversa e mensagens de teste
-- ATENÇÃO: Substitua 'SEU_USER_ID_AQUI' por um UUID real de auth.users
/*
INSERT INTO chat_conversations (user_id, title) VALUES
('SEU_USER_ID_AQUI', 'Conversa de teste sobre frango');

INSERT INTO chat_messages (conversation_id, user_id, role, content) VALUES
(
  (SELECT id FROM chat_conversations WHERE title = 'Conversa de teste sobre frango' LIMIT 1),
  'SEU_USER_ID_AQUI',
  'user',
  'Tenho frango, batata e brócolis. O que posso fazer?'
),
(
  (SELECT id FROM chat_conversations WHERE title = 'Conversa de teste sobre frango' LIMIT 1),
  'SEU_USER_ID_AQUI',
  'assistant',
  'Que tal um delicioso frango assado com batatas e brócolis no forno? Aqui está uma receita simples e saudável...'
);
*/

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('chat_conversations', 'chat_messages');

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('chat_conversations', 'chat_messages')
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE event_object_table IN ('chat_conversations', 'chat_messages')
ORDER BY event_object_table, trigger_name;

-- Ver estrutura das tabelas
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('chat_conversations', 'chat_messages')
ORDER BY table_name, ordinal_position;
