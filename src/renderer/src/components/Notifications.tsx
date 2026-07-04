import { useGame } from '@/store/GameContext'

export function Notifications() {
  const { state, dispatch } = useGame()
  const notificacoes = state.notificacoes ?? []

  if (notificacoes.length === 0) return null

  return (
    <div className="notifications">
      {notificacoes.slice(-4).map((n) => (
        <div
          key={n.id}
          className={`notification ${n.tipo}`}
          onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: { id: n.id } })}
        >
          {n.mensagem}
          <div style={{ fontSize: 7, marginTop: 4, opacity: 0.6 }}>[clique para fechar]</div>
        </div>
      ))}
    </div>
  )
}
