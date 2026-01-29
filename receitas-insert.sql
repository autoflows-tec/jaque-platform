-- =====================================================
-- SQL PARA INSERIR RECEITAS ANCESTRAIS
-- =====================================================
-- Total de receitas: 20
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Iogurte Caseiro Natural
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Iogurte Caseiro Natural',
  NULL,
  NULL,
  'breakfast',
  'medium',
  NULL,
  480,
  4,
  '[{"item": "Leite integral", "amount": "1 litro"}, {"item": "Iogurte natural sem açúcar", "amount": "2 colheres de sopa"}]'::jsonb,
  '["Aqueça o leite até atingir 45°C (morno)", "Adicione o iogurte ao leite morno e misture delicadamente", "Coloque em uma tigela, cubra com um pano grosso e deixe em local protegido por 8 a 24 horas", "Leve à geladeira por pelo menos 2 horas antes de consumir"]'::jsonb,
  NULL,
  NULL,
  ARRAY['probiotico', 'fermentado', 'cafe-da-manha'],
  false,
  NULL
);

-- 2. Kefir de Leite
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Kefir de Leite',
  NULL,
  NULL,
  'breakfast',
  'easy',
  5,
  1080,
  2,
  '[{"item": "Leite integral de qualidade", "amount": "2 xícaras"}, {"item": "Grãos de kefir", "amount": "1 colher de sopa"}]'::jsonb,
  '["Coloque os grãos de kefir e o leite em um pote de vidro", "Deixe em temperatura ambiente por 18 a 24 horas", "Mexa após as primeiras 12 horas", "Coe o líquido para consumir e reserve os grãos para nova leva"]'::jsonb,
  NULL,
  NULL,
  ARRAY['probiotico', 'fermentado', 'cafe-da-manha'],
  false,
  NULL
);

-- 3. Queijo Labane Cremoso
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Queijo Labane Cremoso',
  NULL,
  NULL,
  'breakfast',
  'easy',
  10,
  720,
  6,
  '[{"item": "Iogurte natural", "amount": "1 litro"}, {"item": "Sal marinho", "amount": "a gosto"}, {"item": "Azeite", "amount": "a gosto"}]'::jsonb,
  '["Despeje o iogurte sobre um pano limpo posicionado em um recipiente", "Amarre o pano em formato de trouxinha sem espremer", "Pendure a trouxinha fora da geladeira por 12 a 24 horas", "Retire a massa do pano e tempere com sal, azeite e ervas"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'cafe-da-manha'],
  false,
  NULL
);

-- 4. Cenouras Fermentadas com Gengibre
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Cenouras Fermentadas com Gengibre',
  NULL,
  NULL,
  'snack',
  'medium',
  15,
  4320,
  8,
  '[{"item": "Cenouras raladas", "amount": "4 xícaras"}, {"item": "Gengibre fresco ralado", "amount": "1 colher de sopa"}, {"item": "Sal marinho", "amount": "1 colher de sopa"}]'::jsonb,
  '["Misture tudo e amasse com um pilão até liberar os sucos", "Pressione firmemente em um pote de vidro até que o suco cubra os vegetais", "Tampe bem e deixe em temperatura ambiente por 3 dias", "Leve à geladeira após fermentação"]'::jsonb,
  NULL,
  NULL,
  ARRAY['fermentado', 'vegano', 'sem-gluten'],
  false,
  NULL
);

-- 5. Pepinos Fermentados
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Pepinos Fermentados',
  NULL,
  NULL,
  'snack',
  'medium',
  15,
  4320,
  8,
  '[{"item": "Pepinos japoneses em rodelas", "amount": "5 unidades"}, {"item": "Sementes de mostarda", "amount": "1 colher de sopa"}, {"item": "Sal marinho", "amount": "1 colher de sopa"}, {"item": "Água filtrada", "amount": "1 copo"}]'::jsonb,
  '["Coloque os pepinos e temperos no pote", "Adicione os líquidos, cobrindo totalmente os pepinos", "Deixe em temperatura ambiente por 3 dias e depois refrigere"]'::jsonb,
  NULL,
  NULL,
  ARRAY['fermentado', 'vegano', 'sem-gluten'],
  false,
  NULL
);

