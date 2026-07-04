import { useState } from 'react'
import { useGame } from '@/store/GameContext'
import type { GameState } from '@/types'
import './MainMenu.css'

const SAVE_KEY = 'interclasse_save'

function TrophySVG({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      {/* Base pedestal */}
      <rect x="10" y="56" width="44" height="7" fill="#8a5a00" rx="1"/>
      <rect x="10" y="56" width="44" height="2" fill="#c47a10"/>
      <rect x="14" y="52" width="36" height="5" fill="#f5a623"/>
      <rect x="14" y="52" width="36" height="2" fill="#ffd060"/>

      {/* Stem */}
      <rect x="25" y="40" width="14" height="13" fill="#c47a10"/>
      <rect x="27" y="40" width="8"  height="13" fill="#f5a623"/>
      <rect x="29" y="40" width="4"  height="13" fill="#ffd060"/>

      {/* Cup body */}
      <rect x="11" y="16" width="42" height="26" fill="#c47a10"/>
      <rect x="13" y="16" width="38" height="24" fill="#f5a623"/>
      {/* Highlight left stripe */}
      <rect x="15" y="17" width="10" height="22" fill="#ffd060"/>
      <rect x="17" y="17" width="4"  height="22" fill="#fff8d0"/>
      {/* Shadow right */}
      <rect x="41" y="17" width="8"  height="22" fill="#c47a10"/>

      {/* Left handle */}
      <rect x="5"  y="19" width="8"  height="18" fill="#f5a623"/>
      <rect x="7"  y="23" width="4"  height="10" fill="#0a0a1a"/>
      <rect x="5"  y="19" width="3"  height="18" fill="#ffd060"/>

      {/* Right handle */}
      <rect x="51" y="19" width="8"  height="18" fill="#f5a623"/>
      <rect x="53" y="23" width="4"  height="10" fill="#0a0a1a"/>
      <rect x="58" y="19" width="3"  height="18" fill="#c47a10"/>

      {/* Rim / lip */}
      <rect x="9"  y="12" width="46" height="6" fill="#c47a10"/>
      <rect x="11" y="12" width="42" height="5" fill="#ffd060"/>
      <rect x="11" y="12" width="42" height="2" fill="#fff8d0"/>

      {/* Star emblem on cup */}
      <text x="32" y="33" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#fff8d0">★</text>

      {/* Shine sparkles */}
      <rect x="19" y="18" width="2" height="2" fill="white"/>
      <rect x="22" y="20" width="2" height="2" fill="white"/>
      <rect x="19" y="22" width="2" height="2" fill="rgba(255,255,255,0.5)"/>

      {/* Laurel leaves hint on sides */}
      <rect x="5"  y="38" width="6" height="2" fill="#4caf50"/>
      <rect x="3"  y="36" width="4" height="2" fill="#2e7d32"/>
      <rect x="6"  y="40" width="5" height="2" fill="#2e7d32"/>
      <rect x="53" y="38" width="6" height="2" fill="#4caf50"/>
      <rect x="57" y="36" width="4" height="2" fill="#2e7d32"/>
      <rect x="53" y="40" width="5" height="2" fill="#2e7d32"/>
    </svg>
  )
}

export function MainMenu() {
  const { dispatch } = useGame()
  const [hasSave] = useState(() => !!localStorage.getItem(SAVE_KEY))

  const handleNewGame = () => {
    dispatch({ type: 'LOAD_SAVE', payload: { state: { fase: 'novo_jogo' } as GameState } })
  }

  const handleContinue = () => {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return
    try {
      const saved = JSON.parse(raw) as GameState
      dispatch({ type: 'LOAD_SAVE', payload: { state: saved } })
    } catch {
      alert('Erro ao carregar save!')
    }
  }

  return (
    <div className="main-menu">
      <div className="main-menu__scanlines" />
      <div className="main-menu__content">
        <div className="main-menu__logo">
          <div className="main-menu__logo-icon">
            <TrophySVG size={140} />
          </div>
          <h1 className="main-menu__title">INTERCLASSE</h1>
          <h2 className="main-menu__subtitle">SIMULATOR</h2>
          <div className="main-menu__version">v1.0 — 2025</div>
        </div>

        <div className="main-menu__buttons">
          <button className="btn btn-primary" onClick={handleNewGame}>
            ▶ Novo Jogo
          </button>
          <button className="btn btn-secondary" onClick={handleContinue} disabled={!hasSave}>
            ↺ Continuar
          </button>
        </div>

        <div className="main-menu__footer">
          <p>PROFESSOR DE ED. FÍSICA — LEVE SUA ESCOLA AO TOPO!</p>
          <p className="text-gray">↑↑↓↓←→←→ B A START</p>
        </div>
      </div>
    </div>
  )
}
