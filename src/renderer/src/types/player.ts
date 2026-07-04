export type Position = 'goleiro' | 'fixo' | 'ala' | 'pivo'

export type PlayerStatus = 'disponivel' | 'suspenso' | 'em_prova' | 'lesionado'

export interface PlayerAttributes {
  velocidade: number
  finalizacao: number
  passe: number
  drible: number
  resistencia: number
  reflexo: number
  notaEscolar: number
  potencial: number
}

export interface Player {
  id: string
  nome: string
  apelido?: string
  idade: number
  serie: string
  posicao: Position
  atributos: PlayerAttributes
  status: PlayerStatus
  roundsSuspenso: number
  moral: number
  salarioCantina: number
  escolaOrigem: string
  historicoNotas: number[]
  foiContratado: boolean
}