-- 6. Caldo de Ossos
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Caldo de Ossos',
  NULL,
  NULL,
  'lunch',
  'medium',
  30,
  1440,
  8,
  '[{"item": "Ossos com medula e cartilagem", "amount": "1,5 kg"}, {"item": "Pés de galinha", "amount": "4 unidades"}, {"item": "Água", "amount": "3 litros"}, {"item": "Vinagre de maçã", "amount": "2 colheres de sopa"}, {"item": "Cebola, alho, cenouras, salsão", "amount": "a gosto"}]'::jsonb,
  '["Asse os ossos a 200°C por 30 minutos", "Coloque ossos, água e vinagre na panela e deixe descansar por 30 minutos", "Adicione os vegetais e cozinhe em fogo baixo por 12 a 24 horas", "Coe e descarte os sólidos"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'sem-gluten'],
  false,
  NULL
);

-- 7. Caldo de Frango
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Caldo de Frango',
  NULL,
  NULL,
  'lunch',
  'medium',
  20,
  480,
  8,
  '[{"item": "Frango inteiro ou partes ósseas", "amount": "1,5 kg"}, {"item": "Pés de frango", "amount": "2 a 4 unidades"}, {"item": "Água", "amount": "4 litros"}, {"item": "Vinagre de maçã", "amount": "2 colheres de sopa"}, {"item": "Cebola, cenoura, aipo", "amount": "a gosto"}]'::jsonb,
  '["Coloque o frango, água, vinagre e vegetais na panela", "Descanse por 1 hora", "Ferva, limpe a espuma e cozinhe em fogo mínimo por 6 a 8 horas", "Adicione salsa nos últimos 10 minutos"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'sem-gluten'],
  false,
  NULL
);

-- 8. Guacamole Ancestral
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Guacamole Ancestral',
  NULL,
  NULL,
  'snack',
  'easy',
  10,
  NULL,
  4,
  '[{"item": "Abacates maduros", "amount": "2 unidades"}, {"item": "Limão", "amount": "1 unidade"}, {"item": "Tomate picado", "amount": "1 unidade"}, {"item": "Cebola roxa", "amount": "1/4 unidade"}, {"item": "Alho amassado", "amount": "1 dente"}, {"item": "Azeite", "amount": "1 colher de sopa"}, {"item": "Cominho, coentro, sal e pimenta", "amount": "a gosto"}]'::jsonb,
  '["Amasse o abacate com um garfo deixando alguns pedaços", "Adicione o limão imediatamente para evitar escurecer", "Misture os demais ingredientes e ajuste o tempero"]'::jsonb,
  NULL,
  NULL,
  ARRAY['vegano', 'sem-gluten'],
  false,
  NULL
);

-- 9. Leite de Coco Caseiro
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Leite de Coco Caseiro',
  NULL,
  NULL,
  'breakfast',
  'easy',
  5,
  NULL,
  3,
  '[{"item": "Coco seco picado", "amount": "1 unidade"}, {"item": "Água morna", "amount": "3 xícaras"}]'::jsonb,
  '["Bata no liquidificador por 3 minutos", "Coe em um pano fino"]'::jsonb,
  NULL,
  NULL,
  ARRAY['vegano', 'sem-gluten', 'cafe-da-manha'],
  false,
  NULL
);

-- 10. Shakshuka Ancestral
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Shakshuka Ancestral',
  NULL,
  NULL,
  'breakfast',
  'medium',
  10,
  20,
  4,
  '[{"item": "Ovos caipiras", "amount": "4 a 6 unidades"}, {"item": "Tomates maduros", "amount": "4 unidades"}, {"item": "Cebola fatiada", "amount": "1 unidade"}, {"item": "Alho", "amount": "3 dentes"}, {"item": "Azeite ou ghee", "amount": "2 colheres de sopa"}, {"item": "Páprica doce, cominho, sal", "amount": "a gosto"}, {"item": "Coentro ou salsa", "amount": "a gosto"}]'::jsonb,
  '["Refogue a cebola e o alho no azeite até dourarem", "Adicione os tomates e as especiarias, cozinhe por 10-15 minutos", "Abra buracos no molho e quebre os ovos dentro deles", "Tampe e cozinhe por 5 minutos até clara firmar", "Finalize com ervas frescas"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'sem-gluten', 'cafe-da-manha'],
  false,
  NULL
);

