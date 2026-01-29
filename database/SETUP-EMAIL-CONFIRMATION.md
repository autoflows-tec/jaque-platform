# Configuração de Confirmação de Email no Supabase

## Página de Confirmação

A página de confirmação foi criada em: `/app/pages/auth/confirm.vue`

## Configuração no Supabase Dashboard

### 1. Acessar Configurações de Autenticação

1. Acesse o **Supabase Dashboard**
2. Selecione seu projeto
3. Vá em **Authentication** → **URL Configuration**

### 2. Configurar Redirect URLs

Adicione as seguintes URLs permitidas:

#### **Site URL** (URL principal do site)
```
https://seu-dominio.com
```

Para desenvolvimento local:
```
http://localhost:3000
```

#### **Redirect URLs** (URLs permitidas para redirecionamento)
Adicione as seguintes URLs (uma por linha):

```
https://seu-dominio.com/auth/confirm
http://localhost:3000/auth/confirm
https://seu-dominio.com/**
http://localhost:3000/**
```

### 3. Configurar Email Templates

1. Vá em **Authentication** → **Email Templates**
2. Selecione **Confirm signup**
3. Modifique o template para usar a nova URL:

```html
<h2>Confirme seu cadastro</h2>

<p>Clique no link abaixo para confirmar seu email:</p>

<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>

<p>Ou copie e cole este link no navegador:</p>
<p>{{ .ConfirmationURL }}</p>
```

**IMPORTANTE**: O Supabase automaticamente adiciona o parâmetro de confirmação à URL configurada.

### 4. Verificar Configuração

A URL de confirmação deve seguir este padrão:
```
https://seu-dominio.com/auth/confirm#access_token=...&type=signup
```

## Como Funciona

1. **Usuário se cadastra** → Recebe email de confirmação
2. **Clica no link** → Redirecionado para `/auth/confirm`
3. **Página processa** → Valida token e autentica usuário
4. **Redirecionamento** → Após 2 segundos, vai para página inicial (`/`)

## Estados da Página

- **Loading**: Aguardando confirmação (máximo 5 segundos)
- **Success**: Email confirmado, redirecionando para home
- **Error**: Falha na confirmação, botão para ir ao login

## Personalização

Para mudar o tempo de redirecionamento após sucesso, edite em `/app/pages/auth/confirm.vue`:

```typescript
setTimeout(() => {
  router.push('/')
}, 2000) // 2000ms = 2 segundos
```

Para mudar a página de destino após confirmação:

```typescript
router.push('/dashboard') // ou qualquer outra rota
```

## Testando Localmente

1. Configure a URL de redirecionamento no Supabase:
   ```
   http://localhost:3000/auth/confirm
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Cadastre um novo usuário e verifique o email recebido

4. Clique no link de confirmação

5. Você deve ser redirecionado para `http://localhost:3000/auth/confirm` e então para a home

## Observações

- A página usa o layout `auth-layout` (sem sidebar/header)
- Não requer autenticação prévia (middleware vazio)
- Trata automaticamente erros de token inválido ou expirado
- Compatível com PKCE flow do Supabase
