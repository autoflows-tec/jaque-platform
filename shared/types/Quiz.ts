// =====================================================
// TIPOS PARA O QUIZ DE AVALIAÇÃO INICIAL
// =====================================================

// Respostas para perguntas Sim/Não
export type YesNoAnswer = 'sim' | 'nao'

// P2: Níveis de energia durante o dia
export type EnergyLevelAnswer =
  | 'baixos_cansada'
  | 'baixa_apos_almoco'
  | 'arrasto_refeicoes'
  | 'elevados_estaveis'

// P3: Nível de estresse
export type StressLevelAnswer =
  | 'muito_baixo'
  | 'leve'
  | 'moderado'
  | 'alto'
  | 'intenso'

// P5: Frequência de gases/inchaço
export type DigestiveFrequencyAnswer =
  | 'todos_dias'
  | 'algumas_vezes_semana'
  | 'uma_vez_semana'
  | 'algumas_vezes_mes'
  | 'quase_nunca'

// P7: Padrão de evacuação (Bristol Stool Chart)
export type StoolTypeAnswer =
  | 'tipo_3_4'
  | 'tipo_2_5'
  | 'tipo_1_6_7'

// P9: Sinais na pele (múltipla escolha)
export type SkinCondition =
  | 'acne'
  | 'rosacea'
  | 'eczema'
  | 'coceiras'
  | 'nenhuma'

// P11: Tipos de dor (múltipla escolha)
export type PainType =
  | 'dor_cabeca'
  | 'dor_articular'
  | 'rigidez'
  | 'dor_intermitente'
  | 'nenhuma'

// P12: Situações do dia a dia (múltipla escolha)
export type MentalHealthSymptom =
  | 'ansiedade'
  | 'tristeza'
  | 'foco_memoria'
  | 'oscilacao_humor'
  | 'nenhuma'

// P13: Frequência de desejo por doces
export type CravingFrequencyAnswer =
  | 'todos_dias'
  | 'algumas_vezes_semana'
  | 'uma_vez_semana'
  | 'algumas_vezes_mes'
  | 'quase_nunca'

// P14: Realidade atual
export type CurrentStateAnswer =
  | 'me_sinto_bem'
  | 'cansaco_mental'
  | 'estafa_mental'
  | 'constantemente_limite'

// P15: Condições de saúde (múltipla escolha)
export type HealthCondition =
  | 'hipotireoidismo'
  | 'metabolismo_lento'
  | 'oscilacao_hormonal'
  | 'nenhuma'

// P16: Sensibilidades e diagnósticos (múltipla escolha)
export type SensitivityCondition =
  | 'sensibilidade_gluten'
  | 'sensibilidade_laticinios'
  | 'multiplas_sensibilidades'
  | 'candida_fungos'
  | 'sii_sibo_colite_crohn'
  | 'doenca_autoimune'
  | 'nenhuma'

// P17: Frequência de uso de medicamentos
export type MedicationFrequencyAnswer =
  | 'todos_dias'
  | 'algumas_vezes_semana'
  | 'uma_vez_semana'
  | 'algumas_vezes_mes'
  | 'quase_nunca'

// P18: Experiência com dietas
export type DietExperienceAnswer =
  | 'nunca_tentei'
  | 'sem_constancia'
  | 'sem_resultados_duradouros'
  | 'tentei_tudo'

// P19: Estímulos para manter energia (múltipla escolha)
export type EnergyStimulus =
  | 'cafe_excesso'
  | 'acucar'
  | 'energeticos'
  | 'outros'
  | 'nenhum'

// =====================================================
// INTERFACE PRINCIPAL: Respostas do Quiz
// =====================================================

export interface QuizResponses {
  p1: YesNoAnswer                                  // Baixa energia/fadiga
  p2: EnergyLevelAnswer                            // Níveis de energia
  p3: StressLevelAnswer                            // Nível de estresse
  p4: YesNoAnswer                                  // Vive correndo
  p5: DigestiveFrequencyAnswer                     // Gases/inchaço
  p6: YesNoAnswer                                  // Dias sem evacuar
  p7: StoolTypeAnswer                              // Padrão de evacuação
  p8: YesNoAnswer                                  // Alergias sazonais
  p9: SkinCondition[]                              // Sinais na pele
  p10: YesNoAnswer                                 // Fica doente frequentemente
  p11: PainType[]                                  // Tipos de dor
  p12: MentalHealthSymptom[]                       // Situações do dia a dia
  p13: CravingFrequencyAnswer                      // Desejo por doces
  p14: CurrentStateAnswer                          // Realidade atual
  p15: HealthCondition[]                           // Condições de saúde
  p16: SensitivityCondition[]                      // Sensibilidades/diagnósticos
  p17: MedicationFrequencyAnswer                   // Frequência de medicamentos
  p18: DietExperienceAnswer                        // Experiência com dietas
  p19: EnergyStimulus[]                            // Estímulos para energia
}

