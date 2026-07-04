import type { CourtCondition } from '@/types/school'
import type { Sponsor } from '@/types'
import type { CourtUpgradeType } from '@/store/actions'

interface CourtUpgradeInfo {
  nome: string
  custo: number
  bonusMoral: number
  efeito: Partial<{
    condicao: CourtCondition
    temIluminacao: boolean
    temVestiario: boolean
    temTribuna: boolean
    nivelPintura: 0 | 1 | 2 | 3
  }>
}

export const COURT_UPGRADES: Record<CourtUpgradeType, CourtUpgradeInfo> = {
  limpar: {
    nome: 'Limpeza da Quadra',
    custo: 20,
    bonusMoral: 5,
    efeito: { condicao: 'regular' }
  },
  pintar: {
    nome: 'Pintura das Linhas',
    custo: 80,
    bonusMoral: 8,
    efeito: { nivelPintura: 2 }
  },
  reformar: {
    nome: 'Reforma Completa',
    custo: 250,
    bonusMoral: 20,
    efeito: { condicao: 'boa' }
  },
  iluminacao: {
    nome: 'Instalação de Iluminação',
    custo: 500,
    bonusMoral: 15,
    efeito: { temIluminacao: true }
  },
  vestiario: {
    nome: 'Construção de Vestiário',
    custo: 350,
    bonusMoral: 10,
    efeito: { temVestiario: true }
  },
  tribuna: {
    nome: 'Construção de Tribuna',
    custo: 400,
    bonusMoral: 12,
    efeito: { temTribuna: true }
  }
}

export function availableSponsors(): Sponsor[] {
  return [
    {
      id: 'sp-lanchonete-ze',
      nome: "Lanchonete do Zé",
      tipo: 'lanchonete',
      pagamentoSemanal: 40,
      requisitosReputacao: 0,
      duracaoTotal: 8,
      semanasRestantes: 0,
      logoEmoji: '🍔'
    },
    {
      id: 'sp-papelaria-central',
      nome: 'Papelaria Central',
      tipo: 'papelaria',
      pagamentoSemanal: 30,
      requisitosReputacao: 0,
      duracaoTotal: 10,
      semanasRestantes: 0,
      logoEmoji: '📚'
    },
    {
      id: 'sp-academia-fit',
      nome: 'Academia FitLife',
      tipo: 'academia',
      pagamentoSemanal: 60,
      requisitosReputacao: 25,
      duracaoTotal: 12,
      semanasRestantes: 0,
      logoEmoji: '💪'
    },
    {
      id: 'sp-uniforme-sport',
      nome: 'Sport Uniformes',
      tipo: 'uniforme',
      pagamentoSemanal: 50,
      requisitosReputacao: 20,
      duracaoTotal: 16,
      semanasRestantes: 0,
      logoEmoji: '👕'
    }
  ]
}
