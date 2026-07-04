import { useGame } from '@/store/GameContext'
import { KitCanvas } from '../Kit/KitCanvas'
import { buildMatchesForCompetition } from '@/engine/competitionEngine'
import type { Competition } from '@/types'
import type { HubTab } from './Hub'

interface Props {
  activeTab: HubTab
  onTabChange: (tab: HubTab) => void
}

export function Sidebar({ onTabChange }: Props) {
  const { state, dispatch } = useGame()
  const { escola, calendario, economia, competicoes, kit, partidas } = state

  const proximaPartida = partidas.find((m) => m.status === 'agendada')
  const competicaoAtiva = competicoes.find((c) => c.status !== 'finalizada')

  const eventoSemana = calendario.eventos.find((e) => e.semana === calendario.semanaAtual)

  const handleAdvanceWeek = () => {
    // Iniciar campeonato na semana 3 se ainda planejado
    const deveCriarPartidas = competicoes.some(
      (c) => c.status === 'planejada' && calendario.semanaAtual >= 3
    )

    if (deveCriarPartidas) {
      competicoes.forEach((c) => {
        if (c.status === 'planejada') {
          const novasPartidas = buildMatchesForCompetition(c, escola.id, calendario.semanaAtual + 1)
          // Dispatch especial para iniciar campeonato
          dispatch({
            type: 'LOAD_SAVE',
            payload: {
              state: {
                ...state,
                partidas: [...partidas, ...novasPartidas],
                competicoes: state.competicoes.map((comp) =>
                  comp.id === c.id ? { ...comp, status: 'em_andamento' } : comp
                )
              }
            }
          })
        }
      })
    }

    dispatch({ type: 'ADVANCE_WEEK' })
  }

  return (
    <div className="sidebar">
      <div className="sidebar__school">
        <KitCanvas kit={kit} size={48} />
        <div>
          <div className="sidebar__school-name">{escola.nome}</div>
          <div className="sidebar__school-type">
            {escola.tipo === 'publica' ? '🏫 Pública' : '🏛️ Particular'}
          </div>
        </div>
      </div>

      <div className="sidebar__stat">
        <span className="sidebar__stat-label">SEMANA</span>
        <span className="sidebar__stat-value">{calendario.semanaAtual}/40</span>
      </div>

      <div className="sidebar__stat">
        <span className="sidebar__stat-label">BIMESTRE</span>
        <span className="sidebar__stat-value">{calendario.bimestreAtual}º</span>
      </div>

      <div className="sidebar__stat">
        <span className="sidebar__stat-label">SALDO</span>
        <span className="sidebar__stat-value text-yellow">C$ {economia.saldo}</span>
      </div>

      <div className="sidebar__stat">
        <span className="sidebar__stat-label">MORAL</span>
        <div className="sidebar__moral-bar">
          <div
            className="sidebar__moral-fill"
            style={{ width: `${escola.moral}%` }}
          />
        </div>
      </div>

      <div className="sidebar__stat">
        <span className="sidebar__stat-label">REPUTAÇÃO</span>
        <span className="sidebar__stat-value">{escola.reputacao}/100</span>
      </div>

      {proximaPartida && (
        <div className="sidebar__match">
          <div className="sidebar__match-label">PRÓXIMA PARTIDA</div>
          <div className="sidebar__match-info">
            Semana {proximaPartida.semana}
          </div>
          <div className="sidebar__match-teams">
            vs {proximaPartida.awaySchoolNome}
          </div>
          <button
            className="btn btn-primary btn-sm w-full"
            onClick={() => onTabChange('campeonato')}
          >
            VER PARTIDA
          </button>
        </div>
      )}

      {eventoSemana && (
        <div className="sidebar__event">
          <div className="sidebar__event-label">EVENTO DESTA SEMANA</div>
          <div className="sidebar__event-desc">{eventoSemana.descricao}</div>
        </div>
      )}

      <div className="sidebar__advance">
        <button className="btn btn-primary w-full" onClick={handleAdvanceWeek}>
          ▶ AVANÇAR SEMANA
        </button>
      </div>

      {competicaoAtiva && (
        <div className="sidebar__comp">
          <div className="sidebar__comp-label">CAMPEONATO ATIVO</div>
          <div className="sidebar__comp-name">{competicaoAtiva.nome}</div>
          <div className="sidebar__comp-round">
            Rodada {competicaoAtiva.rodadaAtual}/{competicaoAtiva.totalRodadas}
          </div>
        </div>
      )}
    </div>
  )
}
