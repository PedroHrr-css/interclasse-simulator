import { useState, useMemo } from 'react'
import { useGame } from '@/store/GameContext'
import { generateTransferPlayers } from '@/engine/playerGenerator'
import type { Player } from '@/types'
import type { Position } from '@/types/player'
import '../Squad/Squad.css'
import './Transfer.css'

const POSITION_LABELS: Record<Position, string> = {
  goleiro: '🧤 Goleiro',
  fixo: '🛡️ Fixo',
  ala: '⚡ Ala',
  pivo: '🎯 Pivô'
}

export function TransferMarket() {
  const { state, dispatch } = useGame()
  const [mercado] = useState<Player[]>(() =>
    generateTransferPlayers(state.escola.tipo === 'publica' ? 'particular' : 'publica', 12)
  )

  const media = (p: Player) =>
    Math.round(
      (p.atributos.velocidade + p.atributos.finalizacao + p.atributos.passe + p.atributos.drible + p.atributos.resistencia) / 5
    )

  const sorted = useMemo(() => [...mercado].sort((a, b) => media(b) - media(a)), [mercado])

  const handleSign = (player: Player) => {
    if (state.economia.saldo < 50) return
    dispatch({ type: 'SIGN_PLAYER', payload: { player } })
  }

  const jaContratado = (id: string) => state.jogadores.some((j) => j.id === id && j.foiContratado)

  return (
    <div>
      <div className="screen-header">
        <h1 className="screen-title">MERCADO DE ALUNOS</h1>
        <span className="cantina-coins">{state.economia.saldo}</span>
      </div>

      <div className="transfer-info card mb-8">
        <div className="text-sm text-gray">
          Contrate alunos talentosos de outras escolas por C$ 50 de taxa + salário semanal.
          Jogadores com nota baixa podem ser suspensos nas provas!
        </div>
      </div>

      <div className="squad-list">
        {sorted.map((player) => {
          const m = media(player)
          const contratado = jaContratado(player.id)
          return (
            <div key={player.id} className="transfer-card">
              <div className="transfer-card__info">
                <div className="player-card__name">{player.nome}</div>
                <div className="player-card__meta">
                  {POSITION_LABELS[player.posicao]} · {player.idade} anos · Nota: {player.atributos.notaEscolar.toFixed(1)}
                </div>
              </div>
              <div className="transfer-card__stats">
                <div className="transfer-card__media">{m}</div>
                <div className="text-yellow text-xs">C$ {player.salarioCantina}/sem</div>
              </div>
              <div className="transfer-card__action">
                {contratado ? (
                  <span className="badge badge-green">CONTRATADO</span>
                ) : (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleSign(player)}
                    disabled={state.economia.saldo < 50}
                  >
                    CONTRATAR
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
