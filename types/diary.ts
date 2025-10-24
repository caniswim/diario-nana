// Tipos para o Diário de Reconexão

export type NivelFome = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type NivelSaciedade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type NivelEstresse = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type QualidadeSono = 1 | 2 | 3 | 4 | 5;
export type NivelSofrimento = 1 | 2 | 3 | 4 | 5;

// Check-in do dia (independente de refeições)
export interface CheckIn {
  emocional?: string;
  fisico?: string;
  qualidadeSono?: QualidadeSono;
  nivelEstresse?: NivelEstresse;
}

// Refeição individual (dinâmica)
export interface Refeicao {
  id: string; // uuid local
  nome: string; // ex: "Café da manhã"
  horario: string; // ex: "08:30"

  // Fome antes (1-2, 3-4, 5-6, 7-8, 9-10)
  fomeAntes?: NivelFome;

  // Sentimentos/fazendo
  sentimentos: string[]; // ["Estresse/ansiedade", "Tédio", "Tristeza", "Tranquilidade", "Pressa"]
  sentimentoOutro?: string;

  // Vontade específica
  tinhaVontade?: boolean;
  vontadeEspecifica?: string;

  // Como comeu
  comoComi: string[]; // ["Com calma e atenção", "Rápido demais", "Distraído", "Presente e aproveitando"]

  // Gostou da comida
  gosteiDaComida?: string; // "Sim, muito" | "Foi ok" | "Não muito" | "Não prestei atenção"

  // Saciedade final (1-2, 3-4, 5-6, 7-8, 9-10)
  saciedadeFinal?: NivelSaciedade;

  // Depois da refeição
  depoisFisico: string[]; // ["Leve e confortável", "Um pouco cheio", "Muito cheio/pesado", "Com desconforto"]
  depoisEmocional: string[]; // ["Tranquilo/satisfeito", "Culpado", "Arrependido", "Neutro", "Feliz"]

  // Observação
  observacao?: string;

  createdAt: number;
}

// Práticas do dia
export interface Praticas {
  // Conseguiu parar no nível 5-6
  parouNivel56?: string; // "Sim, em todas" | "Sim, em 2 refeições" | "Sim, em 1 refeição" | "Não consegui"
  parouNivel56Qual?: string; // Se marcou "Sim, em 1 refeição"
  parouNivel56Obs?: string; // Se marcou "Não consegui"

  // Serviu menos
  serviuMenos?: string; // "Sim, funcionou bem" | "Sim, mas foi difícil" | "Não"
  serviuMenosObs?: string; // Se marcou "Não"

  // Comeu sem compensar
  comeuSemCompensar?: boolean;
  comeuSemCompensarOque?: string;
  comeuSemCompensarSentimento?: string;
  comeuSemCompensarImpediu?: string;
  comeuSemCompensarNaoSentiu?: boolean;
}

// Reflexão do dia
export interface Reflexao {
  // Pensou em comida fora dos horários
  pensouComidaForaHorarios?: string; // "Pouco (normal)" | "Moderadamente" | "Muito (obsessivamente)"
  pensouComidaQuando?: string;

  // Comeu sem fome física
  comeuSemFome?: string; // "Não" | "Sim, 1 vez" | "Sim, várias vezes"
  comeuSemFomeBuscava?: string[]; // ["Conforto emocional", "Distração/tédio", "Prazer/recompensa", "Hábito/automático", "Outro"]
  comeuSemFomeBuscavaOutro?: string;

  // Aprendizados
  aprendizado?: string;
  notaParaSi?: string;
}

// Sinais de alerta
export type SinalAlerta =
  | "Tive episódio de compulsão hoje"
  | "Pulei refeições intencionalmente"
  | "Pesei comida ou contei calorias obsessivamente"
  | "Fiz exercício como compensação"
  | "Pensei em comida/corpo por mais de 50% do dia"
  | "Me comparei muito com outras pessoas"
  | "Senti vontade de me machucar ou pensamentos muito negativos";

// Resumo semanal (apenas domingos)
export interface ResumoSemanal {
  padroes?: string;
  funcionouBem?: string;
  desafios?: string;
  proximaSemanaFoco?: string;
  nivelSofrimento?: NivelSofrimento;
}

// Entrada completa do diário
export interface DiaryEntry {
  id: string; // uuid
  date: string; // YYYY-MM-DD

  // Seções fixas
  checkIn: CheckIn;
  refeicoes: Refeicao[]; // Array dinâmico
  praticas: Praticas;
  reflexao: Reflexao;
  sinaisAlerta: SinalAlerta[];

  // Resumo semanal (apenas domingos)
  resumoSemanal?: ResumoSemanal;

  // Metadados
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

// Tipo para o schema do Supabase
export interface DiaryEntryDB {
  id: string;
  date: string;
  check_in: CheckIn;
  refeicoes: Refeicao[];
  praticas: Praticas;
  reflexao: Reflexao;
  sinais_alerta: SinalAlerta[];
  resumo_semanal?: ResumoSemanal;
  created_at: string;
  updated_at: string;
}