-- 11. Arroz Ancestral com Caldo de Ossos
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Arroz Ancestral com Caldo de Ossos',
  NULL,
  NULL,
  'lunch',
  'easy',
  720,
  30,
  4,
  '[{"item": "Arroz integral ou branco", "amount": "1 xícara"}, {"item": "Caldo de ossos caseiro", "amount": "2 xícaras"}, {"item": "Manteiga ou banha", "amount": "1 colher de sopa"}, {"item": "Alho e cebola", "amount": "a gosto"}]'::jsonb,
  '["Deixe o arroz de molho em água com vinagre ou limão por 8 a 12 horas", "Enxágue bem", "Refogue o alho e a cebola na gordura", "Adicione o arroz escorrido e refogue", "Junte o caldo de ossos quente e cozinhe em fogo baixo até secar"]'::jsonb,
  NULL,
  NULL,
  ARRAY['sem-gluten'],
  false,
  NULL
);

-- 12. Feijão Ancestral
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Feijão Ancestral',
  NULL,
  NULL,
  'lunch',
  'medium',
  720,
  120,
  6,
  '[{"item": "Feijão", "amount": "2 xícaras"}, {"item": "Caldo de ossos", "amount": "1 xícara"}, {"item": "Banha de porco ou manteiga", "amount": "2 colheres de sopa"}, {"item": "Cebola, alho, louro", "amount": "a gosto"}, {"item": "Sal marinho", "amount": "a gosto"}]'::jsonb,
  '["Deixe o feijão de molho em água com vinagre por 12 a 24 horas", "Troque a água pelo menos uma vez", "Descarte a água do molho e cozinhe o feijão até ficar macio", "Refogue cebola e alho na banha", "Adicione o feijão cozido, o caldo de ossos e o louro", "Deixe apurar e finalize com ervas frescas"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'sem-gluten'],
  false,
  NULL
);

-- 13. Costela Bovina Assada
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Costela Bovina Assada',
  NULL,
  NULL,
  'lunch',
  'medium',
  15,
  240,
  6,
  '[{"item": "Costela bovina", "amount": "1,5 kg"}, {"item": "Alho", "amount": "4 dentes"}, {"item": "Alecrim e tomilho", "amount": "a gosto"}, {"item": "Sal marinho e pimenta", "amount": "a gosto"}, {"item": "Caldo de ossos", "amount": "1/2 xícara"}]'::jsonb,
  '["Tempere a carne e deixe descansar por 2 horas", "Coloque na assadeira com o caldo de ossos", "Cubra bem e leve ao forno a 160°C", "Deixe de 3 a 4 horas até a carne soltar do osso", "Retire a cobertura nos últimos 30 minutos para dourar"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'sem-gluten'],
  false,
  NULL
);

-- 14. Frango com Cogumelos
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Frango com Cogumelos',
  NULL,
  NULL,
  'lunch',
  'medium',
  10,
  25,
  4,
  '[{"item": "Peito de frango em cubos", "amount": "500g"}, {"item": "Cogumelos frescos", "amount": "300g"}, {"item": "Manteiga", "amount": "2 colheres de sopa"}, {"item": "Creme de leite fresco ou leite de coco", "amount": "1/2 xícara"}, {"item": "Caldo de frango", "amount": "1 xícara"}, {"item": "Alho e cebola", "amount": "a gosto"}]'::jsonb,
  '["Sele o frango na manteiga e reserve", "Adicione cogumelos frescos, creme de leite e caldo de frango", "Cozinhe por 15 minutos até engrossar"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'sem-gluten'],
  false,
  NULL
);

-- 15. Peixe Inteiro Assado com Limão e Ervas
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Peixe Inteiro Assado com Limão e Ervas',
  NULL,
  NULL,
  'dinner',
  'medium',
  15,
  30,
  4,
  '[{"item": "Peixe inteiro (robalo, tainha ou dourado)", "amount": "1 unidade"}, {"item": "Limão", "amount": "2 unidades"}, {"item": "Tomilho e salsa", "amount": "a gosto"}, {"item": "Alho e cebola", "amount": "a gosto"}, {"item": "Azeite", "amount": "a gosto"}]'::jsonb,
  '["Tempere o peixe por dentro e por fora", "Recheie a cavidade com ervas, cebola e raspas de limão", "Pincele azeite e asse a 180°C por 25-30 minutos"]'::jsonb,
  NULL,
  NULL,
  ARRAY['proteico', 'sem-gluten'],
  false,
  NULL
);

