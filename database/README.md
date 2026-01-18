# Database Schema - Jaque Platform

## Estrutura de Tabelas

### 1. `profiles` (Já existente)
Armazena informações básicas do perfil do usuário.

```sql
- id: bigint (PK)
- created_at: timestamp
- user_id: uuid (FK -> auth.users)
- name: text
- role: text (default: 'user')
```

### 2. `quiz_responses` (Nova)
Armazena respostas do quiz inicial de avaliação de saúde/bem-estar.

```sql
- id: bigint (PK)
- created_at: timestamp
- updated_at: timestamp
- user_id: uuid (FK -> auth.users, UNIQUE)
- responses: jsonb
- total_score: integer
- is_completed: boolean
```

## Como aplicar as migrations

### Opção 1: Via Supabase Dashboard (Recomendado)
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo do arquivo `quiz_responses.sql`
5. Execute o SQL

### Opção 2: Via CLI (se estiver usando Supabase CLI)
```bash
supabase db push
```

## Estrutura das Respostas (JSONB)

O campo `responses` armazena as respostas do quiz em formato JSON. Exemplo:

```json
{
  "p1": "sim",
  "p2": "baixos_cansada",
  "p3": "moderado",
  "p4": "nao",
  "p5": "algumas_vezes_semana",
  "p6": "nao",
  "p7": "tipo_3_4",
  "p8": "nao",
  "p9": ["acne", "eczema"],
  "p10": "nao",
  "p11": ["dor_cabeca", "dor_articular"],
  "p12": ["ansiedade"],
  "p13": "algumas_vezes_semana",
  "p14": "cansaco_mental",
  "p15": ["hipotireoidismo"],
  "p16": ["sensibilidade_gluten"],
  "p17": "quase_nunca",
  "p18": "sem_constancia",
  "p19": ["cafe_excesso", "acucar"]
}
```

### Tipos de Resposta

#### Perguntas Sim/Não (string)
- **P1, P4, P6, P8, P10**
- Valores possíveis: `"sim"` | `"nao"`

#### Múltipla escolha única (string)
- **P2, P3, P5, P7, P13, P14, P17, P18**
- Exemplo P2: `"baixos_cansada"` | `"baixa_apos_almoco"` | `"arrasto_refeicoes"` | `"elevados_estaveis"`

#### Múltipla escolha múltipla (array de strings)
- **P9, P11, P12, P15, P16, P19**
- Exemplo P9: `["acne", "rosacea"]` ou `["nenhuma"]`
- **Importante**: Se `"nenhuma"` estiver no array, a pontuação é zerada

## Cálculo de Pontuação

A pontuação total é calculada usando a função `calculateQuizScore()` em [shared/types/Quiz.ts](../shared/types/Quiz.ts).

### Regras:
1. Cada resposta tem uma pontuação específica (vide `QUIZ_SCORES` no arquivo de tipos)
2. Para perguntas de múltipla escolha:
   - Soma as pontuações de cada item selecionado
   - Se `"nenhuma"` ou `"nenhum"` for selecionado, a pontuação daquela pergunta é 0
3. A pontuação total é armazenada na coluna `total_score`

### Exemplo de cálculo:

```typescript
import { calculateQuizScore } from '~/shared/types/Quiz'

const responses: QuizResponses = {
  p1: 'sim',        // 2 pontos
  p2: 'baixos_cansada',  // 4 pontos
  // ... demais respostas
}

const totalScore = calculateQuizScore(responses) // Retorna pontuação total
```

## Security (RLS Policies)

As seguintes políticas RLS estão ativas:

- ✅ Usuários podem **visualizar** apenas suas próprias respostas
- ✅ Usuários podem **inserir** suas próprias respostas
- ✅ Usuários podem **atualizar** suas próprias respostas
- ✅ Usuários podem **deletar** suas próprias respostas

## Constraint Importante

A tabela tem um constraint `UNIQUE` no `user_id`, o que significa que **cada usuário pode ter apenas UM quiz**.

Se no futuro você quiser permitir múltiplos quizzes ao longo do tempo (ex: reavaliações), será necessário:
1. Remover o constraint `quiz_responses_user_id_unique`
2. Adicionar lógica no frontend para lidar com múltiplos registros

## Próximos Passos

1. ✅ Executar o SQL no Supabase
2. 🔲 Criar store Pinia para gerenciar quiz (`useQuizStore`)
3. 🔲 Criar componentes do formulário de quiz
4. 🔲 Implementar fluxo de onboarding pós-cadastro
5. 🔲 Criar página de resultados do quiz
