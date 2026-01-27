-- =====================================================
-- SQL MIGRATION: Sistema de Marcas Recomendadas
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Criar ENUM para categorias de marcas
CREATE TYPE brand_category AS ENUM (
  'alimentos',
  'suplementos',
  'utensilios',
  'livros',
  'outros'
);

-- 2. Criar tabela de marcas
CREATE TABLE brands (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Informações básicas
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,

  -- Categorização
  category brand_category NOT NULL,

  -- Links
  website_url TEXT,
  affiliate_link TEXT,

  -- Tags (array de strings)
  tags TEXT[],

  -- Destaque e publicação
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,

  -- Rating (1-5)
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  -- Contador de favoritos (desnormalizado para performance)
  favorites_count INTEGER NOT NULL DEFAULT 0,

  -- Metadados
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Criar tabela de favoritos de marcas
CREATE TABLE brand_favorites (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Relacionamentos
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Constraint para evitar duplicatas (um usuário só pode favoritar uma marca uma vez)
  UNIQUE(brand_id, user_id)
);

-- 4. Criar índices para performance
CREATE INDEX idx_brands_category ON brands(category);
CREATE INDEX idx_brands_is_published ON brands(is_published);
CREATE INDEX idx_brands_is_featured ON brands(is_featured);
CREATE INDEX idx_brands_created_at ON brands(created_at DESC);
CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_tags ON brands USING GIN(tags); -- Índice GIN para busca em arrays

CREATE INDEX idx_brand_favorites_brand_id ON brand_favorites(brand_id);
CREATE INDEX idx_brand_favorites_user_id ON brand_favorites(user_id);
CREATE INDEX idx_brand_favorites_created_at ON brand_favorites(created_at DESC);

-- 5. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Criar trigger para atualizar contador de favoritos
CREATE OR REPLACE FUNCTION update_brand_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE brands
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.brand_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE brands
    SET favorites_count = GREATEST(favorites_count - 1, 0)
    WHERE id = OLD.brand_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_brand_favorites_insert
  AFTER INSERT ON brand_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_favorites_count();

CREATE TRIGGER trigger_brand_favorites_delete
  AFTER DELETE ON brand_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_favorites_count();

-- 7. Habilitar Row Level Security (RLS)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_favorites ENABLE ROW LEVEL SECURITY;

-- 8. Políticas de segurança para brands

-- Todos podem ler marcas publicadas
CREATE POLICY "Marcas publicadas são públicas"
  ON brands
  FOR SELECT
  USING (is_published = TRUE);

-- Admins podem ver todas as marcas (incluindo rascunhos)
CREATE POLICY "Admins podem ver todas as marcas"
  ON brands
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins podem inserir marcas
CREATE POLICY "Admins podem criar marcas"
  ON brands
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins podem atualizar marcas
CREATE POLICY "Admins podem atualizar marcas"
  ON brands
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins podem deletar marcas
CREATE POLICY "Admins podem deletar marcas"
  ON brands
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 9. Políticas de segurança para brand_favorites

-- Usuários autenticados podem ver favoritos
CREATE POLICY "Usuários podem ver favoritos"
  ON brand_favorites
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Usuários podem favoritar marcas
CREATE POLICY "Usuários podem favoritar marcas"
  ON brand_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem desfavoritar suas próprias marcas
CREATE POLICY "Usuários podem desfavoritar suas marcas"
  ON brand_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL - remova se não quiser)
-- =====================================================

-- Inserir algumas marcas de exemplo
INSERT INTO brands (
  name,
  description,
  category,
  website_url,
  is_featured,
  is_published,
  rating,
  tags
) VALUES
(
  'Fazenda Orgânica XYZ',
  'Alimentos orgânicos e ancestrais de alta qualidade, produzidos de forma sustentável e respeitosa com a natureza.',
  'alimentos',
  'https://exemplo.com.br',
  TRUE,
  TRUE,
  5,
  ARRAY['orgânico', 'sustentável', 'local']
),
(
  'Suplementos Naturais ABC',
  'Suplementos naturais baseados em nutrição ancestral, sem aditivos químicos.',
  'suplementos',
  'https://exemplo2.com.br',
  TRUE,
  TRUE,
  4,
  ARRAY['natural', 'sem aditivos', 'ancestral']
),
(
  'Panelas de Ferro Artesanais',
  'Utensílios de cozinha tradicionais, feitos à mão com técnicas ancestrais.',
  'utensilios',
  'https://exemplo3.com.br',
  FALSE,
  TRUE,
  5,
  ARRAY['artesanal', 'ferro fundido', 'durável']
);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('brands', 'brand_favorites');

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('brands', 'brand_favorites');

-- Verificar dados inseridos (se incluiu os exemplos)
SELECT id, name, category, is_published, is_featured, favorites_count
FROM brands;
