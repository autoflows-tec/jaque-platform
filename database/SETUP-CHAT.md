# Guia de Instalação: Chat IA - Receitas

Este guia cobre a instalação completa do sistema de Chat IA integrado com webhook externo para sugestões de receitas.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Passo 1: Executar Migration SQL](#passo-1-executar-migration-sql)
3. [Passo 2: Verificar Tabelas](#passo-2-verificar-tabelas)
4. [Passo 3: Testar RLS Policies](#passo-3-testar-rls-policies)
5. [Passo 4: Verificar Webhook](#passo-4-verificar-webhook)
6. [Passo 5: Testar Frontend](#passo-5-testar-frontend)
7. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

- ✅ Projeto Nuxt 4 configurado
- ✅ Supabase configurado com autenticação ativa
- ✅ Webhook externo ativo: `https://webhook.namasteagrofloresta.com.br/webhook/jaque-ia-receitas`
- ✅ Variáveis de ambiente configuradas (.env)

---

## Passo 1: Executar Migration SQL

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Crie uma nova query
4. Cole todo o conteúdo do arquivo: `/database/chat-ia-receitas.sql`
5. Execute o script completo

### ⚠️ O que este script cria:

- **ENUMs**:
  - `message_role` (user, assistant)
  - `conversation_status` (active, archived)

- **Tabelas**:
  - `chat_conversations` (conversas dos usuários)
  - `chat_messages` (mensagens individuais)

- **Triggers**:
  - `set_updated_at` (atualiza timestamp automaticamente)
  - `auto_generate_conversation_title` (gera título da primeira mensagem)
  - `update_conversation_message_count` (contador de mensagens)
  - `update_conversation_last_message_at` (timestamp da última mensagem)

- **RLS Policies**:
  - Usuários podem ver apenas suas conversas
  - Usuários podem criar conversas e mensagens
  - Usuários podem deletar apenas suas conversas
  - Admins podem tudo (via claims)

- **Indexes**:
  - Performance em buscas por user_id, conversation_id, timestamps

---

## Passo 2: Verificar Tabelas

Execute as queries abaixo no **SQL Editor** para verificar se tudo foi criado:

### 2.1 Verificar ENUMs

```sql
-- Ver valores do enum message_role
SELECT enum_range(NULL::message_role);

-- Ver valores do enum conversation_status
SELECT enum_range(NULL::conversation_status);
```

**Resultado esperado**:
- `message_role`: `{user, assistant}`
- `conversation_status`: `{active, archived}`

---

### 2.2 Verificar Estrutura das Tabelas

```sql
-- Ver colunas de chat_conversations
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'chat_conversations'
ORDER BY ordinal_position;

-- Ver colunas de chat_messages
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'chat_messages'
ORDER BY ordinal_position;
```

**Verifique se existem as colunas principais**:
- `chat_conversations`: id, created_at, updated_at, user_id, title, status, messages_count, last_message_at
- `chat_messages`: id, created_at, conversation_id, user_id, role, content, is_loading, error_message

---

### 2.3 Verificar Triggers

```sql
-- Listar triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table IN ('chat_conversations', 'chat_messages');
```

**Resultado esperado** (4 triggers):
- `set_updated_at_conversations` → UPDATE em chat_conversations
- `auto_generate_title_trigger` → INSERT em chat_messages
- `update_message_count_trigger` → INSERT/DELETE em chat_messages
- `update_last_message_at_trigger` → INSERT em chat_messages

---

### 2.4 Verificar Indexes

```sql
-- Listar indexes criados
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename IN ('chat_conversations', 'chat_messages')
  AND schemaname = 'public';
```

**Resultado esperado** (7 indexes):
- `idx_chat_conversations_user_id`
- `idx_chat_conversations_status`
- `idx_chat_conversations_last_message_at`
- `idx_chat_messages_conversation_id`
- `idx_chat_messages_user_id`
- `idx_chat_messages_role`
- `idx_chat_messages_created_at`

---

## Passo 3: Testar RLS Policies

### 3.1 Verificar Políticas Criadas

```sql
-- Listar RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('chat_conversations', 'chat_messages');
```

**Resultado esperado** (8 policies):

**chat_conversations** (5 policies):
- `Users can view own conversations`
- `Users can create conversations`
- `Users can update own conversations`
- `Users can delete own conversations`
- `Admins can do everything with conversations`

**chat_messages** (3 policies):
- `Users can view messages from own conversations`
- `Users can create messages in own conversations`
- `Admins can do everything with messages`

---

### 3.2 Teste Manual de Inserção

Como usuário autenticado, tente criar uma conversa e mensagem:

```sql
-- SUBSTITUA 'seu-user-id' pelo ID do usuário autenticado
INSERT INTO chat_conversations (user_id, status)
VALUES ('seu-user-id', 'active')
RETURNING *;

-- Pegue o ID retornado e use abaixo
INSERT INTO chat_messages (conversation_id, user_id, role, content, is_loading)
VALUES (1, 'seu-user-id', 'user', 'Tenho frango e brócolis', false)
RETURNING *;
```

**⚠️ Importante**: Se você receber erro de permissão, verifique:
1. RLS está habilitado nas tabelas?
2. O `user_id` está correto?
3. As policies foram criadas corretamente?

---

## Passo 4: Verificar Webhook

O webhook deve estar ativo e respondendo no formato correto.

### 4.1 Testar Webhook Manualmente

Use `curl` ou Postman para testar:

```bash
curl -X POST https://webhook.namasteagrofloresta.com.br/webhook/jaque-ia-receitas \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-123",
    "message": "Tenho frango, batata e brócolis"
  }'
```

**Resposta esperada**:
```json
{
  "output": "Aqui está uma sugestão de receita com os ingredientes que você tem: [receita...]"
}
```

**⚠️ Importante**:
- O webhook deve responder em menos de 30 segundos
- O campo `output` deve conter a resposta da IA
- Se houver erro, o frontend mostrará mensagem de erro ao usuário

---

## Passo 5: Testar Frontend

### 5.1 Executar Aplicação

```bash
npm run dev
```

### 5.2 Testar Fluxo Completo

1. Faça login no sistema
2. Acesse o menu lateral → **"Chat IA"**
3. Clique em **"Nova Conversa"** ou **"Iniciar Nova Conversa"**
4. Digite uma mensagem com ingredientes (ex: "Tenho frango, batata e brócolis")
5. Clique em **Enviar** ou pressione **Enter**

**Comportamento esperado**:
1. Mensagem do usuário aparece imediatamente
2. Aparece um indicador de "digitando..." (3 bolinhas animadas)
3. Após alguns segundos, a resposta da IA aparece
4. Conversa fica salva no histórico (sidebar esquerda)
5. Título da conversa é gerado automaticamente a partir da primeira mensagem

---

## Troubleshooting

### ❌ Erro: "Usuário não autenticado"

**Causa**: User não está logado ou token expirou

**Solução**:
1. Faça logout e login novamente
2. Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_KEY` estão corretas no `.env`
3. Verifique se o middleware `auth` está ativo na página `/chat-receitas`

---

### ❌ Erro: "Falha ao criar conversa"

**Causa**: Problema com RLS policies ou user_id

**Solução**:
1. Verifique no Supabase Dashboard → Authentication se o usuário existe
2. Execute query no SQL Editor para verificar permissões:
   ```sql
   SELECT * FROM auth.users WHERE id = 'seu-user-id';
   ```
3. Verifique se as RLS policies estão habilitadas:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'chat_conversations';
   ```

---

### ❌ Webhook timeout (30 segundos)

**Causa**: Webhook externo demorou mais de 30 segundos para responder

**Solução**:
1. Verifique se o webhook está funcionando: teste com curl
2. Aumente o timeout em `/app/composables/useChatIA.ts`:
   ```typescript
   export const CHAT_WEBHOOK_TIMEOUT = 60000 // 60 segundos
   ```
3. Entre em contato com o responsável pelo webhook para otimizar o tempo de resposta

---

### ❌ Mensagem de erro: "Desculpe, ocorreu um erro..."

**Causa**: Webhook retornou erro ou não retornou o campo `output`

**Solução**:
1. Abra o **DevTools** do navegador (F12)
2. Vá na aba **Console** e procure por erros
3. Verifique a resposta do webhook no **Network** tab
4. Se o webhook retornou erro, verifique com o responsável pelo serviço externo

**Como ver detalhes do erro**:
- A mensagem de erro fica armazenada no campo `error_message` da tabela `chat_messages`
- Execute no SQL Editor:
  ```sql
  SELECT id, content, error_message FROM chat_messages WHERE error_message IS NOT NULL;
  ```

---

### ❌ Conversas não aparecem na sidebar

**Causa**: Problema na query ou RLS

**Solução**:
1. Verifique no SQL Editor se as conversas existem:
   ```sql
   SELECT * FROM chat_conversations WHERE user_id = 'seu-user-id';
   ```
2. Verifique se a RLS policy permite SELECT:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'chat_conversations' AND cmd = 'SELECT';
   ```
3. Verifique o console do navegador para erros de fetch

---

### ❌ Título da conversa não é gerado

**Causa**: Trigger não está funcionando

**Solução**:
1. Verifique se o trigger existe:
   ```sql
   SELECT * FROM information_schema.triggers WHERE trigger_name = 'auto_generate_title_trigger';
   ```
2. Execute manualmente a função:
   ```sql
   SELECT auto_generate_conversation_title();
   ```
3. Se necessário, recrie o trigger executando novamente o trecho correspondente do `chat-ia-receitas.sql`

---

### ❌ Contador de mensagens (`messages_count`) não atualiza

**Causa**: Trigger de atualização não está funcionando

**Solução**:
1. Verifique se o trigger existe:
   ```sql
   SELECT * FROM information_schema.triggers WHERE trigger_name = 'update_message_count_trigger';
   ```
2. Recalcule manualmente:
   ```sql
   UPDATE chat_conversations
   SET messages_count = (
     SELECT COUNT(*) FROM chat_messages WHERE conversation_id = chat_conversations.id
   );
   ```

---

## 🎉 Conclusão

Se todos os passos foram executados corretamente:

✅ Tabelas criadas no Supabase
✅ Triggers funcionando (título, contador, timestamps)
✅ RLS policies protegendo dados dos usuários
✅ Webhook respondendo corretamente
✅ Frontend exibindo chat funcional
✅ Histórico de conversas salvo

---

## 📚 Arquivos Relacionados

- **Backend**:
  - `/database/chat-ia-receitas.sql` → Migration completa
  - `/shared/types/Chat.ts` → Tipos TypeScript
  - `/app/composables/useChatIA.ts` → Integração com webhook
  - `/app/stores/useChatStore.ts` → Store Pinia

- **Frontend**:
  - `/app/pages/chat-receitas.vue` → Página principal
  - `/app/components/ChatConversationList.vue` → Lista de conversas
  - `/app/components/ChatMessageBubble.vue` → Bolha de mensagem
  - `/app/components/ChatInput.vue` → Input de mensagem
  - `/app/components/ChatTypingIndicator.vue` → Indicador de digitação

---

**Última atualização**: 2026-01-27
**Autor**: Claude AI
**Versão**: 1.0
