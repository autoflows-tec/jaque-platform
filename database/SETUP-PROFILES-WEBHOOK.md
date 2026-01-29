# Configuração de Profiles Automáticos via Auth Hooks

## Problema

Não temos permissão para criar triggers diretamente na tabela `auth.users` via SQL Editor.

## Solução: Auth Hooks do Supabase

O Supabase oferece **Auth Hooks** que executam código quando eventos de autenticação ocorrem.

## Passo a Passo

### 1. Executar SQL de Preparação

Execute o arquivo `profiles-auto-create-alternative.sql` no SQL Editor do Supabase.

Isso vai:
- Criar índice único em `user_id`
- Popular profiles para usuários existentes
- Criar função helper (opcional)

### 2. Configurar Auth Hook no Supabase

#### Via Dashboard (Recomendado para produção)

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** → **Hooks**
3. Clique em **Enable Hooks**
4. Selecione o evento **user.created**
5. Configure o hook com este código SQL:

```sql
-- Hook: user.created
-- Executado quando um novo usuário se cadastra

INSERT INTO public.profiles (user_id, name, role)
VALUES (
  NEW.id,
  COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
  'user'
)
ON CONFLICT (user_id) DO NOTHING;
```

6. Clique em **Save**

### 3. Testar

1. Cadastre um novo usuário na aplicação
2. Verifique a tabela `profiles`:

```sql
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
```

Deve aparecer o registro do novo usuário.

## Estrutura do Auth Hook

O hook tem acesso a estas variáveis:

- `NEW.id` - UUID do usuário
- `NEW.email` - Email do usuário
- `NEW.raw_user_meta_data` - Metadados (JSONB)
- `NEW.created_at` - Data de criação

## Como Passar Nome no Cadastro

No seu código de cadastro:

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@example.com',
  password: 'senha123',
  options: {
    data: {
      name: 'Nome Completo' // Será acessível em raw_user_meta_data
    }
  }
})
```

O hook vai pegar esse nome automaticamente.

## Alternativa: Edge Function (Avançado)

Se você tem um plano que suporta Edge Functions:

### 1. Criar Edge Function

```typescript
// supabase/functions/create-profile/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { record } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: record.id,
        name: record.raw_user_meta_data?.name || record.email,
        role: 'user'
      })

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

### 2. Deploy da Edge Function

```bash
supabase functions deploy create-profile
```

### 3. Configurar Database Webhook

1. Vá em **Database** → **Webhooks**
2. Crie novo webhook:
   - **Name**: Create Profile on User Signup
   - **Table**: `auth.users`
   - **Events**: INSERT
   - **Type**: HTTP Request
   - **URL**: `https://seu-projeto.supabase.co/functions/v1/create-profile`
   - **Method**: POST

## Verificar se Está Funcionando

### Ver hooks ativos

No Dashboard: **Authentication** → **Hooks**

### Logs de execução

**Authentication** → **Hooks** → Clique no hook → **View Logs**

### Testar manualmente

```sql
-- Ver profiles criados recentemente
SELECT
  p.*,
  u.email,
  u.created_at as user_created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
ORDER BY p.created_at DESC
LIMIT 10;
```

## Troubleshooting

### Hook não está executando

1. Verifique se o hook está **ativo** no Dashboard
2. Veja os logs de erro em **Hooks** → **Logs**
3. Confirme que o evento é `user.created`

### Profile não foi criado

1. Verifique se já existe profile para o usuário:
```sql
SELECT * FROM profiles WHERE user_id = 'uuid-do-usuario';
```

2. Tente criar manualmente:
```sql
INSERT INTO profiles (user_id, name, role)
VALUES ('uuid-do-usuario', 'Nome', 'user');
```

### Erro de duplicata

O índice único previne duplicatas. Se o hook tentar criar um profile que já existe, vai falhar silenciosamente por causa do `ON CONFLICT DO NOTHING`.

## Recomendação

Para produção, use **Auth Hooks via Dashboard** (método mais simples e confiável).

A Edge Function é útil apenas se você precisar de lógica mais complexa (ex: enviar email de boas-vindas, criar registros em múltiplas tabelas, etc).
