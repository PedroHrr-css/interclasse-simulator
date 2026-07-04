import { useState } from 'react'
import { useGame } from '@/store/GameContext'
import { MatchScreen } from '../Match/MatchScreen'
import type { Match } from '@/types/match'
import './Competition.css'

export function CompetitionScreen() {
  const { state } = useGame()
  const [matchAtiva, setMatchAtiva] = useState<Match | null>(null)

  const competicao = state.competicoes.find((c) => c.id === state.competicaoAtiva) ?? state.competicoes[0]

  if (!competicao) {
    return (
      <div>
        <div className="screen-header">
          <h1 className="screen-title">CAMPEONATO</h1>
        </div>
        <div className="empty-state">Nenhum campeonato ativo. Avance semanas para iniciar!</div>
      </div>
    )
  }

  if (matchAtiva) {
    return <MatchScreen match={matchAtiva} onClose={() => setMatchAtiva(null)} />
  }

  const tabelaOrdenada = [...competicao.tabela].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos
    const sgA = a.golsPro - a.golsContra
    const sgB = b.golsPro - b.golsContra
    return sgB - sgA
  })

  const partidasDoJogador = state.partidas.filter((m) => m.competicaoId === competicao.id)
  const proximaPartida = partidasDoJogador.find((m) => m.status === 'agendada')
  const partidasFinalizadas = partidasDoJogador.filter((m) => m.status === 'finalizada')

  return (
    <div>
      <div className="screen-header">
        <h1 className="screen-title">{competicao.nome}</h1>
        <span className={`badge ${competicao.status === 'em_andamento' ? 'badge-green' : competicao.status === 'finalizada' ? 'badge-gray' : 'badge-yellow'}`}>
          {competicao.status === 'em_andamento' ? 'EM ANDAMENTO' : competicao.status === 'finalizada' ? 'FINALIZADO' : 'PLANEJADO'}
        </span>
      </div>

      <div className="comp-grid">
        {/* Tabela de classificação */}
        <div className="card">
          <div className="card-title">CLASSIFICAÇÃO</div>
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>P</th>
                <th>J</th>
                <th>V</th>
                <th>E</th>
                <th>D</th>
                <th>SG</th>
              </tr>
            </thead>
            <tbody>
              {tabelaOrdenada.map((entry, i) => (
                <tr key={entry.schoolId} className={entry.schoolId === state.escola.id ? 'my-team' : ''}>
                  <td>{i + 1}</td>
                  <td className="team-name">{entry.schoolNome}</td>
                  <td className="pts">{entry.pontos}</td>
                  <td>{entry.jogos}</td>
                  <td>{entry.vitorias}</td>
                  <td>{entry.empates}</td>
                  <td>{entry.derrotas}</td>
                  <td>{entry.golsPro - entry.golsContra > 0 ? '+' : ''}{entry.golsPro - entry.golsContra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Partidas */}
        <div>
          {proximaPartida && (
            <div className="card mb-8">
              <div className="card-title">PRÓXIMA PARTIDA — Semana {proximaPartida.semana}</div>
              <div className="match-preview">
                <div className="match-preview__team">{proximaPartida.homeSchoolNome}</div>
                <div className="match-preview__vs">VS</div>
                <div className="match-preview__team">{proximaPartida.awaySchoolNome}</div>
              </div>
              <button
                className="btn btn-primary w-full mt-8"
                onClick={() => setMatchAtiva(proximaPartida)}
              >
                ▶ JOGAR AGORA
              </button>
            </div>
          )}

          {partidasFinalizadas.length > 0 && (
            <div className="card">
              <div className="card-title">RESULTADOS</div>
              <div className="results-list">
                {partidasFinalizadas.map((m) => (
                  <div key={m.id} className="result-item">
                    <span className="result-item__team">{m.homeSchoolNome}</span>
                    <span className={`result-item__score ${
                      m.placarHome > m.placarAway ? 'win' :
                      m.placarHome < m.placarAway ? 'loss' : 'draw'
                    }`}>
                      {m.placarHome} x {m.placarAway}
                    </span>
                    <span className="result-item__team">{m.awaySchoolNome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
