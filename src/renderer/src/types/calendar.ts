export type WeekEventType =
  | 'treino'
  | 'partida'
  | 'prova_bimestral'
  | 'festa_junina'
  | 'olimpiada_interna'
  | 'recesso'
  | 'inicio_bimestre'
  | 'fim_bimestre'
  | 'patrocinador_visita'

export interface CalendarEvent {
  id: string
  tipo: WeekEventType
  semana: number
  descricao: string
  matchId?: string
  impactoMoral?: number
  bonusCantina?: number
}

export interface GameCalendar {
  anoLetivo: number
  semanaAtual: number
  bimestreAtual: 1 | 2 | 3 | 4
  eventos: CalendarEvent[]
  semanasDeProva: number[]
}
