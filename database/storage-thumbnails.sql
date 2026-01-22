-- ============================================
-- Configuração do Supabase Storage para Thumbnails
-- ============================================

-- Criar bucket público para thumbnails
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

-- Política: Permitir leitura pública de todas as imagens
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'thumbnails' );

-- Política: Permitir upload apenas para usuários autenticados
create policy "Authenticated users can upload"
on storage.objects for insert
with check (
  bucket_id = 'thumbnails'
  and auth.role() = 'authenticated'
);

-- Política: Permitir atualização apenas para usuários autenticados
create policy "Authenticated users can update"
on storage.objects for update
using (
  bucket_id = 'thumbnails'
  and auth.role() = 'authenticated'
);

-- Política: Permitir deleção apenas para usuários autenticados
create policy "Authenticated users can delete"
on storage.objects for delete
using (
  bucket_id = 'thumbnails'
  and auth.role() = 'authenticated'
);
