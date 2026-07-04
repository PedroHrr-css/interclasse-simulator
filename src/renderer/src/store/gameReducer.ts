import type { GameState, GameNotification } from '@/types'
import type { GameAction } from './actions'
import { generateSchool, generatePlayers } from '@/engine/playerGenerator'
import { generateInterclasse } from '@/engine/competitionEngine'
import { buildCalendar } from '@/engine/calendarEngine'
import { simulateMatch } from '@/engine/matchSimulator'
import { COURT_UPGRADES, availableSponsors } from '@/data/initialConfig'

function addNotif(
  state: GameState,
  tipo: GameNotification['tipo'],
  mensagem: string
): GameNotification[] {
  return [
    ...(state.notificacoes ?? []),
    { id: crypto.randomUUID(), tipo, mensagem, semana: state.calendario?.semanaAtual ?? 1 }
  ]
}

function gerarNota(tipo: import('@/types/school').SchoolType): number {
  const base = tipo === 'publica' ? 5 + Math.random() * 5 : 6 + Math.random() * 4
  return Math.round(base * 10) / 10
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'START_NEW_GAME': {
      const { escolaTipo, nomeEscola, cidade, nomeProfesor, kit, kit2 } = action.payload
      const escola = generateSchool(escolaTipo, nomeEscola, cidade)
      const jogadores = generatePlayers(escola)
      const competicoes = [generateInterclasse(escola, 2025)]
      const calendario = buildCalendar(2025, competicoes[0])

      return {
        ...state,
        fase: 'jornal',
        nomeProfesor,
        escola,
        jogadores,
        goleiro: null,
        titulares: [],
        formacao: '2-2',
        competicoes,
        competicaoAtiva: competicoes[0].id,
        calendario,
        economia: { saldo: escolaTipo === 'publica' ? 200 : 600, transacoes: [] },
        patrocinadores: availableSponsors(),
        partidas: [],
        kit,
        kit2,
        notificacoes: []
      }
    }

    case 'SHOW_JORNAL': {
      return { ...state, fase: 'jornal' }
    }

    case 'ADVANCE_WEEK': {
      const { calendario, economia, jogadores, escola } = state
      const proximaSemana = calendario.semanaAtual + 1
      const fimBimestres = [10, 20, 30, 40]

      let novoBimestre = calendario.bimestreAtual
      if (fimBimestres.includes(calendario.semanaAtual)) {
        novoBimestre = Math.min(4, novoBimestre + 1) as 1 | 2 | 3 | 4
      }

      const receitaPatrocinadores = state.patrocinadores
        .filter((s) => s.semanasRestantes > 0)
        .reduce((acc, s) => acc + s.pagamentoSemanal, 0)

      const despesaSalarios = jogadores
        .filter((j) => j.foiContratado)
        .reduce((acc, j) => acc + j.salarioCantina, 0)

      const novoSaldo = economia.saldo + receitaPatrocinadores - despesaSalarios
      const novasTransacoes = [...economia.transacoes]
      if (receitaPatrocinadores > 0) {
        novasTransacoes.push({ id: crypto.randomUUID(), semana: proximaSemana, tipo: 'receita', categoria: 'patrocinador', valor: receitaPatrocinadores, descricao: 'Receita semanal de patrocinadores' })
      }
      if (despesaSalarios > 0) {
        novasTransacoes.push({ id: crypto.randomUUID(), semana: proximaSemana, tipo: 'despesa', categoria: 'cantina', valor: despesaSalarios, descricao: 'Salários dos jogadores contratados' })
      }

      const novosPatrocinadores = state.patrocinadores.map((s) =>
        s.semanasRestantes > 0 ? { ...s, semanasRestantes: s.semanasRestantes - 1 } : s
      )

      const novosJogadores = jogadores.map((j) => {
        if (j.status === 'suspenso' && j.roundsSuspenso > 0) {
          const r = j.roundsSuspenso - 1
          return { ...j, roundsSuspenso: r, status: r === 0 ? ('disponivel' as const) : ('suspenso' as const) }
        }
        return j
      })

      const ehFimBimestre = fimBimestres.includes(calendario.semanaAtual)
      const novosJogadoresComNotas = ehFimBimestre
        ? novosJogadores.map((j) => {
            const novaNota = gerarNota(escola.tipo)
            const historico = [...j.historicoNotas, novaNota].slice(-4)
            const media = historico.reduce((a, b) => a + b, 0) / historico.length
            const suspenso = media < 7.0
            return { ...j, atributos: { ...j.atributos, notaEscolar: novaNota }, historicoNotas: historico, status: suspenso ? ('suspenso' as const) : ('disponivel' as const), roundsSuspenso: suspenso ? 2 : j.roundsSuspenso }
          })
        : novosJogadores

      const novasNotificacoes: GameNotification[] = []
      if (novoSaldo < 0) novasNotificacoes.push({ id: crypto.randomUUID(), tipo: 'erro', mensagem: 'Saldo negativo! Corte custos urgente.', semana: proximaSemana })
      if (ehFimBimestre) {
        novosJogadoresComNotas.filter((j, i) => j.status === 'suspenso' && novosJogadores[i].status !== 'suspenso').forEach((j) => {
          novasNotificacoes.push({ id: crypto.randomUUID(), tipo: 'aviso', mensagem: `${j.nome} suspenso por nota baixa (${j.atributos.notaEscolar.toFixed(1)})`, semana: proximaSemana })
        })
      }

      return {
        ...state,
        jogadores: novosJogadoresComNotas,
        calendario: { ...calendario, semanaAtual: proximaSemana, bimestreAtual: novoBimestre },
        economia: { saldo: novoSaldo, transacoes: novasTransacoes },
        patrocinadores: novosPatrocinadores,
        notificacoes: [...(state.notificacoes ?? []), ...novasNotificacoes]
      }
    }

    case 'SIGN_PLAYER': {
      const { player } = action.payload
      const taxa = player.escolaOrigem === 'mercado' ? 50 : 0
      if (taxa > 0 && state.economia.saldo < taxa) {
        return { ...state, notificacoes: addNotif(state, 'erro', 'Saldo insuficiente para contratar!') }
      }
      const jaNoElenco = state.jogadores.some((j) => j.id === player.id)
      const novosJogadores = jaNoElenco
        ? state.jogadores.map((j) => j.id === player.id ? { ...j, foiContratado: true } : j)
        : [...state.jogadores, { ...player, foiContratado: true }]
      const novasTransacoes = taxa > 0
        ? [...state.economia.transacoes, { id: crypto.randomUUID(), semana: state.calendario.semanaAtual, tipo: 'despesa' as const, categoria: 'contratacao' as const, valor: taxa, descricao: `Contratação de ${player.nome}` }]
        : state.economia.transacoes
      return {
        ...state,
        jogadores: novosJogadores,
        economia: { ...state.economia, saldo: state.economia.saldo - taxa, transacoes: novasTransacoes },
        notificacoes: addNotif(state, 'sucesso', `${player.nome} contratado!`)
      }
    }

    case 'RELEASE_PLAYER': {
      const jogador = state.jogadores.find((j) => j.id === action.payload.playerId)
      if (!jogador) return state
      return {
        ...state,
        jogadores: state.jogadores.map((j) => j.id === action.payload.playerId ? { ...j, foiContratado: false } : j),
        titulares: state.titulares.filter((id) => id !== action.payload.playerId),
        goleiro: state.goleiro === action.payload.playerId ? null : state.goleiro,
        notificacoes: addNotif(state, 'info', `${jogador.nome} dispensado.`)
      }
    }

    case 'SET_LINEUP': {
      return { ...state, goleiro: action.payload.goleiro, titulares: action.payload.titulares, formacao: action.payload.formacao }
    }

    case 'SIMULATE_MATCH': {
      const match = state.partidas.find((m) => m.id === action.payload.matchId)
      if (!match) return state
      const homeJogadores = state.jogadores.filter((j) =>
        [action.payload.lineup.goleiro, ...action.payload.lineup.titulares].includes(j.id) && j.status === 'disponivel'
      )
      const resultado = simulateMatch(
        { schoolNome: state.escola.nome, jogadores: homeJogadores, moral: state.escola.moral },
        { schoolNome: match.awaySchoolNome, forca: 40 + Math.floor(Math.random() * 30), moral: 60 }
      )
      const vitoria = resultado.placarHome > resultado.placarAway
      const empate = resultado.placarHome === resultado.placarAway
      const premiacao = vitoria ? (state.competicoes.find(c => c.id === match.competicaoId)?.premioPorVitoria ?? 0) : 0
      const novosPartidas = state.partidas.map((m) =>
        m.id === action.payload.matchId
          ? { ...m, placarHome: resultado.placarHome, placarAway: resultado.placarAway, eventos: resultado.eventos, estatisticas: resultado.estatisticas, status: 'finalizada' as const, homeLineup: action.payload.lineup }
          : m
      )
      const novasCompeticoes = state.competicoes.map((c) => {
        if (c.id !== match.competicaoId) return c
        return {
          ...c,
          tabela: c.tabela.map((entry) => {
            if (entry.schoolId !== state.escola.id) return entry
            return { ...entry, jogos: entry.jogos + 1, vitorias: vitoria ? entry.vitorias + 1 : entry.vitorias, empates: empate ? entry.empates + 1 : entry.empates, derrotas: !vitoria && !empate ? entry.derrotas + 1 : entry.derrotas, pontos: entry.pontos + (vitoria ? 3 : empate ? 1 : 0), golsPro: entry.golsPro + resultado.placarHome, golsContra: entry.golsContra + resultado.placarAway }
          }),
          rodadaAtual: c.rodadaAtual + 1
        }
      })
      const novasTransacoes = premiacao > 0
        ? [...state.economia.transacoes, { id: crypto.randomUUID(), semana: state.calendario.semanaAtual, tipo: 'receita' as const, categoria: 'premiacao' as const, valor: premiacao, descricao: 'Premiação por vitória' }]
        : state.economia.transacoes
      const placar = `${resultado.placarHome}x${resultado.placarAway}`
      return {
        ...state,
        partidas: novosPartidas,
        competicoes: novasCompeticoes,
        economia: { saldo: state.economia.saldo + premiacao, transacoes: novasTransacoes },
        notificacoes: addNotif(state, vitoria ? 'sucesso' : empate ? 'info' : 'aviso', `${vitoria ? 'Vitória' : empate ? 'Empate' : 'Derrota'} ${placar}`)
      }
    }

    case 'UPGRADE_COURT': {
      const { upgrade, custo } = action.payload
      if (state.economia.saldo < custo) return { ...state, notificacoes: addNotif(state, 'erro', 'Saldo insuficiente!') }
      const info = COURT_UPGRADES[upgrade]
      return {
        ...state,
        escola: { ...state.escola, quadra: { ...state.escola.quadra, ...info.efeito }, moral: Math.min(100, state.escola.moral + (info.bonusMoral ?? 0)) },
        economia: { saldo: state.economia.saldo - custo, transacoes: [...state.economia.transacoes, { id: crypto.randomUUID(), semana: state.calendario.semanaAtual, tipo: 'despesa' as const, categoria: 'reforma' as const, valor: custo, descricao: info.nome }] },
        notificacoes: addNotif(state, 'sucesso', `${info.nome} concluída! Moral +${info.bonusMoral}`)
      }
    }

    case 'HIRE_SPONSOR': {
      const sponsor = state.patrocinadores.find((s) => s.id === action.payload.sponsorId)
      if (!sponsor || sponsor.semanasRestantes > 0) return state
      if (state.escola.reputacao < sponsor.requisitosReputacao) return { ...state, notificacoes: addNotif(state, 'erro', `Reputação insuficiente para ${sponsor.nome}.`) }
      return {
        ...state,
        patrocinadores: state.patrocinadores.map((s) => s.id === action.payload.sponsorId ? { ...s, semanasRestantes: s.duracaoTotal } : s),
        notificacoes: addNotif(state, 'sucesso', `${sponsor.nome} assinou contrato! +C$${sponsor.pagamentoSemanal}/semana`)
      }
    }

    case 'UPDATE_KIT': {
      return { ...state, kit: { ...state.kit, ...action.payload } }
    }

    case 'UPDATE_KIT2': {
      return { ...state, kit2: { ...state.kit2, ...action.payload } }
    }

    case 'LOAD_SAVE': {
      return action.payload.state
    }

    case 'DISMISS_NOTIFICATION': {
      return { ...state, notificacoes: (state.notificacoes ?? []).filter((n) => n.id !== action.payload.id) }
    }

    default:
      return state
  }
}
