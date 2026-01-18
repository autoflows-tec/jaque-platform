// Definição de todas as perguntas do quiz

export const QUIZ_QUESTIONS = [
  {
    id: 'p1',
    question: 'Você sente baixa energia ou fadiga frequente?',
    type: 'yesno' as const,
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' }
    ]
  },
  {
    id: 'p2',
    question: 'Como são os seus níveis de energia durante o dia?',
    type: 'single' as const,
    options: [
      { value: 'baixos_cansada', label: 'Baixos, sinto-me cansada durante o dia' },
      { value: 'baixa_apos_almoco', label: 'Baixa após o almoço' },
      { value: 'arrasto_refeicoes', label: 'Arrasto-me entre refeições' },
      { value: 'elevados_estaveis', label: 'Elevados e estáveis' }
    ]
  },
  {
    id: 'p3',
    question: 'Qual o seu nível de estresse?',
    type: 'single' as const,
    options: [
      { value: 'muito_baixo', label: 'Muito Baixo' },
      { value: 'leve', label: 'Leve' },
      { value: 'moderado', label: 'Moderado' },
      { value: 'alto', label: 'Alto' },
      { value: 'intenso', label: 'Intenso' }
    ]
  },
  {
    id: 'p4',
    question: 'Você sente que vive sempre correndo para dar conta de tudo?',
    type: 'yesno' as const,
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' }
    ]
  },
  {
    id: 'p5',
    question: 'Com que frequência você sente gases, inchaço abdominal ou desconforto digestivo?',
    type: 'single' as const,
    options: [
      { value: 'todos_dias', label: 'Todos os dias' },
      { value: 'algumas_vezes_semana', label: 'Algumas vezes por semana' },
      { value: 'uma_vez_semana', label: 'Uma vez por semana' },
      { value: 'algumas_vezes_mes', label: 'Algumas vezes por mês' },
      { value: 'quase_nunca', label: 'Quase nunca' }
    ]
  },
  {
    id: 'p6',
    question: 'Você costuma ficar mais de um dia sem evacuar?',
    type: 'yesno' as const,
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' }
    ]
  },
  {
    id: 'p7',
    question: 'Qual dessas opções mais se parece com o seu padrão habitual? (Tipos 1–7)',
    type: 'single' as const,
    options: [
      { value: 'tipo_3_4', label: 'Tipo 3 e 4' },
      { value: 'tipo_2_5', label: 'Tipo 2 e 5' },
      { value: 'tipo_1_6_7', label: 'Tipo 1, 6 e 7' }
    ]
  },
  {
    id: 'p8',
    question: 'Você costuma apresentar alergias sazonais (rinite, espirros, coceira, etc.)?',
    type: 'yesno' as const,
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' }
    ]
  },
  {
    id: 'p9',
    question: 'Você apresenta ou já apresentou algum desses sinais na pele? (múltipla escolha)',
    type: 'multiple' as const,
    options: [
      { value: 'acne', label: 'Acne recorrente' },
      { value: 'rosacea', label: 'Rosácea ou vermelhidão frequente' },
      { value: 'eczema', label: 'Eczema ou dermatite' },
      { value: 'coceiras', label: 'Coceiras ou erupções cutâneas' },
      { value: 'nenhuma', label: 'Nenhuma dessas' }
    ]
  },
  {
    id: 'p10',
    question: 'Você costuma ficar doente com frequência (2+ vezes/ano)?',
    type: 'yesno' as const,
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' }
    ]
  },
  {
    id: 'p11',
    question: 'Você convive com algum desses tipos de dor com frequência? (múltipla escolha)',
    type: 'multiple' as const,
    options: [
      { value: 'dor_cabeca', label: 'Dores de cabeça ou enxaquecas' },
      { value: 'dor_articular', label: 'Dores articulares ou musculares' },
      { value: 'rigidez', label: 'Sensação de rigidez no corpo' },
      { value: 'dor_intermitente', label: 'Dores que aparecem e somem sem causa aparente' },
      { value: 'nenhuma', label: 'Nenhuma dessas' }
    ]
  },
  {
    id: 'p12',
    question: 'Você se identifica com alguma dessas situações no dia a dia? (múltipla escolha)',
    type: 'multiple' as const,
    options: [
      { value: 'ansiedade', label: 'Ansiedade frequente ou inquietação' },
      { value: 'tristeza', label: 'Tristeza recorrente ou desânimo' },
      { value: 'foco_memoria', label: 'Dificuldade de foco/memória/concentração' },
      { value: 'oscilacao_humor', label: 'Oscilações de humor ao longo do dia' },
      { value: 'nenhuma', label: 'Nenhuma dessas' }
    ]
  },
  {
    id: 'p13',
    question: 'Com que frequência você sente desejo por doces, pães ou açúcar/farinha?',
    type: 'single' as const,
    options: [
      { value: 'todos_dias', label: 'Todos os dias' },
      { value: 'algumas_vezes_semana', label: 'Algumas vezes por semana' },
      { value: 'uma_vez_semana', label: 'Uma vez por semana' },
      { value: 'algumas_vezes_mes', label: 'Algumas vezes por mês' },
      { value: 'quase_nunca', label: 'Quase nunca' }
    ]
  },
  {
    id: 'p14',
    question: 'Qual dessas frases mais se aproxima da sua realidade atual?',
    type: 'single' as const,
    options: [
      { value: 'me_sinto_bem', label: 'Me sinto bem na maior parte do tempo' },
      { value: 'cansaco_mental', label: 'Tenho momentos de cansaço mental' },
      { value: 'estafa_mental', label: 'Sinto estafa mental e dificuldade de desligar' },
      { value: 'constantemente_limite', label: 'Me sinto constantemente no limite' }
    ]
  },
  {
    id: 'p15',
    question: 'Você tem alguma dessas condições? (múltipla escolha)',
    type: 'multiple' as const,
    options: [
      { value: 'hipotireoidismo', label: 'Hipotireoidismo ou problemas na tireoide' },
      { value: 'metabolismo_lento', label: 'Metabolismo lento ou dificuldade para emagrecer' },
      { value: 'oscilacao_hormonal', label: 'Oscilações hormonais frequentes' },
      { value: 'nenhuma', label: 'Nenhuma dessas' }
    ]
  },
  {
    id: 'p16',
    question: 'Você se identifica com alguma das situações abaixo? (múltipla escolha)',
    type: 'multiple' as const,
    options: [
      { value: 'sensibilidade_gluten', label: 'Sensibilidade ao glúten' },
      { value: 'sensibilidade_laticinios', label: 'Sensibilidade aos laticínios' },
      { value: 'multiplas_sensibilidades', label: 'Múltiplas sensibilidades/alergias alimentares' },
      { value: 'candida_fungos', label: 'Histórico de cândida/fungos/leveduras (ou língua branca)' },
      { value: 'sii_sibo_colite_crohn', label: 'Diagnóstico de SII, SIBO, colite ulcerativa ou Crohn' },
      { value: 'doenca_autoimune', label: 'Alguma doença autoimune (Hashimoto, psoríase, etc.)' },
      { value: 'nenhuma', label: 'Nenhuma dessas' }
    ]
  },
  {
    id: 'p17',
    question: 'Com que frequência você recorre a medicamentos para aliviar sintomas do dia a dia?',
    type: 'single' as const,
    options: [
      { value: 'todos_dias', label: 'Todos os dias' },
      { value: 'algumas_vezes_semana', label: 'Algumas vezes por semana' },
      { value: 'uma_vez_semana', label: 'Uma vez por semana' },
      { value: 'algumas_vezes_mes', label: 'Algumas vezes por mês' },
      { value: 'quase_nunca', label: 'Quase nunca' }
    ]
  },
  {
    id: 'p18',
    question: 'Qual dessas frases mais se aproxima da sua experiência?',
    type: 'single' as const,
    options: [
      { value: 'nunca_tentei', label: 'Nunca tentei dietas ou protocolos específicos' },
      { value: 'sem_constancia', label: 'Já tentei algumas mudanças, mas sem constância' },
      { value: 'sem_resultados_duradouros', label: 'Já fiz dietas/detox/jejum/suplementos, mas sem resultados duradouros' },
      { value: 'tentei_tudo', label: 'Já tentei de tudo e continuo cansada e sem clareza' }
    ]
  },
  {
    id: 'p19',
    question: 'Quais desses estímulos fazem parte da sua rotina para manter energia? (múltipla escolha)',
    type: 'multiple' as const,
    options: [
      { value: 'cafe_excesso', label: 'Café em excesso' },
      { value: 'acucar', label: 'Açúcar/doces para "dar energia"' },
      { value: 'energeticos', label: 'Energéticos/estimulantes' },
      { value: 'outros', label: 'Outros' },
      { value: 'nenhum', label: 'Nenhum desses' }
    ]
  }
]