// =====================================================
// INTERFACE: Registro completo do quiz no banco
// =====================================================

export interface QuizResponse {
  id: number
  created_at: string
  updated_at: string
  user_id: string
  responses: QuizResponses
  total_score: number
  is_completed: boolean
}

// =====================================================
// INTERFACE: Item do histórico de quizzes (resumo)
// =====================================================

export interface QuizHistoryItem {
  id: number
  created_at: string
  total_score: number
  is_completed: boolean
}

// =====================================================
// TYPE: Input para criar novo quiz
// =====================================================

export interface QuizCreateInput {
  user_id: string
  responses: QuizResponses
  total_score: number
  is_completed: boolean
}

// =====================================================
// MAPA DE PONTUAÇÕES (para cálculo)
// =====================================================

export const QUIZ_SCORES = {
  // P1
  p1: { sim: 2, nao: 0 },

  // P2
  p2: {
    baixos_cansada: 4,
    baixa_apos_almoco: 3,
    arrasto_refeicoes: 2,
    elevados_estaveis: 0
  },

  // P3
  p3: {
    muito_baixo: 0,
    leve: 1,
    moderado: 2,
    alto: 3,
    intenso: 4
  },

  // P4
  p4: { sim: 2, nao: 0 },

  // P5
  p5: {
    todos_dias: 4,
    algumas_vezes_semana: 3,
    uma_vez_semana: 2,
    algumas_vezes_mes: 1,
    quase_nunca: 0
  },

  // P6
  p6: { sim: 3, nao: 0 },

  // P7
  p7: {
    tipo_3_4: 0,
    tipo_2_5: 2,
    tipo_1_6_7: 3
  },

  // P8
  p8: { sim: 2, nao: 0 },

  // P9 (múltipla escolha - soma)
  p9: {
    acne: 2,
    rosacea: 2,
    eczema: 2,
    coceiras: 2,
    nenhuma: 0
  },

  // P10
  p10: { sim: 2, nao: 0 },

  // P11 (múltipla escolha - soma)
  p11: {
    dor_cabeca: 2,
    dor_articular: 2,
    rigidez: 2,
    dor_intermitente: 2,
    nenhuma: 0
  },

  // P12 (múltipla escolha - soma)
  p12: {
    ansiedade: 2,
    tristeza: 2,
    foco_memoria: 2,
    oscilacao_humor: 2,
    nenhuma: 0
  },

  // P13
  p13: {
    todos_dias: 4,
    algumas_vezes_semana: 3,
    uma_vez_semana: 2,
    algumas_vezes_mes: 1,
    quase_nunca: 0
  },

  // P14
  p14: {
    me_sinto_bem: 0,
    cansaco_mental: 2,
    estafa_mental: 3,
    constantemente_limite: 4
  },

  // P15 (múltipla escolha - soma)
  p15: {
    hipotireoidismo: 3,
    metabolismo_lento: 3,
    oscilacao_hormonal: 3,
    nenhuma: 0
  },

  // P16 (múltipla escolha - soma)
  p16: {
    sensibilidade_gluten: 3,
    sensibilidade_laticinios: 3,
    multiplas_sensibilidades: 3,
    candida_fungos: 3,
    sii_sibo_colite_crohn: 3,
    doenca_autoimune: 3,
    nenhuma: 0
  },

  // P17
  p17: {
    todos_dias: 4,
    algumas_vezes_semana: 3,
    uma_vez_semana: 2,
    algumas_vezes_mes: 1,
    quase_nunca: 0
  },

  // P18
  p18: {
    nunca_tentei: 0,
    sem_constancia: 1,
    sem_resultados_duradouros: 2,
    tentei_tudo: 3
  },

  // P19 (múltipla escolha - soma)
  p19: {
    cafe_excesso: 2,
    acucar: 2,
    energeticos: 2,
    outros: 2,
    nenhum: 0
  }
} as const

// =====================================================
// TYPES: Classificação de Inflamação
// =====================================================

export type InflammationLevel = 'baixa' | 'moderada' | 'alta'

export interface InflammationResult {
  level: InflammationLevel
  title: string
  description: string
  recommendations: string[]
  color: 'green' | 'yellow' | 'red'
  icon: string
}

// =====================================================
// HELPER: Calcular pontuação total
// =====================================================

