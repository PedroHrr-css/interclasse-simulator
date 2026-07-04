import { useState } from 'react'
import { useGame } from '@/store/GameContext'
import type { Player, Formacao } from '@/types'
import './LineupScreen.css'

type SlotIndex = 0 | 1 | 2 | 3 | 4

interface SlotPos {
  x: number // % of court width
  y: number // % of court height
  label: string
}

const FORMATIONS: Record<Formacao, SlotPos[]> = {
  '2-2': [
    { x: 50, y: 86, label: 'GL' },
    { x: 28, y: 65, label: 'FX' },
    { x: 72, y: 65, label: 'FX' },
    { x: 28, y: 35, label: 'AL' },
    { x: 72, y: 35, label: 'AL' },
  ],
  '3-1': [
    { x: 50, y: 86, label: 'GL' },
    { x: 20, y: 65, label: 'FX' },
    { x: 50, y: 65, label: 'FX' },
    { x: 80, y: 65, label: 'FX' },
    { x: 50, y: 33, label: 'PV' },
  ],
  '1-2-1': [
    { x: 50, y: 86, label: 'GL' },
    { x: 50, y: 68, label: 'FX' },
    { x: 22, y: 50, label: 'AL' },
    { x: 78, y: 50, label: 'AL' },
    { x: 50, y: 32, label: 'PV' },
  ],
}

