import { useState, useEffect, useRef } from 'react'
import { useGame } from '@/store/GameContext'
import type { Match } from '@/types/match'
import type { Player } from '@/types'
import type { Position } from '@/types/player'
import type { Formacao, MatchLineup } from '@/types/match'
import './Match.css'

interface Props {
  match: Match
  onClose: () => void
}

const POSITION_LABELS: Record<Position, string> = {
  goleiro: '🧤',
  fixo: '🛡️',
  ala: '⚡',
  pivo: '🎯'
}

function PreMatch({ match, onSimulate }: { match: Match; onSimulate: (lineup: MatchLineup) => void }) {
  const { state } = useGame()
  const [goleiro, setGoleiro] = useState<string>('')
  const [titulares, setTitulares] = useState<string[]>([])
  const [formacao, setFormacao] = useState<Formacao>('2-2')

  const disponíveis = state.jogadores.filter((j) => j.status === 'disponivel')
  const goleiros = disponíveis.filter((j) => j.posicao === 'goleiro')
  const outrosSelecionados = disponíveis.filter((j) => j.posicao !== 'goleiro')

  const toggleTitular = (id: string) => {
    if (titulares.includes(id)) {
      setTitulares(titulares.filter((t) => t !== id))
    } else if (titulares.length < 4) {
      setTitulares([...titulares, id])
    }
  }

  const canSimulate = goleiro && titulares.length === 4

  return (
    <div className="match-screen">
      <div className="match-screen__header">
        <h2 className="screen-title">PRÉ-JOGO</h2>
        <div className="match-scoreboard-header">
          <span>{match.homeSchoolNome}</span>
          <span className="text-accent text-pixel">VS</span>
          <span>{match.awaySchoolNome}</span>
        </div>
      </div>

      <div className="prematch-grid">
        <div className="card">
          <div className="card-title">GOLEIRO (escolha 1)</div>
          {goleiros.map((j) => (
            <div
              key={j.id}
              className={`prematch-player ${goleiro === j.id ? 'selected' : ''}`}
              onClick={() => setGoleiro(j.id)}
            >
              🧤 {j.nome} <span className="text-gray text-xs">({j.atributos.reflexo} reflexo)</span>
            </div>
          ))}
          {goleiros.length === 0 && <div className="text-gray text-sm">Nenhum goleiro disponível!</div>}
        </div>

        <div className="card">
          <div className="card-title">TITULARES — {titulares.length}/4 selecionados</div>
          <div className="mb-8">
            <label className="new-game__label">FORMAÇÃO</label>
            <select
              className="new-game__select"
              value={formacao}
              onChange={(e) => setFormacao(e.target.value as Formacao)}
              style={{ marginTop: 4 }}
            >
              <option value="2-2">2-2 (2 fixos + 2 alas)</option>
              <option value="3-1">3-1 (3 fixos + 1 pivô)</option>
              <option value="1-2-1">1-2-1 (1 fixo + 2 alas + 1 pivô)</option>
            </select>
          </div>
          {outrosSelecionados.map((j) => (
            <div
              key={j.id}
              className={`prematch-player ${titulares.includes(j.id) ? 'selected' : ''}`}
              onClick={() => toggleTitular(j.id)}
            >
              {POSITION_LABELS[j.posicao]} {j.nome}
              <span className="text-gray text-xs"> · {j.serie}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="match-actions">
        <button
          className="btn btn-primary"
          disabled={!canSimulate}
          onClick={() => onSimulate({ goleiro, titulares, formacao })}
        >
          ⚽ INICIAR PARTIDA
        </button>
      </div>
    </div>
  )
}

function LiveMatch({ match }: { match: Match; onEnd: () => void }) {
  const [visibleEvents, setVisibleEvents] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)

  const events = match.eventos

  useEffect(() => {
    if (visibleEvents >= events.length) return
    const timer = setTimeout(() => {
      setVisibleEvents((v) => v + 1)
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [visibleEvents, events.length])

  const current = events.slice(0, visibleEvents)
  const finished = visibleEvents >= events.length

  const gols = current.filter((e) => e.tipo === 'gol')
  const golsHome = gols.filter((e) => e.time === 'home').length
  const golsAway = gols.filter((e) => e.time === 'away').length

  return (
    <div className="match-screen">
      <div className="match-screen__header">
        <div className="match-scoreboard">
          <div className="match-scoreboard__team">{match.homeSchoolNome}</div>
          <div className="match-scoreboard__score">
            <span className={golsHome > golsAway ? 'text-green' : ''}>{golsHome}</span>
            <span className="text-gray"> x </span>
            <span className={golsAway > golsHome ? 'text-green' : ''}>{golsAway}</span>
          </div>
          <div className="match-scoreboard__team">{match.awaySchoolNome}</div>
        </div>
      </div>

      <div className="match-feed" ref={feedRef}>
        {current.map((event, i) => (
          <div
            key={i}
            className={`match-event match-event--${event.tipo} ${event.time === 'home' ? 'home' : 'away'}`}
          >
            <span className="match-event__min">{event.minuto}'</span>
            <span className="match-event__desc">{event.descricao}</span>
            {event.tipo === 'gol' && <span className="match-event__icon">⚽</span>}
            {event.tipo === 'cartao_amarelo' && <span className="match-event__icon">🟨</span>}
            {event.tipo === 'cartao_vermelho' && <span className="match-event__icon">🟥</span>}
          </div>
        ))}
        {!finished && (
          <div className="match-event match-event--loading">
            <span className="loading-dots">...</span>
          </div>
        )}
      </div>

      {finished && (
        <div className="match-result">
          <div className="match-result__title">
            {golsHome > golsAway ? '🏆 VITÓRIA!' : golsHome === golsAway ? '🤝 EMPATE!' : '😢 DERROTA!'}
          </div>
          <div className="match-result__score">
            {golsHome} x {golsAway}
          </div>
          <div className="match-result__stats">
            <div>Chutes: {match.estatisticas.chutes.home} x {match.estatisticas.chutes.away}</div>
            <div>Faltas: {match.estatisticas.faltas.home} x {match.estatisticas.faltas.away}</div>
            <div>Posse: {match.estatisticas.posseBola}% x {100 - match.estatisticas.posseBola}%</div>
          </div>
        </div>
      )}
    </div>
  )
}

export function MatchScreen({ match, onClose }: Props) {
  const { dispatch, state } = useGame()
  const [fase, setFase] = useState<'pre' | 'live' | 'end'>('pre')
  const [simulatedMatch, setSimulatedMatch] = useState<Match>(match)

  const handleSimulate = (lineup: MatchLineup) => {
    dispatch({ type: 'SIMULATE_MATCH', payload: { matchId: match.id, lineup } })
    // Após dispatch, pegar o match atualizado do estado
    setFase('live')
  }

  useEffect(() => {
    const updated = state.partidas.find((m) => m.id === match.id)
    if (updated && updated.status === 'finalizada') {
      setSimulatedMatch(updated)
    }
  }, [state.partidas, match.id])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <button className="btn btn-secondary btn-sm" onClick={onClose}>◀ VOLTAR</button>
        <span className="text-pixel text-xs text-gray">RODADA {match.rodada}</span>
      </div>

      {fase === 'pre' && (
        <PreMatch match={match} onSimulate={(lineup) => handleSimulate(lineup)} />
      )}
      {(fase === 'live' || fase === 'end') && (
        <LiveMatch
          match={simulatedMatch.status === 'finalizada' ? simulatedMatch : match}
          onEnd={() => { setFase('end'); onClose() }}
        />
      )}
    </div>
  )
}
