export type { Player, PlayerAttributes, Position, PlayerStatus } from './player'
export type { School, SchoolType, Court, CourtCondition } from './school'
export type { Match, MatchEvent, MatchEventType, MatchLineup, MatchStats, Formacao } from './match'
export type { Competition, CompetitionLevel, CompetitionFormat, StandingEntry } from './competition'
export type { Economy, EconomyTransaction, Sponsor } from './economy'
export type { GameCalendar, CalendarEvent, WeekEventType } from './calendar'

export interface KitConfig {
  corPrimaria: string
  corSecundaria: string
  corNumero: string
  estilo: 'solido' | 'bicolor' | 'listra_v' | 'listra_h'
  simbolo: string
}

export interface SaveSlot {
  id: string
  nomeEscola: string
  temporada: number
  semana: number
  dataSave: string
}

export interface GameState {
  fase: 'menu' | 'novo_jogo' | 'jornal' | 'jogando' | 'game_over'
  nomeProfesor: string
  escola: import('./school').School
  jogadores: import('./player').Player[]
  goleiro: string | null
  titulares: string[]
  formacao: import('./match').Formacao
  competicoes: import('./competition').Competition[]
  competicaoAtiva: string | null
  calendario: import('./calendar').GameCalendar
  economia: import('./economy').Economy
  patrocinadores: import('./economy').Sponsor[]
  partidas: import('./match').Match[]
  kit: KitConfig
  kit2: KitConfig
  notificacoes: GameNotification[]
}

export interface GameNotification {
  id: string
  tipo: 'info' | 'sucesso' | 'aviso' | 'erro'
  mensagem: string
  semana: number
}
