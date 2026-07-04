import type { Player, Position } from '@/types'
import type { School, SchoolType } from '@/types/school'
import {
  nomeAleatorio,
  apelidoAleatorio,
  series,
  cidades,
  prefixosEscolasPublicas,
  nomesEscolasPublicas,
  nomesEscolasParticulares
} from '@/data/brazilianNames'

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function gerarAtributoBase(tipo: SchoolType, posicao: Position): number {
  const base = tipo === 'publica' ? rand(20, 65) : rand(30, 60)
  const bonus: Record<Position, number> = { goleiro: 0, fixo: 5, ala: 5, pivo: 5 }
  return Math.min(99, base + bonus[posicao])
}

function gerarNotaInicial(tipo: SchoolType): number {
  const min = tipo === 'publica' ? 4 : 5.5
  const max = tipo === 'publica' ? 9.5 : 10
  return Math.round((min + Math.random() * (max - min)) * 10) / 10
}

function gerarPotencial(tipo: SchoolType): number {
  if (tipo === 'publica') return rand(55, 99)
  return rand(40, 80)
}

function gerarSalario(posicao: Position, tipo: SchoolType): number {
  const base: Record<Position, number> = { goleiro: 25, fixo: 30, ala: 28, pivo: 32 }
  const mult = tipo === 'publica' ? 1 : 1.3
  return Math.round(base[posicao] * mult)
}

export function generatePlayer(
  tipo: SchoolType,
  posicao: Position,
  escolaId: string,
  serie?: string
): Player {
  const notaInicial = gerarNotaInicial(tipo)
  return {
    id: crypto.randomUUID(),
    nome: nomeAleatorio(),
    apelido: apelidoAleatorio(),
    idade: rand(14, 18),
    serie: serie ?? series[Math.floor(Math.random() * series.length)],
    posicao,
    atributos: {
      velocidade: gerarAtributoBase(tipo, posicao),
      finalizacao: posicao === 'pivo' ? gerarAtributoBase(tipo, posicao) + 10 : gerarAtributoBase(tipo, posicao),
      passe: gerarAtributoBase(tipo, posicao),
      drible: posicao === 'ala' ? gerarAtributoBase(tipo, posicao) + 10 : gerarAtributoBase(tipo, posicao),
      resistencia: gerarAtributoBase(tipo, posicao),
      reflexo: posicao === 'goleiro' ? gerarAtributoBase(tipo, posicao) + 20 : gerarAtributoBase(tipo, posicao),
      notaEscolar: notaInicial,
      potencial: gerarPotencial(tipo)
    },
    status: notaInicial < 5 ? 'suspenso' : 'disponivel',
    roundsSuspenso: notaInicial < 5 ? 2 : 0,
    moral: rand(50, 80),
    salarioCantina: gerarSalario(posicao, tipo),
    escolaOrigem: escolaId,
    historicoNotas: [notaInicial],
    foiContratado: false
  }
}

export function generatePlayers(escola: School): Player[] {
  const players: Player[] = []

  // 2 goleiros
  for (let i = 0; i < 2; i++) {
    players.push(generatePlayer(escola.tipo, 'goleiro', escola.id))
  }
  // 4 fixos
  for (let i = 0; i < 4; i++) {
    players.push(generatePlayer(escola.tipo, 'fixo', escola.id))
  }
  // 4 alas
  for (let i = 0; i < 4; i++) {
    players.push(generatePlayer(escola.tipo, 'ala', escola.id))
  }
  // 4 pivôs
  for (let i = 0; i < 4; i++) {
    players.push(generatePlayer(escola.tipo, 'pivo', escola.id))
  }

  return players
}

export function generateTransferPlayers(escolaTipo: SchoolType, quantidade: number): Player[] {
  const posicoes: Position[] = ['goleiro', 'fixo', 'ala', 'pivo']
  const players: Player[] = []
  for (let i = 0; i < quantidade; i++) {
    const posicao = posicoes[Math.floor(Math.random() * posicoes.length)]
    const player = generatePlayer(escolaTipo, posicao, 'mercado')
    players.push({
      ...player,
      salarioCantina: Math.round(player.salarioCantina * 1.5 + rand(10, 50))
    })
  }
  return players
}

export function generateSchool(tipo: SchoolType, nome: string, cidadeEscolhida?: string): School {
  const loc = cidades[Math.floor(Math.random() * cidades.length)]
  const cidadeFinal = cidadeEscolhida ?? loc.cidade
  const estadoFinal = cidades.find(c => c.cidade === cidadeFinal)?.estado ?? loc.estado

  return {
    id: crypto.randomUUID(),
    nome,
    tipo,
    cidade: cidadeFinal,
    estado: estadoFinal,
    quadra: {
      condicao: tipo === 'publica' ? 'danificada' : 'regular',
      temIluminacao: tipo === 'particular',
      temVestiario: tipo === 'particular',
      temTribuna: false,
      nivelPintura: tipo === 'publica' ? 0 : 1
    },
    reputacao: tipo === 'publica' ? 5 : 15,
    moral: tipo === 'publica' ? 55 : 65,
    verbaMensal: tipo === 'publica' ? 80 : 200
  }
}

export function generateRivalSchool(tipo: SchoolType, forcaMedia: number): School {
  const loc = cidades[Math.floor(Math.random() * cidades.length)]
  const prefixos = tipo === 'publica' ? prefixosEscolasPublicas : []
  const nomes = tipo === 'publica' ? nomesEscolasPublicas : nomesEscolasParticulares

  const nomeParte = nomes[Math.floor(Math.random() * nomes.length)]
  const nomeEscola =
    tipo === 'publica'
      ? `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeParte}`
      : `Colégio ${nomeParte}`

  return {
    id: crypto.randomUUID(),
    nome: nomeEscola,
    tipo,
    cidade: loc.cidade,
    estado: loc.estado,
    quadra: {
      condicao: 'regular',
      temIluminacao: false,
      temVestiario: false,
      temTribuna: false,
      nivelPintura: 1
    },
    reputacao: Math.max(5, forcaMedia - 10 + rand(0, 20)),
    moral: rand(50, 80),
    verbaMensal: 100
  }
}
