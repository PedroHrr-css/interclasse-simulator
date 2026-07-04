import type { GameCalendar, CalendarEvent } from '@/types'
import type { Competition } from '@/types'
import { buildMatchesForCompetition } from './competitionEngine'
import type { Match } from '@/types/match'

export function buildCalendar(ano: number, competicao: Competition): GameCalendar {
  const eventos: CalendarEvent[] = []

  // Início dos bimestres
  const inicioBimestres = [1, 11, 21, 31]
  const fimBimestres = [10, 20, 30, 40]

  inicioBimestres.forEach((semana, i) => {
    eventos.push({
      id: crypto.randomUUID(),
      tipo: 'inicio_bimestre',
      semana,
      descricao: `Início do ${i + 1}º Bimestre`
    })
  })

  fimBimestres.forEach((semana, i) => {
    eventos.push({
      id: crypto.randomUUID(),
      tipo: 'fim_bimestre',
      semana,
      descricao: `Fim do ${i + 1}º Bimestre — Semana de provas`
    })
  })

  // Festa Junina semana 15
  eventos.push({
    id: crypto.randomUUID(),
    tipo: 'festa_junina',
    semana: 15,
    descricao: 'Festa Junina da escola! Moral do time +10',
    impactoMoral: 10,
    bonusCantina: 50
  })

  // Olimpíada interna semana 25
  eventos.push({
    id: crypto.randomUUID(),
    tipo: 'olimpiada_interna',
    semana: 25,
    descricao: 'Olimpíada Interna! Recrutamento de novos talentos facilitado.',
    impactoMoral: 8
  })

  return {
    anoLetivo: ano,
    semanaAtual: 1,
    bimestreAtual: 1,
    eventos,
    semanasDeProva: [9, 10, 19, 20, 29, 30, 39, 40]
  }
}

export function getWeekEvents(calendario: GameCalendar, partidas: Match[]): {
  evento: CalendarEvent | null
  partida: Match | null
} {
  const semana = calendario.semanaAtual
  const evento = calendario.eventos.find((e) => e.semana === semana) ?? null
  const partida = partidas.find((m) => m.semana === semana && m.status === 'agendada') ?? null
  return { evento, partida }
}
