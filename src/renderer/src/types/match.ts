export type MatchEventType =
  | 'gol'
  | 'chute_defendido'
  | 'falta'
  | 'cartao_amarelo'
  | 'cartao_vermelho'
  | 'escanteio'
  | 'chance_perdida'
  | 'defesa_goleiro'
  | 'inicio_tempo'
  | 'fim_tempo'
  | 'fim_partida'

export interface MatchEvent {
  minuto: number
  tipo: MatchEventType
  jogadorNome?: string
  time: 'home' | 'away'
  descricao: string
}

export type Formacao = '2-2' | '3-1' | '1-2-1'

export interface MatchLineup {
  goleiro: string
  titulares: string[]
  formacao: Formacao
}

export interface MatchStats {
  chutes: { home: number; away: number }
  posseBola: number
  faltas: { home: number; away: number }
  cartoesAmarelos: { home: number; away: number }
  cartoesVermelhos: { home: number; away: number }
}

export interface Match {
  id: string
  rodada: number
  competicaoId: string
  semana: number
  homeSchoolId: string
  awaySchoolId: string
  homeSchoolNome: string
  awaySchoolNome: string
  homeLineup?: MatchLineup
  placarHome: number
  placarAway: number
  eventos: MatchEvent[]
  status: 'agendada' | 'em_andamento' | 'finalizada'
  estatisticas: MatchStats
}
