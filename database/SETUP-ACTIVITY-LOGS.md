# Setup: Sistema de Logs de Atividades

## 1. Criar a tabela no Supabase

Execute o SQL em `/database/user-activity-logs.sql` no SQL Editor do Supabase Dashboard.

## 2. Onde adicionar logging nas stores

Os seguintes locais já foram integrados:
- ✅ `useLoginForm.ts` → LOGIN e SIGNUP
- ✅ `useQuizStore.ts` → QUIZ_STARTED, QUIZ_COMPLETED, QUIZ_DELETED

### Locais para adicionar logging manualmente (se necessário):

#### `useRecipesStore.ts`
```typescript
// No início do arquivo, adicionar imports:
import { ActivityType } from '../../shared/types/ActivityLog'
const { logActivity } = useActivityLogger()

// Método createRecipe (após inserção bem-sucedida):
await logActivity(ActivityType.RECIPE_CREATED, { recipe_id: data.id, title: recipeData.title })

// Método updateRecipe (após atualização bem-sucedida):
await logActivity(ActivityType.RECIPE_UPDATED, { recipe_id: recipeId })

// Método deleteRecipe (após deleção bem-sucedida):
await logActivity(ActivityType.RECIPE_DELETED, { recipe_id: recipeId })

// Método favoriteRecipe (após favoritar):
await logActivity(ActivityType.RECIPE_FAVORITED, { recipe_id: recipeId })

// Método unfavoriteRecipe (após desfavoritar):
await logActivity(ActivityType.RECIPE_UNFAVORITED, { recipe_id: recipeId })
```

#### `useCommunityStore.ts`
```typescript
// Imports
import { ActivityType } from '../../shared/types/ActivityLog'
const { logActivity } = useActivityLogger()

// Método createPost (após criação):
await logActivity(ActivityType.COMMUNITY_POST_CREATED, { post_id: data.id })

// Método deletePost (após deleção):
await logActivity(ActivityType.COMMUNITY_POST_DELETED, { post_id: postId })

// Método likePost (após curtir):
await logActivity(ActivityType.COMMUNITY_POST_LIKED, { post_id: postId })

// Método unlikePost (após descurtir):
await logActivity(ActivityType.COMMUNITY_POST_UNLIKED, { post_id: postId })

// Método createComment (após criação):
await logActivity(ActivityType.COMMUNITY_COMMENT_CREATED, { post_id: postId, comment_id: data.id })

// Método deleteComment (após deleção):
await logActivity(ActivityType.COMMUNITY_COMMENT_DELETED, { comment_id: commentId })
```

#### `useChatStore.ts`
```typescript
// Imports
import { ActivityType } from '../../shared/types/ActivityLog'
const { logActivity } = useActivityLogger()

// Método createConversation (após criação):
await logActivity(ActivityType.CHAT_CONVERSATION_CREATED, { conversation_id: data.id })

// Método sendMessage (após envio):
await logActivity(ActivityType.CHAT_MESSAGE_SENT, { conversation_id: conversationId })

// Método deleteConversation (após deleção):
await logActivity(ActivityType.CHAT_CONVERSATION_DELETED, { conversation_id: conversationId })
```

#### `useShoppingListsStore.ts`
```typescript
// Imports
import { ActivityType } from '../../shared/types/ActivityLog'
const { logActivity } = useActivityLogger()

// Método createShoppingList (após criação):
await logActivity(ActivityType.SHOPPING_LIST_CREATED, { list_id: data.id })

// Método updateShoppingList (após atualização):
await logActivity(ActivityType.SHOPPING_LIST_UPDATED, { list_id: listId })

// Método deleteShoppingList (após deleção):
await logActivity(ActivityType.SHOPPING_LIST_DELETED, { list_id: listId })

// Método favoriteShoppingList (após favoritar):
await logActivity(ActivityType.SHOPPING_LIST_FAVORITED, { list_id: listId })

// Método unfavoriteShoppingList (após desfavoritar):
await logActivity(ActivityType.SHOPPING_LIST_UNFAVORITED, { list_id: listId })
```

#### `useBrandsStore.ts`
```typescript
// Imports
import { ActivityType } from '../../shared/types/ActivityLog'
const { logActivity } = useActivityLogger()

// Método favoriteBrand (após favoritar):
await logActivity(ActivityType.BRAND_FAVORITED, { brand_id: brandId })

// Método unfavoriteBrand (após desfavoritar):
await logActivity(ActivityType.BRAND_UNFAVORITED, { brand_id: brandId })
```

#### `useModulesStore.ts`
```typescript
// Imports
import { ActivityType } from '../../shared/types/ActivityLog'
const { logActivity } = useActivityLogger()

// Se houver tracking de conclusão de aulas, adicionar:
// Método markLessonAsWatched (se existir):
await logActivity(ActivityType.LESSON_WATCHED, { lesson_id: lessonId, module_id: moduleId })
```

## 3. Padrão de implementação

Sempre seguir este padrão:

```typescript
// 1. Importar no topo do arquivo
import { ActivityType } from '../../shared/types/ActivityLog'

// 2. Dentro do defineStore, inicializar o composable
const { logActivity } = useActivityLogger()

// 3. Após operação bem-sucedida, registrar log
try {
  // ... operação no banco ...

  if (!error) {
    // Registrar atividade
    await logActivity(ActivityType.NOME_DA_ACAO, {
      // dados relevantes
    })
  }
} catch (err) {
  // ...
}
```

## 4. Boas práticas

- ✅ Sempre registrar após a operação ser bem-sucedida
- ✅ Incluir IDs relevantes no `activity_data`
- ✅ Não travar a aplicação se o log falhar (apenas console.error)
- ✅ Não registrar dados sensíveis (senhas, tokens, etc.)
- ⚠️ Evitar registrar ações de leitura (fetch) - apenas ações de escrita
