-- =====================================================
-- Tornar usuário específico como ADMIN
-- =====================================================

-- Atualizar o role do usuário para 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE user_id = 'c03ac732-6c26-4958-a608-b7a2f9700206';

-- Verificar se a atualização funcionou
SELECT id, user_id, name, role, created_at
FROM public.profiles
WHERE user_id = 'c03ac732-6c26-4958-a608-b7a2f9700206';
