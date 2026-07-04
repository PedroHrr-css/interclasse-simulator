export type SchoolType = 'publica' | 'particular'

export type CourtCondition = 'excelente' | 'boa' | 'regular' | 'danificada' | 'pessima'

export interface Court {
  condicao: CourtCondition
  temIluminacao: boolean
  temVestiario: boolean
  temTribuna: boolean
  nivelPintura: 0 | 1 | 2 | 3
}

export interface School {
  id: string
  nome: string
  tipo: SchoolType
  cidade: string
  estado: string
  quadra: Court
  reputacao: number
  moral: number
  verbaMensal: number
}