export function calculateQuizScore(responses: QuizResponses): number {
  let total = 0

  // P1-P8, P10, P13, P14, P17, P18 (respostas únicas)
  total += QUIZ_SCORES.p1[responses.p1]
  total += QUIZ_SCORES.p2[responses.p2]
  total += QUIZ_SCORES.p3[responses.p3]
  total += QUIZ_SCORES.p4[responses.p4]
  total += QUIZ_SCORES.p5[responses.p5]
  total += QUIZ_SCORES.p6[responses.p6]
  total += QUIZ_SCORES.p7[responses.p7]
  total += QUIZ_SCORES.p8[responses.p8]
  total += QUIZ_SCORES.p10[responses.p10]
  total += QUIZ_SCORES.p13[responses.p13]
  total += QUIZ_SCORES.p14[responses.p14]
  total += QUIZ_SCORES.p17[responses.p17]
  total += QUIZ_SCORES.p18[responses.p18]

  // P9, P11, P12, P15, P16, P19 (múltipla escolha - soma)
  // Regra: se "nenhuma" foi selecionada, zera e não acumula
  if (!responses.p9.includes('nenhuma')) {
    total += responses.p9.reduce((sum, item) => sum + QUIZ_SCORES.p9[item], 0)
  }

  if (!responses.p11.includes('nenhuma')) {
    total += responses.p11.reduce((sum, item) => sum + QUIZ_SCORES.p11[item], 0)
  }

  if (!responses.p12.includes('nenhuma')) {
    total += responses.p12.reduce((sum, item) => sum + QUIZ_SCORES.p12[item], 0)
  }

  if (!responses.p15.includes('nenhuma')) {
    total += responses.p15.reduce((sum, item) => sum + QUIZ_SCORES.p15[item], 0)
  }

  if (!responses.p16.includes('nenhuma')) {
    total += responses.p16.reduce((sum, item) => sum + QUIZ_SCORES.p16[item], 0)
  }

  if (!responses.p19.includes('nenhum')) {
    total += responses.p19.reduce((sum, item) => sum + QUIZ_SCORES.p19[item], 0)
  }

  return total
}

// =====================================================
// HELPER: Obter nível de inflamação baseado na pontuação
// =====================================================

export function getInflammationLevel(score: number): InflammationLevel {
  if (score >= 0 && score <= 30) {
    return 'baixa'
  } else if (score >= 31 && score <= 60) {
    return 'moderada'
  } else {
    return 'alta'
  }
}

// =====================================================
// HELPER: Obter mensagem e recomendações por nível
// =====================================================

export function getInflammationMessage(level: InflammationLevel): InflammationResult {
  const messages: Record<InflammationLevel, InflammationResult> = {
    baixa: {
      level: 'baixa',
      title: 'Inflamação Baixa',
      description: 'Parabéns! Seus sintomas indicam baixos níveis de inflamação intestinal. Continue mantendo hábitos saudáveis para preservar seu bem-estar.',
      recommendations: [
        'Mantenha uma alimentação equilibrada e natural',
        'Continue praticando atividades físicas regulares',
        'Durma bem e gerencie o estresse no dia a dia',
        'Hidrate-se adequadamente ao longo do dia'
      ],
      color: 'green',
      icon: '🔹'
    },
    moderada: {
      level: 'moderada',
      title: 'Inflamação Moderada',
      description: 'Você apresenta sinais moderados de inflamação intestinal. Algumas mudanças no estilo de vida podem ajudar a melhorar seus sintomas e prevenir o agravamento.',
      recommendations: [
        'Revise sua alimentação e evite ultraprocessados',
        'Aumente o consumo de fibras e alimentos probióticos',
        'Gerencie melhor o estresse com práticas de relaxamento',
        'Considere consultar um nutricionista especializado',
        'Priorize um sono de qualidade e regular'
      ],
      color: 'yellow',
      icon: '⚠️'
    },
    alta: {
      level: 'alta',
      title: 'Inflamação Alta',
      description: 'Seus sintomas indicam níveis elevados de inflamação intestinal. É importante buscar orientação profissional para investigar as causas e implementar um tratamento adequado.',
      recommendations: [
        'Procure um médico ou nutricionista especializado urgentemente',
        'Investigue possíveis sensibilidades alimentares (glúten, lactose, etc.)',
        'Implemente um protocolo anti-inflamatório orientado',
        'Priorize sono de qualidade e redução significativa de estresse',
        'Considere exames complementares (microbiota, alergias, etc.)',
        'Evite automedicação e busque acompanhamento profissional'
      ],
      color: 'red',
      icon: '🔥'
    }
  }

  return messages[level]
}
