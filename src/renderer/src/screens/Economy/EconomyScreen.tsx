import { useGame } from '@/store/GameContext'
import './Economy.css'

export function EconomyScreen() {
  const { state, dispatch } = useGame()
  const { economia, patrocinadores, escola } = state

  const receitaSemanal = patrocinadores
    .filter((s) => s.semanasRestantes > 0)
    .reduce((acc, s) => acc + s.pagamentoSemanal, 0)

  const despesaSemanal = state.jogadores
    .filter((j) => j.foiContratado)
    .reduce((acc, j) => acc + j.salarioCantina, 0)

  const saldo = economia.saldo >= 0

  return (
    <div>
      <div className="screen-header">
        <h1 className="screen-title">FINANÇAS</h1>
        <span className={`cantina-coins text-lg ${!saldo ? 'text-accent' : ''}`}>
          {economia.saldo}
        </span>
      </div>

      <div className="economy-grid">
        <div className="card">
          <div className="card-title">BALANÇO SEMANAL</div>
          <div className="economy-row">
            <span>Receita semanal</span>
            <span className="text-green">+C$ {receitaSemanal}</span>
          </div>
          <div className="economy-row">
            <span>Salários</span>
            <span className="text-accent">-C$ {despesaSemanal}</span>
          </div>
          <div className="economy-row" style={{ borderTop: '2px solid var(--border-dim)', marginTop: 6, paddingTop: 6 }}>
            <span className="text-pixel" style={{ fontSize: 8 }}>SALDO SEMANAL</span>
            <span className={`text-pixel ${receitaSemanal - despesaSemanal >= 0 ? 'text-green' : 'text-accent'}`} style={{ fontSize: 10 }}>
              {receitaSemanal - despesaSemanal >= 0 ? '+' : ''}C$ {receitaSemanal - despesaSemanal}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">PATROCINADORES</div>
          {patrocinadores.map((s) => (
            <div key={s.id} className="sponsor-item">
              <div className="sponsor-item__info">
                <span className="sponsor-item__emoji">{s.logoEmoji}</span>
                <div>
                  <div className="sponsor-item__name">{s.nome}</div>
                  <div className="sponsor-item__pay text-green">+C$ {s.pagamentoSemanal}/sem</div>
                  {s.semanasRestantes > 0 && (
                    <div className="text-gray text-xs">{s.semanasRestantes} semanas restantes</div>
                  )}
                  {s.requisitosReputacao > escola.reputacao && s.semanasRestantes === 0 && (
                    <div className="text-accent text-xs">Req. Reputação: {s.requisitosReputacao}</div>
                  )}
                </div>
              </div>
              {s.semanasRestantes === 0 && escola.reputacao >= s.requisitosReputacao ? (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => dispatch({ type: 'HIRE_SPONSOR', payload: { sponsorId: s.id } })}
                >
                  CONTRATAR
                </button>
              ) : s.semanasRestantes > 0 ? (
                <span className="badge badge-green">ATIVO</span>
              ) : (
                <span className="badge badge-gray">BLOQUEADO</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de transações */}
      <div className="card mt-12">
        <div className="card-title">HISTÓRICO</div>
        <div className="transactions">
          {economia.transacoes.slice(-15).reverse().map((t) => (
            <div key={t.id} className="transaction-item">
              <span className="transaction-item__week text-gray">Sem {t.semana}</span>
              <span className="transaction-item__desc">{t.descricao}</span>
              <span className={`transaction-item__value ${t.tipo === 'receita' ? 'text-green' : 'text-accent'}`}>
                {t.tipo === 'receita' ? '+' : '-'}C$ {t.valor}
              </span>
            </div>
          ))}
          {economia.transacoes.length === 0 && (
            <div className="text-gray text-sm">Nenhuma transação ainda.</div>
          )}
        </div>
      </div>
    </div>
  )
}
