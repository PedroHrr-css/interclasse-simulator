import { useGame } from '@/store/GameContext'
import { COURT_UPGRADES } from '@/data/initialConfig'
import type { CourtUpgradeType } from '@/store/actions'
import type { CourtCondition } from '@/types/school'
import './School.css'

const CONDITION_LABELS: Record<CourtCondition, { label: string; cls: string }> = {
  excelente: { label: 'EXCELENTE', cls: 'badge-green' },
  boa: { label: 'BOA', cls: 'badge-green' },
  regular: { label: 'REGULAR', cls: 'badge-yellow' },
  danificada: { label: 'DANIFICADA', cls: 'badge-red' },
  pessima: { label: 'PÉSSIMA', cls: 'badge-red' }
}

const PAINT_LABELS = ['Sem pintura', 'Básica', 'Completa', 'Premium']

export function SchoolScreen() {
  const { state, dispatch } = useGame()
  const { escola, economia } = state
  const quadra = escola.quadra

  const handleUpgrade = (tipo: CourtUpgradeType) => {
    const info = COURT_UPGRADES[tipo]
    dispatch({ type: 'UPGRADE_COURT', payload: { upgrade: tipo, custo: info.custo } })
  }

  const cond = CONDITION_LABELS[quadra.condicao]

  return (
    <div>
      <div className="screen-header">
        <h1 className="screen-title">ESCOLA — {escola.nome}</h1>
        <span className="cantina-coins">{economia.saldo}</span>
      </div>

      <div className="school-grid">
        {/* Estado da quadra */}
        <div className="card">
          <div className="card-title">ESTADO DA QUADRA</div>
          <div className="school-stat">
            <span>Condição</span>
            <span className={`badge ${cond.cls}`}>{cond.label}</span>
          </div>
          <div className="school-stat">
            <span>Pintura</span>
            <span className="badge badge-blue">{PAINT_LABELS[quadra.nivelPintura]}</span>
          </div>
          <div className="school-stat">
            <span>Iluminação</span>
            <span className={`badge ${quadra.temIluminacao ? 'badge-green' : 'badge-gray'}`}>
              {quadra.temIluminacao ? 'SIM' : 'NÃO'}
            </span>
          </div>
          <div className="school-stat">
            <span>Vestiário</span>
            <span className={`badge ${quadra.temVestiario ? 'badge-green' : 'badge-gray'}`}>
              {quadra.temVestiario ? 'SIM' : 'NÃO'}
            </span>
          </div>
          <div className="school-stat">
            <span>Tribuna</span>
            <span className={`badge ${quadra.temTribuna ? 'badge-green' : 'badge-gray'}`}>
              {quadra.temTribuna ? 'SIM' : 'NÃO'}
            </span>
          </div>

          <div className="school-moral mt-8">
            <div className="flex justify-between mb-4">
              <span className="text-pixel text-xs">MORAL DO TIME</span>
              <span className="text-pixel text-xs text-yellow">{escola.moral}%</span>
            </div>
            <div className="school-moral-bar">
              <div className="school-moral-fill" style={{ width: `${escola.moral}%` }} />
            </div>
          </div>

          <div className="school-moral mt-8">
            <div className="flex justify-between mb-4">
              <span className="text-pixel text-xs">REPUTAÇÃO</span>
              <span className="text-pixel text-xs">{escola.reputacao}/100</span>
            </div>
            <div className="school-moral-bar">
              <div className="school-moral-fill" style={{ width: `${escola.reputacao}%`, background: 'var(--blue)' }} />
            </div>
          </div>
        </div>

        {/* Melhorias disponíveis */}
        <div className="card">
          <div className="card-title">MELHORIAS DISPONÍVEIS</div>
          {(Object.keys(COURT_UPGRADES) as CourtUpgradeType[]).map((tipo) => {
            const info = COURT_UPGRADES[tipo]
            const podeComprar = economia.saldo >= info.custo
            return (
              <div key={tipo} className="upgrade-item">
                <div className="upgrade-item__info">
                  <div className="upgrade-item__name">{info.nome}</div>
                  <div className="upgrade-item__details">
                    <span className="text-yellow">C$ {info.custo}</span>
                    <span className="text-green text-xs">+{info.bonusMoral} moral</span>
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${podeComprar ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUpgrade(tipo)}
                  disabled={!podeComprar}
                >
                  COMPRAR
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card mt-12">
        <div className="card-title">INFORMAÇÕES DA ESCOLA</div>
        <div className="school-info-grid">
          <div>
            <div className="text-gray text-xs">TIPO</div>
            <div className="mt-4">{escola.tipo === 'publica' ? '🏫 Escola Pública' : '🏛️ Escola Particular'}</div>
          </div>
          <div>
            <div className="text-gray text-xs">CIDADE</div>
            <div className="mt-4">{escola.cidade} — {escola.estado}</div>
          </div>
          <div>
            <div className="text-gray text-xs">VERBA MENSAL</div>
            <div className="mt-4 text-yellow">C$ {escola.verbaMensal}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