-- 16. Abóbora Cabotiá Assada
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Abóbora Cabotiá Assada',
  NULL,
  NULL,
  'lunch',
  'easy',
  10,
  30,
  4,
  '[{"item": "Abóbora cabotiá pequena em fatias", "amount": "1 unidade"}, {"item": "Manteiga derretida", "amount": "3 colheres de sopa"}, {"item": "Canela", "amount": "1 colher de chá"}, {"item": "Sal", "amount": "a gosto"}]'::jsonb,
  '["Pincele a abóbora com a manteiga", "Tempere com canela e sal", "Asse a 200°C por 25-30 minutos até caramelizar"]'::jsonb,
  NULL,
  NULL,
  ARRAY['vegano', 'sem-gluten'],
  false,
  NULL
);

-- 17. Bolo de Banana com Aveia Fermentada
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Bolo de Banana com Aveia Fermentada',
  NULL,
  NULL,
  'dessert',
  'medium',
  720,
  40,
  8,
  '[{"item": "Bananas maduras", "amount": "12 unidades"}, {"item": "Ovos", "amount": "4 unidades"}, {"item": "Aveia hidratada na noite anterior", "amount": "2 xícaras"}, {"item": "Manteiga ou óleo de coco", "amount": "2 colheres de sopa"}]'::jsonb,
  '["Misture as bananas amassadas com os ovos", "Adicione a aveia escorrida e a gordura", "Asse a 180°C por 40 minutos"]'::jsonb,
  NULL,
  NULL,
  ARRAY['sobremesa', 'sem-gluten'],
  false,
  NULL
);

-- 18. Pudim de Coco Ancestral
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Pudim de Coco Ancestral',
  NULL,
  NULL,
  'dessert',
  'medium',
  20,
  60,
  6,
  '[{"item": "Ovos", "amount": "4 unidades"}, {"item": "Leite de coco", "amount": "2 xícaras"}, {"item": "Mel ou açúcar mascavo", "amount": "1/3 xícara"}, {"item": "Baunilha", "amount": "1 colher de chá"}]'::jsonb,
  '["Caramelize a forma com melado de cana", "Bata os ingredientes no liquidificador", "Despeje na forma e asse em banho-maria a 180°C por 50-60 minutos", "Refrigere por 4 horas"]'::jsonb,
  NULL,
  NULL,
  ARRAY['sobremesa', 'sem-gluten'],
  false,
  NULL
);

-- 19. Sorvete de Banana e Frutas Vermelhas
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Sorvete de Banana e Frutas Vermelhas',
  NULL,
  NULL,
  'dessert',
  'easy',
  5,
  NULL,
  4,
  '[{"item": "Bananas congeladas", "amount": "4 unidades"}, {"item": "Frutas vermelhas", "amount": "1 xícara"}, {"item": "Leite de coco", "amount": "1/4 xícara"}]'::jsonb,
  '["Bata bananas congeladas, frutas vermelhas e leite de coco no processador", "Processe até atingir consistência de sorvete", "Sirva imediatamente"]'::jsonb,
  NULL,
  NULL,
  ARRAY['sobremesa', 'vegano', 'sem-gluten'],
  false,
  NULL
);

-- 20. Quindim Ancestral
INSERT INTO public.recipes (
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time_minutes,
  cook_time_minutes,
  servings,
  ingredients,
  instructions,
  calories_per_serving,
  nutritional_info,
  tags,
  is_published,
  created_by
) VALUES (
  'Quindim Ancestral',
  NULL,
  NULL,
  'dessert',
  'medium',
  15,
  40,
  12,
  '[{"item": "Gemas peneiradas", "amount": "4 unidades"}, {"item": "Leite de coco", "amount": "1 xícara"}, {"item": "Melado ou açúcar de coco", "amount": "1/2 xícara"}, {"item": "Coco ralado fresco", "amount": "1 xícara"}]'::jsonb,
  '["Misture gemas peneiradas, leite de coco, melado e coco ralado", "Asse em banho-maria por 40 minutos", "Deixe esfriar e desenforme"]'::jsonb,
  NULL,
  NULL,
  ARRAY['sobremesa', 'sem-gluten'],
  false,
  NULL
);
