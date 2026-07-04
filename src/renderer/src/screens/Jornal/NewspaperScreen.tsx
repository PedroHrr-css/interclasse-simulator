import { useEffect, useState } from 'react'
import { useGame } from '@/store/GameContext'
import { MascoteSVG } from '@/screens/NewGame/NewGame'
import './NewspaperScreen.css'

type Phase = 'printing' | 'reading' | 'done'

export function NewspaperScreen() {
  const { state, dispatch } = useGame()
  const [phase, setPhase] = useState<Phase>('printing')
  const [visibleLines, setVisibleLines] = useState(0)

  const escola = state.escola
  const prof = state.nomeProfesor
  const prefixo = escola.tipo === 'publica' ? 'EMEF' : 'Colégio'
  const nomeCompleto = `${prefixo} ${escola.nome}`
  const cidade = `${escola.cidade} — ${escola.estado}`

  const headlines = [
    `NOVO TREINADOR ASSUME ${escola.nome.toUpperCase()}!`,
    `"${prof.toUpperCase()}" SERÁ O NOVO PROFESSOR DE ED. FÍSICA`,
    `TORCIDA ESPERA BONS RESULTADOS NO INTERCLASSE`,
  ]

  const body = [
    `Em declaração exclusiva ao jornal, o novo treinador ${prof} afirmou`,
    `estar "pronto para o desafio" e prometeu levar o time longe no`,
    `campeonato interclasse deste ano. A ${nomeCompleto}, localizada`,
    `em ${cidade}, aguarda com expectativa a chegada`,
    `do novo professor, que assume o comando do time imediatamente.`,
    ``,
    `"Vamos trabalhar muito e respeitar as notas dos alunos",`,
    `declarou ${prof} ao sair da diretoria.`,
  ]

  useEffect(() => {
    // Phase 1: printing sound simulation (brief delay)
    const t1 = setTimeout(() => setPhase('reading'), 800)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase !== 'reading') return
    if (visibleLines >= body.length) {
      setPhase('done')
      return
    }
    const t = setTimeout(() => setVisibleLines(v => v + 1), 120)
    return () => clearTimeout(t)
  }, [phase, visibleLines, body.length])

  const handleContinue = () => {
    dispatch({ type: 'LOAD_SAVE', payload: { state: { ...state, fase: 'jogando' } } })
  }

  return (
    <div className="newspaper" onClick={phase === 'done' ? handleContinue : undefined}>
      <div className="newspaper__scanlines" />

      {phase === 'printing' && (
        <div className="newspaper__printing">
          <div className="newspaper__print-bar" />
          <div className="text-pixel text-accent" style={{ fontSize: 8 }}>IMPRIMINDO...</div>
        </div>
      )}

      {(phase === 'reading' || phase === 'done') && (
        <div className="newspaper__paper">
          {/* Header */}
          <div className="newspaper__masthead">
            <div className="newspaper__masthead-left">
              <MascoteSVG size={48} />
            </div>
            <div className="newspaper__masthead-center">
              <div className="newspaper__title">O RECREIO</div>
              <div className="newspaper__subtitle">O JORNAL DA SUA ESCOLA</div>
              <div className="newspaper__date">ANO LETIVO 2025 — EDIÇÃO ESPECIAL</div>
            </div>
            <div className="newspaper__masthead-right">
              <div className="newspaper__price">C$ 0,50</div>
              <div className="newspaper__edition">Nº 001</div>
            </div>
          </div>

          <div className="newspaper__divider" />

          {/* Main headline */}
          <div className="newspaper__headline">{headlines[0]}</div>

          {/* Sub-headline */}
          <div className="newspaper__subheadline">{headlines[1]}</div>

          <div className="newspaper__divider" />

          {/* Body columns */}
          <div className="newspaper__columns">
            <div className="newspaper__col-main">
              {body.slice(0, visibleLines).map((line, i) => (
                <p key={i} className="newspaper__body-line">{line || ' '}</p>
              ))}
              {phase === 'reading' && <span className="newspaper__cursor">▌</span>}
            </div>
            <div className="newspaper__col-side">
              <div className="newspaper__box">
                <div className="newspaper__box-title">FICHA TÉCNICA</div>
                <div className="newspaper__box-row"><span>TREINADOR</span><span>{prof}</span></div>
                <div className="newspaper__box-row"><span>ESCOLA</span><span>{nomeCompleto}</span></div>
                <div className="newspaper__box-row"><span>CIDADE</span><span>{escola.cidade}</span></div>
                <div className="newspaper__box-row"><span>TIPO</span><span>{escola.tipo === 'publica' ? 'PÚBLICA' : 'PARTICULAR'}</span></div>
                <div className="newspaper__box-row"><span>VERBA</span><span>C$ {state.economia.saldo}</span></div>
              </div>
              <div className="newspaper__headline-3">{headlines[2]}</div>
            </div>
          </div>

          {phase === 'done' && (
            <div className="newspaper__continue">
              <div className="newspaper__continue-text">▶ CLIQUE PARA CONTINUAR</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
