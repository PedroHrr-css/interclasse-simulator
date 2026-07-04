import { useState } from 'react'
import { useGame } from '@/store/GameContext'
import type { Player } from '@/types'
import type { Position } from '@/types/player'
import './Squad.css'

const POSITION_LABELS: Record<Position, string> = {
  goleiro: '🧤 Goleiro',
  fixo: '🛡️ Fixo',
  ala: '⚡ Ala',
  pivo: '🎯 Pivô'
}

function AttrBar({ label, value }: { label: string; value: number }) {
  const cls = value >= 70 ? 'high' : value >= 40 ? 'mid' : 'low'
  return (
    <div className="attr-bar">
      <span className="attr-bar-label">{label}</span>
      <div className="attr-bar-track">
        <div
          className={`attr-bar-fill ${cls}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="attr-bar-value">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: Player['status'] }) {
  const map = {
    disponivel: <span className="badge badge-green">DISPONÍVEL</span>,
    suspenso: <span className="badge badge-red">SUSPENSO</span>,
    em_prova: <span className="badge badge-yellow">EM PROVA</span>,
    lesionado: <span className="badge badge-gray">LESIONADO</span>
  }
  return map[status]
}

function PlayerCard({ player }: { player: Player }) {
  const [expanded, setExpanded] = useState(false)
  const { dispatch } = useGame()
  const media = (
    (player.atributos.velocidade + player.atributos.finalizacao + player.atributos.passe + player.atributos.drible + player.atributos.resistencia) / 5
  ).toFixed(0)

  return (
    <div className={`player-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
      <div className="player-card__header">
        <div className="player-card__left">
          <div className="player-card__name">
            {player.nome}
            {player.apelido && <span className="player-card__apelido"> "{player.apelido}"</span>}
          </div>
          <div className="player-card__meta">
            {POSITION_LABELS[player.posicao]} · {player.serie} · {player.idade} anos
          </div>
        </div>
        <div className="player-card__right">
          <div className="player-card__media">{media}</div>
          <StatusBadge status={player.status} />
        </div>
      </div>

      {expanded && (
        <div className="player-card__detail">
          <div className="player-card__attrs">
            <AttrBar label="Velocidade" value={player.atributos.velocidade} />
            <AttrBar label="Finalização" value={player.atributos.finalizacao} />
            <AttrBar label="Passe" value={player.atributos.passe} />
            <AttrBar label="Drible" value={player.atributos.drible} />
            <AttrBar label="Resistência" value={player.atributos.resistencia} />
            {player.posicao === 'goleiro' && <AttrBar label="Reflexo" value={player.atributos.reflexo} />}
          </div>
          <div className="player-card__school">
            <div className="flex justify-between">
              <span className="text-gray text-sm">Nota Escolar</span>
              <span className={`text-pixel text-sm ${player.atributos.notaEscolar < 7 ? 'text-accent' : 'text-green'}`}>
                {player.atributos.notaEscolar.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-gray text-sm">Salário</span>
              <span className="text-yellow text-sm">C$ {player.salarioCantina}/sem</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-gray text-sm">Moral</span>
              <span className="text-sm">{player.moral}%</span>
            </div>
            {player.foiContratado && (
              <button
                className="btn btn-danger btn-sm mt-8 w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch({ type: 'RELEASE_PLAYER', payload: { playerId: player.id } })
                }}
              >
                DISPENSAR
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function SquadScreen() {
  const { state } = useGame()
  const [filtro, setFiltro] = useState<Position | 'todos'>('todos')

  const jogadores = state.jogadores.filter(
    (j) => filtro === 'todos' || j.posicao === filtro
  )

  const disponíveis = state.jogadores.filter((j) => j.status === 'disponivel').length
  const contratados = state.jogadores.filter((j) => j.foiContratado).length

  return (
    <div>
      <div className="screen-header">
        <h1 className="screen-title">ELENCO</h1>
        <div className="flex gap-8">
          <span className="badge badge-blue">{state.jogadores.length} jogadores</span>
          <span className="badge badge-green">{disponíveis} disponíveis</span>
          <span className="badge badge-gray">{contratados} contratados</span>
        </div>
      </div>

      <div className="filter-bar">
        {(['todos', 'goleiro', 'fixo', 'ala', 'pivo'] as const).map((pos) => (
          <button
            key={pos}
            className={`filter-btn ${filtro === pos ? 'active' : ''}`}
            onClick={() => setFiltro(pos)}
          >
            {pos === 'todos' ? 'TODOS' : POSITION_LABELS[pos as Position].toUpperCase()}
          </button>
        ))}
      </div>

      <div className="squad-list">
        {jogadores.map((j) => (
          <PlayerCard key={j.id} player={j} />
        ))}
        {jogadores.length === 0 && (
          <div className="empty-state">Nenhum jogador nesta posição.</div>
        )}
      </div>
    </div>
  )
}
