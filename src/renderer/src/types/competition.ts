export type CompetitionLevel = 'interclasse' | 'municipal' | 'estadual' | 'nacional'
export type CompetitionFormat = 'pontos_corridos' | 'grupos_eliminatorias' | 'mata_mata'

export interface StandingEntry {
  schoolId: string
  schoolNome: string
  pontos: number
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  golsPro: number
  golsContra: number
}

export interface Competition {
  id: string
  nome: string
  nivel: CompetitionLevel
  formato: CompetitionFormat
  temporada: number
  tabela: StandingEntry[]
  rodadaAtual: number
  totalRodadas: number
  status: 'planejada' | 'em_andamento' | 'finalizada'
  premioVencedor: number
  premioPorVitoria: number
  campeoId?: string
}
