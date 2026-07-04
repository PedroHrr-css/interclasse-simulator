import type { Competition, StandingEntry } from '@/types'
import type { School } from '@/types/school'
import type { Match } from '@/types/match'
import { generateRivalSchool } from './playerGenerator'

export function generateInterclasse(escola: School, temporada: number): Competition {
  const rivais = [
    `Turma 1A`, `Turma 1B`, `Turma 2A`, `Turma 2B`,
    `Turma 3A`, `Turma 3B`, `Turma 3C`
  ]

  const tabela: StandingEntry[] = [
    {
      schoolId: escola.id,
      schoolNome: escola.nome,
      pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
      golsPro: 0, golsContra: 0
    },
    ...rivais.map((nome) => ({
      schoolId: crypto.randomUUID(),
      schoolNome: `${escola.nome} — ${nome}`,
      pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
      golsPro: 0, golsContra: 0
    }))
  ]

  return {
    id: crypto.randomUUID(),
    nome: `Interclasse ${temporada} — ${escola.nome}`,
    nivel: 'interclasse',
    formato: 'pontos_corridos',
    temporada,
    tabela,
    rodadaAtual: 0,
    totalRodadas: rivais.length,
    status: 'planejada',
    premioVencedor: 300,
    premioPorVitoria: 50
  }
}

export function generateMunicipalCup(escola: School, temporada: number): Competition {
  const escolaRival1 = generateRivalSchool(escola.tipo, 45)
  const escolaRival2 = generateRivalSchool(escola.tipo === 'publica' ? 'particular' : 'publica', 50)
  const escolaRival3 = generateRivalSchool(escola.tipo, 55)

  const tabela: StandingEntry[] = [
    {
      schoolId: escola.id,
      schoolNome: escola.nome,
      pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
      golsPro: 0, golsContra: 0
    },
    ...[escolaRival1, escolaRival2, escolaRival3].map((r) => ({
      schoolId: r.id,
      schoolNome: r.nome,
      pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
      golsPro: 0, golsContra: 0
    }))
  ]

  return {
    id: crypto.randomUUID(),
    nome: `Taça Municipal ${temporada}`,
    nivel: 'municipal',
    formato: 'pontos_corridos',
    temporada,
    tabela,
    rodadaAtual: 0,
    totalRodadas: 3,
    status: 'planejada',
    premioVencedor: 800,
    premioPorVitoria: 150
  }
}

export function buildMatchesForCompetition(
  competicao: Competition,
  escolaId: string,
  semanaInicio: number
): Match[] {
  const rivais = competicao.tabela.filter((t) => t.schoolId !== escolaId)
  return rivais.map((rival, i) => ({
    id: crypto.randomUUID(),
    rodada: i + 1,
    competicaoId: competicao.id,
    semana: semanaInicio + i * 2,
    homeSchoolId: escolaId,
    awaySchoolId: rival.schoolId,
    homeSchoolNome: competicao.tabela.find((t) => t.schoolId === escolaId)?.schoolNome ?? '',
    awaySchoolNome: rival.schoolNome,
    placarHome: 0,
    placarAway: 0,
    eventos: [],
    status: 'agendada',
    estatisticas: {
      chutes: { home: 0, away: 0 },
      posseBola: 50,
      faltas: { home: 0, away: 0 },
      cartoesAmarelos: { home: 0, away: 0 },
      cartoesVermelhos: { home: 0, away: 0 }
    }
  }))
}
