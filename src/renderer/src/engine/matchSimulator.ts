import type { Player } from '@/types'
import type { MatchEvent, MatchEventType, MatchStats } from '@/types/match'
import { getEventText } from '@/data/eventTexts'

interface TeamData {
  schoolNome: string
  jogadores: Player[]
  moral: number
}

interface RivalData {
  schoolNome: string
  forca: number
  moral: number
}

interface SimResult {
  placarHome: number
  placarAway: number
  eventos: MatchEvent[]
  estatisticas: MatchStats
}

function calcTeamStrength(jogadores: Player[], moral: number): number {
  if (jogadores.length === 0) return 20
  const mediaAtributos =
    jogadores.reduce((acc, j) => {
      const media =
        (j.atributos.velocidade +
          j.atributos.finalizacao +
          j.atributos.passe +
          j.atributos.drible +
          j.atributos.resistencia) /
        5
      return acc + media
    }, 0) / jogadores.length

  const bonusMoral = moral > 70 ? 1.05 : moral < 30 ? 0.92 : 1.0
  return Math.round(mediaAtributos * bonusMoral)
}

function randomPlayer(jogadores: Player[]): string {
  return jogadores[Math.floor(Math.random() * jogadores.length)]?.nome ?? 'Desconhecido'
}

type EventWeight = { tipo: MatchEventType; peso: number }

const eventWeights: EventWeight[] = [
  { tipo: 'gol', peso: 12 },
  { tipo: 'chute_defendido', peso: 18 },
  { tipo: 'falta', peso: 22 },
  { tipo: 'chance_perdida', peso: 18 },
  { tipo: 'escanteio', peso: 12 },
  { tipo: 'defesa_goleiro', peso: 10 },
  { tipo: 'cartao_amarelo', peso: 6 },
  { tipo: 'cartao_vermelho', peso: 2 }
]

function sortearEventType(): MatchEventType {
  const total = eventWeights.reduce((a, b) => a + b.peso, 0)
  let r = Math.random() * total
  for (const ew of eventWeights) {
    r -= ew.peso
    if (r <= 0) return ew.tipo
  }
  return 'falta'
}

export function simulateMatch(home: TeamData, away: RivalData): SimResult {
  const forcaHome = calcTeamStrength(home.jogadores, home.moral)
  const forcaAway = away.forca

  const eventos: MatchEvent[] = []
  let placarHome = 0
  let placarAway = 0
  const stats: MatchStats = {
    chutes: { home: 0, away: 0 },
    posseBola: 50,
    faltas: { home: 0, away: 0 },
    cartoesAmarelos: { home: 0, away: 0 },
    cartoesVermelhos: { home: 0, away: 0 }
  }

  const totalForca = forcaHome + forcaAway

  eventos.push({
    minuto: 0,
    tipo: 'inicio_tempo',
    time: 'home',
    descricao: '--- Apita o árbitro! Começa o 1º tempo! ---'
  })

  for (let min = 1; min <= 40; min++) {
    if (min === 21) {
      eventos.push({
        minuto: 20,
        tipo: 'fim_tempo',
        time: 'home',
        descricao: `--- Fim do 1º tempo! Placar: ${home.schoolNome} ${placarHome} x ${placarAway} ${away.schoolNome} ---`
      })
      eventos.push({
        minuto: 21,
        tipo: 'inicio_tempo',
        time: 'home',
        descricao: '--- Começa o 2º tempo! ---'
      })
    }

    if (Math.random() > 0.60) continue

    const isHome = Math.random() < forcaHome / totalForca
    const teamLabel: 'home' | 'away' = isHome ? 'home' : 'away'
    const teamNome = isHome ? home.schoolNome : away.schoolNome
    const jogadorNome = isHome ? randomPlayer(home.jogadores) : `Jogador ${Math.floor(Math.random() * 10) + 1}`

    const tipo = sortearEventType()

    if (tipo === 'gol') {
      if (isHome) placarHome++
      else placarAway++
      stats.chutes[teamLabel]++
    } else if (tipo === 'chute_defendido' || tipo === 'defesa_goleiro') {
      stats.chutes[teamLabel]++
    } else if (tipo === 'falta') {
      stats.faltas[isHome ? 'away' : 'home']++
    } else if (tipo === 'cartao_amarelo') {
      stats.cartoesAmarelos[isHome ? 'away' : 'home']++
    } else if (tipo === 'cartao_vermelho') {
      stats.cartoesVermelhos[isHome ? 'away' : 'home']++
    }

    const descricao = getEventText(tipo, jogadorNome, teamNome)
    eventos.push({ minuto: min, tipo, time: teamLabel, jogadorNome, descricao })
  }

  eventos.push({
    minuto: 40,
    tipo: 'fim_partida',
    time: 'home',
    descricao: `--- APITO FINAL! ${home.schoolNome} ${placarHome} x ${placarAway} ${away.schoolNome} ---`
  })

  const totalChutes = stats.chutes.home + stats.chutes.away
  stats.posseBola = totalChutes > 0 ? Math.round((stats.chutes.home / totalChutes) * 100) : 50

  return { placarHome, placarAway, eventos, estatisticas: stats }
}
