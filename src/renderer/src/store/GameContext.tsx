import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import type { GameState } from '@/types'
import { gameReducer } from './gameReducer'
import type { GameAction } from './actions'

const kit2Default: import('@/types').KitConfig = {
  corPrimaria: '#1a1a1a',
  corSecundaria: '#ffffff',
  corNumero: '#ffffff',
  estilo: 'solido',
  simbolo: 'IC'
}

const initialState: GameState = {
  fase: 'menu',
  nomeProfesor: 'Professor',
  escola: {
    id: '',
    nome: '',
    tipo: 'publica',
    cidade: '',
    estado: '',
    quadra: {
      condicao: 'regular',
      temIluminacao: false,
      temVestiario: false,
      temTribuna: false,
      nivelPintura: 0
    },
    reputacao: 10,
    moral: 50,
    verbaMensal: 0
  },
  jogadores: [],
  goleiro: null,
  titulares: [],
  formacao: '2-2',
  competicoes: [],
  competicaoAtiva: null,
  calendario: {
    anoLetivo: 2025,
    semanaAtual: 1,
    bimestreAtual: 1,
    eventos: [],
    semanasDeProva: [9, 10, 19, 20, 29, 30, 39, 40]
  },
  economia: { saldo: 0, transacoes: [] },
  patrocinadores: [],
  partidas: [],
  kit: {
    corPrimaria: '#1a73e8',
    corSecundaria: '#ffffff',
    corNumero: '#ffffff',
    estilo: 'solido',
    simbolo: 'IC'
  },
  kit2: kit2Default,
  notificacoes: []
}

const GameContext = createContext<{
  state: GameState
  dispatch: Dispatch<GameAction>
} | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame deve ser usado dentro de GameProvider')
  return ctx
}
