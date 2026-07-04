export interface Sponsor {
  id: string
  nome: string
  tipo: 'lanchonete' | 'papelaria' | 'academia' | 'uniforme'
  pagamentoSemanal: number
  requisitosReputacao: number
  duracaoTotal: number
  semanasRestantes: number
  logoEmoji: string
}

export interface EconomyTransaction {
  id: string
  semana: number
  tipo: 'receita' | 'despesa'
  categoria: 'patrocinador' | 'premiacao' | 'contratacao' | 'reforma' | 'uniforme' | 'cantina'
  valor: number
  descricao: string
}

export interface Economy {
  saldo: number
  transacoes: EconomyTransaction[]
}
