import type { GameState, KitConfig, MatchLineup, Formacao } from '@/types'
import type { SchoolType } from '@/types/school'

export type GameAction =
  | { type: 'START_NEW_GAME'; payload: { escolaTipo: SchoolType; nomeEscola: string; cidade: string; nomeProfesor: string; kit: KitConfig; kit2: KitConfig } }
  | { type: 'SHOW_JORNAL' }
  | { type: 'UPDATE_KIT2'; payload: Partial<KitConfig> }
  | { type: 'ADVANCE_WEEK' }
  | { type: 'SIGN_PLAYER'; payload: { player: import('@/types').Player } }
  | { type: 'RELEASE_PLAYER'; payload: { playerId: string } }
  | { type: 'SET_LINEUP'; payload: { goleiro: string; titulares: string[]; formacao: Formacao } }
  | { type: 'SIMULATE_MATCH'; payload: { matchId: string; lineup: MatchLineup } }
  | { type: 'UPGRADE_COURT'; payload: { upgrade: CourtUpgradeType; custo: number } }
  | { type: 'HIRE_SPONSOR'; payload: { sponsorId: string } }
  | { type: 'UPDATE_KIT'; payload: Partial<KitConfig> }
  | { type: 'LOAD_SAVE'; payload: { state: GameState } }
  | { type: 'DISMISS_NOTIFICATION'; payload: { id: string } }
  | { type: 'TRAIN_WEEK' }

export type CourtUpgradeType =
  | 'limpar'
  | 'pintar'
  | 'reformar'
  | 'iluminacao'
  | 'vestiario'
  | 'tribuna'