function FutsalCourtSVG({
  formacao,
  slots,
  selected,
  onSlotClick,
  kit,
}: {
  formacao: Formacao
  slots: (Player | null)[]
  selected: SlotIndex | null
  onSlotClick: (i: SlotIndex) => void
  kit: { corPrimaria: string; corSecundaria: string }
}) {
  const positions = FORMATIONS[formacao]
  const W = 300
  const H = 500

  return (
    <svg
      className="court-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Field */}
      <rect x="0" y="0" width={W} height={H} fill="#14401a" />
      <rect x="8" y="8" width={W - 16} height={H - 16} fill="#1f6b2a" />

      {/* Outer border */}
      <rect x="8" y="8" width={W - 16} height={H - 16} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />

      {/* Center line */}
      <line x1="8" y1={H / 2} x2={W - 8} y2={H / 2} stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />

      {/* Center circle */}
      <circle cx={W / 2} cy={H / 2} r="45" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <circle cx={W / 2} cy={H / 2} r="3" fill="rgba(255,255,255,0.9)" />

      {/* Penalty arcs - top (opponent) */}
      <path
        d={`M ${W / 2 - 55} 8 A 70 70 0 0 1 ${W / 2 + 55} 8`}
        fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"
      />
      {/* Top goal area box */}
      <rect x={W / 2 - 48} y="8" width="96" height="52" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Top goal */}
      <rect x={W / 2 - 32} y="3" width="64" height="12" fill="#0a1a0d" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Top penalty spot */}
      <circle cx={W / 2} cy="85" r="2.5" fill="rgba(255,255,255,0.9)" />

      {/* Penalty arcs - bottom (own) */}
      <path
        d={`M ${W / 2 - 55} ${H - 8} A 70 70 0 0 0 ${W / 2 + 55} ${H - 8}`}
        fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"
      />
      {/* Bottom goal area box */}
      <rect x={W / 2 - 48} y={H - 60} width="96" height="52" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Bottom goal */}
      <rect x={W / 2 - 32} y={H - 15} width="64" height="12" fill="#0a1a0d" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Bottom penalty spot */}
      <circle cx={W / 2} cy={H - 85} r="2.5" fill="rgba(255,255,255,0.9)" />

      {/* Corner marks */}
      {[[8, 8], [W - 8, 8], [8, H - 8], [W - 8, H - 8]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      ))}

      {/* Player slots */}
      {positions.map((pos, i) => {
        const x = (pos.x / 100) * W
        const y = (pos.y / 100) * H
        const player = slots[i]
        const isSelected = selected === i
        const isGk = i === 0

        const fillColor = player
          ? isGk ? '#1a1a1a' : kit.corPrimaria
          : 'rgba(0,0,0,0.5)'
        const strokeColor = isSelected ? '#f5a623' : player ? kit.corSecundaria : 'rgba(255,255,255,0.5)'
        const strokeW = isSelected ? 3 : 2

        const media = player
          ? Math.round((player.atributos.velocidade + player.atributos.finalizacao + player.atributos.passe + player.atributos.drible + player.atributos.resistencia) / 5)
          : null

        return (
          <g
            key={i}
            transform={`translate(${x}, ${y})`}
            onClick={() => onSlotClick(i as SlotIndex)}
            className="court-slot"
          >
            {/* Glow when selected */}
            {isSelected && (
              <circle r="28" fill="rgba(245,166,35,0.25)" />
            )}

            {/* Jersey circle */}
            <circle r="22" fill={fillColor} stroke={strokeColor} strokeWidth={strokeW} />

            {/* GK indicator */}
            {isGk && player && (
              <rect x="-22" y="-22" width="44" height="44" rx="22" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="4 3" />
            )}

            {/* Empty slot indicator */}
            {!player && (
              <>
                <line x1="-8" y1="0" x2="8" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                <text textAnchor="middle" y="32" fontSize="9" fill="rgba(255,255,255,0.6)" fontFamily="'Silkscreen', monospace">
                  {pos.label}
                </text>
              </>
            )}

            {/* Player name */}
            {player && (
              <>
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  y="0"
                  fontSize="8"
                  fill="white"
                  fontFamily="'Press Start 2P', monospace"
                  style={{ imageRendering: 'pixelated' }}
                >
                  {(player.apelido || player.nome.split(' ')[0]).slice(0, 6).toUpperCase()}
                </text>
                {/* Rating badge */}
                <circle cx="16" cy="-16" r="10" fill={media! >= 70 ? '#4caf50' : media! >= 40 ? '#f5a623' : '#e94560'} stroke="#000" strokeWidth="1" />
                <text x="16" y="-16" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#000" fontFamily="'Press Start 2P', monospace" fontWeight="bold">
                  {media}
                </text>
                {/* Position label below */}
                <text textAnchor="middle" y="32" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="'Silkscreen', monospace">
                  {pos.label}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function PlayerRow({
  player,
  inLineup,
  isSelected,
  onClick,
}: {
  player: Player
  inLineup: boolean
  isSelected: boolean
  onClick: () => void
}) {
  const media = Math.round(
    (player.atributos.velocidade + player.atributos.finalizacao + player.atributos.passe + player.atributos.drible + player.atributos.resistencia) / 5
  )
  const posLabel: Record<string, string> = { goleiro: 'GL', fixo: 'FX', ala: 'AL', pivo: 'PV' }
  const isUnavailable = player.status !== 'disponivel'

  return (
    <div
      className={`lineup-player-row ${isSelected ? 'selected' : ''} ${inLineup ? 'in-lineup' : ''} ${isUnavailable ? 'unavailable' : ''}`}
      onClick={!isUnavailable ? onClick : undefined}
    >
      <span className="lineup-player-pos">{posLabel[player.posicao]}</span>
      <span className="lineup-player-name">
        {player.apelido || player.nome.split(' ')[0]}
        {player.apelido && <span className="lineup-player-surname"> {player.nome.split(' ').slice(-1)[0]}</span>}
      </span>
      <span className={`lineup-player-rating ${media >= 70 ? 'high' : media >= 40 ? 'mid' : 'low'}`}>{media}</span>
      {isUnavailable && <span className="lineup-player-status">{player.status === 'suspenso' ? 'SUS' : 'IND'}</span>}
      {inLineup && !isUnavailable && <span className="lineup-player-check">✓</span>}
    </div>
  )
}

export function LineupScreen() {
  const { state, dispatch } = useGame()
  const { jogadores, goleiro, titulares, formacao, kit } = state

  const [localGoleiro, setLocalGoleiro] = useState<string | null>(goleiro)
  const [localTitulares, setLocalTitulares] = useState<string[]>(titulares)
  const [localFormacao, setLocalFormacao] = useState<Formacao>(formacao)
  const [selectedSlot, setSelectedSlot] = useState<SlotIndex | null>(null)
  const [saved, setSaved] = useState(false)

  // Build slot array: [goleiro, ...titulares x4]
  const slotIds = [localGoleiro, ...localTitulares.slice(0, 4)]
  while (slotIds.length < 5) slotIds.push(null)

  const slotPlayers = slotIds.map(id => id ? (jogadores.find(j => j.id === id) ?? null) : null)

  const lineupIds = slotIds.filter(Boolean) as string[]

  // Available players: contracted or from own school, available
  const availablePool = jogadores
    .filter(j => j.foiContratado || j.escolaOrigem === state.escola.id)
    .sort((a, b) => {
      const ma = (a.atributos.velocidade + a.atributos.finalizacao + a.atributos.passe + a.atributos.drible + a.atributos.resistencia) / 5
      const mb = (b.atributos.velocidade + b.atributos.finalizacao + b.atributos.passe + b.atributos.drible + b.atributos.resistencia) / 5
      return mb - ma
    })

  const handleSlotClick = (i: SlotIndex) => {
    setSelectedSlot(prev => prev === i ? null : i)
    setSaved(false)
  }

  const handlePlayerClick = (player: Player) => {
    if (selectedSlot === null) return
    const isGkSlot = selectedSlot === 0
    setSaved(false)

    if (isGkSlot) {
      // Remove from titulares if was there
      setLocalTitulares(prev => prev.filter(id => id !== player.id))
      setLocalGoleiro(prev => prev === player.id ? null : player.id)
    } else {
      const outfieldIdx = selectedSlot - 1
      // Remove from goleiro if was there
      if (localGoleiro === player.id) setLocalGoleiro(null)

      const newTitulares = [...localTitulares]
      while (newTitulares.length < 4) newTitulares.push('')
      // Toggle: if already in this slot, remove
      if (newTitulares[outfieldIdx] === player.id) {
        newTitulares[outfieldIdx] = ''
      } else {
        // Remove from any other slot first
        const existingIdx = newTitulares.indexOf(player.id)
        if (existingIdx !== -1) newTitulares[existingIdx] = ''
        newTitulares[outfieldIdx] = player.id
      }
      setLocalTitulares(newTitulares.filter((_, i) => i < 4))
    }
    setSelectedSlot(null)
  }

  const isComplete = !!localGoleiro && localTitulares.filter(Boolean).length === 4

  const handleSave = () => {
    if (!isComplete || !localGoleiro) return
    dispatch({
      type: 'SET_LINEUP',
      payload: {
        goleiro: localGoleiro,
        titulares: localTitulares.filter(Boolean),
        formacao: localFormacao
      }
    })
    setSaved(true)
  }

  return (
    <div className="lineup-screen">
      {/* Left: court */}
      <div className="lineup-court-panel">
        <div className="lineup-court-header">
          <span className="screen-title" style={{ fontSize: 13 }}>ESCALAÇÃO</span>
          <div className="lineup-formation-selector">
            {(['2-2', '3-1', '1-2-1'] as Formacao[]).map(f => (
              <button
                key={f}
                className={`formation-btn ${localFormacao === f ? 'active' : ''}`}
                onClick={() => { setLocalFormacao(f); setSaved(false) }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="lineup-court-wrap">
          <FutsalCourtSVG
            formacao={localFormacao}
            slots={slotPlayers}
            selected={selectedSlot}
            onSlotClick={handleSlotClick}
            kit={kit}
          />
        </div>

        <div className="lineup-court-footer">
          {selectedSlot !== null ? (
            <div className="lineup-hint">
              Selecione um jogador na lista →
            </div>
          ) : (
            <div className="lineup-hint text-gray">
              Clique em um slot para escalar
            </div>
          )}
          <button
            className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
            onClick={handleSave}
            disabled={!isComplete}
          >
            {saved ? '✓ SALVO' : 'CONFIRMAR'}
          </button>
        </div>
      </div>

      {/* Right: player list */}
      <div className="lineup-player-panel">
        <div className="lineup-player-panel-header">
          <span className="lineup-panel-title">ELENCO</span>
          <span className="text-gray text-xs">{lineupIds.length}/5 escalados</span>
        </div>
        <div className="lineup-player-list">
          {availablePool.map(player => (
            <PlayerRow
              key={player.id}
              player={player}
              inLineup={lineupIds.includes(player.id)}
              isSelected={selectedSlot !== null && slotIds[selectedSlot] === player.id}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
          {availablePool.length === 0 && (
            <div className="empty-state" style={{ fontSize: 10 }}>
              Sem jogadores disponíveis.<br />Contrate no mercado!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
