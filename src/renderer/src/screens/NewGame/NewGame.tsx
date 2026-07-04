import { useState } from 'react'
import { useGame } from '@/store/GameContext'
import type { KitConfig } from '@/types'
import type { SchoolType } from '@/types/school'
import { KitCanvas } from '../Kit/KitCanvas'
import { cidades } from '@/data/brazilianNames'
import './NewGame.css'

type Step = 1 | 2 | 3 | 4 | 5

const kit1Default: KitConfig = { corPrimaria: '#1a73e8', corSecundaria: '#ffffff', corNumero: '#ffffff', estilo: 'solido', simbolo: 'IC' }
const kit2Default: KitConfig = { corPrimaria: '#1a1a1a', corSecundaria: '#e8e8f0', corNumero: '#e8e8f0', estilo: 'solido', simbolo: 'IC' }

function KitEditor({ kit, onChange, label }: { kit: KitConfig; onChange: (k: Partial<KitConfig>) => void; label: string }) {
  return (
    <div className="kit-editor-mini">
      <div className="kit-editor-mini__preview">
        <KitCanvas kit={kit} size={100} />
        <div className="kit-editor-mini__label">{label}</div>
      </div>
      <div className="kit-editor-mini__controls">
        <div className="kit-editor__row">
          <label className="new-game__label">COR PRIMÁRIA</label>
          <input type="color" value={kit.corPrimaria} onChange={e => onChange({ corPrimaria: e.target.value })} className="kit-editor__color" />
        </div>
        <div className="kit-editor__row">
          <label className="new-game__label">COR SECUNDÁRIA</label>
          <input type="color" value={kit.corSecundaria} onChange={e => onChange({ corSecundaria: e.target.value })} className="kit-editor__color" />
        </div>
        <div className="kit-editor__row">
          <label className="new-game__label">COR NÚMERO</label>
          <input type="color" value={kit.corNumero} onChange={e => onChange({ corNumero: e.target.value })} className="kit-editor__color" />
        </div>
        <div className="kit-editor__row">
          <label className="new-game__label">ESTILO</label>
          <select className="new-game__select" value={kit.estilo} onChange={e => onChange({ estilo: e.target.value as KitConfig['estilo'] })}>
            <option value="solido">Sólido</option>
            <option value="bicolor">Bicolor</option>
            <option value="listra_v">Listras Verticais</option>
            <option value="listra_h">Listras Horizontais</option>
          </select>
        </div>
        <div className="kit-editor__row">
          <label className="new-game__label">SÍMBOLO</label>
          <input className="new-game__input" type="text" value={kit.simbolo}
            onChange={e => onChange({ simbolo: e.target.value.slice(0, 2).toUpperCase() })} maxLength={2} />
        </div>
      </div>
    </div>
  )
}

export function NewGame() {
  const { dispatch } = useGame()
  const [step, setStep] = useState<Step>(1)
  const [escolaTipo, setEscolaTipo] = useState<SchoolType>('publica')
  const [nomeEscola, setNomeEscola] = useState('')
  const [cidade, setCidade] = useState('São Paulo')
  const [nomeProfesor, setNomeProfesor] = useState('')
  const [kit1, setKit1] = useState<KitConfig>(kit1Default)
  const [kit2, setKit2] = useState<KitConfig>(kit2Default)

  const handleStart = () => {
    if (!nomeEscola.trim() || !nomeProfesor.trim()) return
    dispatch({
      type: 'START_NEW_GAME',
      payload: {
        escolaTipo,
        nomeEscola: nomeEscola.trim(),
        cidade,
        nomeProfesor: nomeProfesor.trim(),
        kit: kit1,
        kit2
      }
    })
  }

  const steps = [1, 2, 3, 4, 5] as Step[]
  const stepLabels = ['Escola', 'Nome', 'Professor', 'Uniforme 1', 'Uniforme 2']

  return (
    <div className="new-game">
      <div className="new-game__scanlines" />
      <div className="new-game__panel">
        <div className="new-game__header">
          <span className="text-pixel text-accent" style={{ fontSize: 8 }}>NOVO JOGO</span>
          <div className="new-game__steps">
            {steps.map((s, i) => (
              <div key={s} className={`new-game__step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`} title={stepLabels[i]} />
            ))}
          </div>
        </div>

        {/* PASSO 1 — Tipo de escola */}
        {step === 1 && (
          <div className="new-game__step">
            <h2 className="new-game__step-title">Escolha sua escola</h2>
            <div className="school-type-cards">
              <button className={`school-type-card ${escolaTipo === 'publica' ? 'selected' : ''}`} onClick={() => setEscolaTipo('publica')}>
                <div className="school-type-card__emoji">🏫</div>
                <div className="school-type-card__name">ESCOLA PÚBLICA</div>
                <div className="school-type-card__desc">
                  <div className="text-green">+ Alto potencial nos jogadores</div>
                  <div className="text-green">+ Muitos talentos escondidos</div>
                  <div className="text-accent">− Menos verba (C$ 200)</div>
                  <div className="text-accent">− Quadra em mau estado</div>
                </div>
              </button>
              <button className={`school-type-card ${escolaTipo === 'particular' ? 'selected' : ''}`} onClick={() => setEscolaTipo('particular')}>
                <div className="school-type-card__emoji">🏛️</div>
                <div className="school-type-card__name">ESCOLA PARTICULAR</div>
                <div className="school-type-card__desc">
                  <div className="text-green">+ Mais verba (C$ 600)</div>
                  <div className="text-green">+ Quadra em bom estado</div>
                  <div className="text-accent">− Potencial dos jogadores menor</div>
                  <div className="text-accent">− Menos surpresas</div>
                </div>
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(2)}>PRÓXIMO ▶</button>
          </div>
        )}

        {/* PASSO 2 — Nome e cidade */}
        {step === 2 && (
          <div className="new-game__step">
            <h2 className="new-game__step-title">Sua escola</h2>
            <div className="new-game__input-group">
              <label className="new-game__label">{escolaTipo === 'publica' ? 'EMEF / EE' : 'COLÉGIO'}</label>
              <input className="new-game__input" type="text"
                placeholder={escolaTipo === 'publica' ? 'Santos Dumont' : 'Objetivo'}
                value={nomeEscola} onChange={e => setNomeEscola(e.target.value)} maxLength={40} autoFocus />
              {nomeEscola && (
                <div className="new-game__preview-name">
                  {escolaTipo === 'publica' ? `EMEF ${nomeEscola}` : `Colégio ${nomeEscola}`}
                </div>
              )}
            </div>
            <div className="new-game__input-group">
              <label className="new-game__label">CIDADE</label>
              <select className="new-game__select" value={cidade} onChange={e => setCidade(e.target.value)}>
                {cidades.map(c => (
                  <option key={c.cidade} value={c.cidade}>{c.cidade} — {c.estado}</option>
                ))}
              </select>
            </div>
            <div className="new-game__nav">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>◀ VOLTAR</button>
              <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!nomeEscola.trim()}>PRÓXIMO ▶</button>
            </div>
          </div>
        )}

        {/* PASSO 3 — Nome do professor */}
        {step === 3 && (
          <div className="new-game__step">
            <h2 className="new-game__step-title">Quem é você?</h2>
            <div className="professor-intro">
              <div className="professor-intro__mascot">
                <MascoteSVG size={100} />
              </div>
              <div className="professor-intro__text">
                <p>Você é o novo <strong>Professor de Educação Física</strong> da escola.</p>
                <p>Como o time vai te chamar?</p>
              </div>
            </div>
            <div className="new-game__input-group">
              <label className="new-game__label">SEU NOME / APELIDO</label>
              <input className="new-game__input" type="text"
                placeholder="Prof. Batata, Mister Silva..."
                value={nomeProfesor} onChange={e => setNomeProfesor(e.target.value)} maxLength={30} autoFocus />
            </div>
            <div className="new-game__nav">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>◀ VOLTAR</button>
              <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!nomeProfesor.trim()}>PRÓXIMO ▶</button>
            </div>
          </div>
        )}

        {/* PASSO 4 — Uniforme 1 */}
        {step === 4 && (
          <div className="new-game__step">
            <h2 className="new-game__step-title">Uniforme Principal</h2>
            <KitEditor kit={kit1} onChange={p => setKit1({ ...kit1, ...p })} label="UNIFORME 1" />
            <div className="new-game__nav">
              <button className="btn btn-secondary" onClick={() => setStep(3)}>◀ VOLTAR</button>
              <button className="btn btn-primary" onClick={() => setStep(5)}>PRÓXIMO ▶</button>
            </div>
          </div>
        )}

        {/* PASSO 5 — Uniforme 2 */}
        {step === 5 && (
          <div className="new-game__step">
            <h2 className="new-game__step-title">Uniforme Reserva</h2>
            <KitEditor kit={kit2} onChange={p => setKit2({ ...kit2, ...p })} label="UNIFORME 2" />
            <div className="new-game__nav">
              <button className="btn btn-secondary" onClick={() => setStep(4)}>◀ VOLTAR</button>
              <button className="btn btn-success" onClick={handleStart} disabled={!nomeEscola.trim() || !nomeProfesor.trim()}>
                ▶ COMEÇAR JOGO!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MascoteSVG({ size = 80 }: { size?: number }) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" style={{ imageRendering: 'pixelated' }}>
      {/* Fundo transparente */}
      {/* Criança caída no chão */}
      {/* Corpo deitado */}
      <rect x="12" y="38" width="28" height="8" fill="#e8c87a" rx="2"/>
      {/* Uniforme azul no corpo */}
      <rect x="14" y="39" width="24" height="6" fill="#1a73e8" rx="1"/>
      {/* Cabeça */}
      <rect x="6" y="30" width="14" height="12" fill="#f4a460" rx="3"/>
      {/* Olho esquerdo (estrelas de dor) */}
      <text x="8" y="40" fontSize="6" fill="#fff">✦</text>
      {/* Boca aberta de dor */}
      <rect x="10" y="39" width="6" height="2" fill="#c0392b" rx="1"/>
      {/* Pernas */}
      <rect x="36" y="36" width="6" height="4" fill="#e8c87a" rx="1"/>
      <rect x="40" y="34" width="6" height="4" fill="#e8c87a" rx="1"/>
      {/* Sapatos */}
      <rect x="34" y="40" width="8" height="3" fill="#333" rx="1"/>
      <rect x="40" y="38" width="8" height="3" fill="#333" rx="1"/>
      {/* Bola ao lado */}
      <circle cx="50" cy="42" r="5" fill="#fff" stroke="#333" strokeWidth="1"/>
      <path d="M47,40 L53,40 M50,37 L50,45 M47,43 L53,43" stroke="#333" strokeWidth="1"/>

      {/* Criança 1 rindo atrás - à direita */}
      <rect x="44" y="20" width="10" height="12" fill="#f4a460" rx="3"/>
      <rect x="44" y="26" width="10" height="8" fill="#e94560" rx="1"/>
      <rect x="46" y="21" width="2" height="2" fill="#333" rx="1"/>
      <rect x="50" y="21" width="2" height="2" fill="#333" rx="1"/>
      {/* Boca de gargalhada */}
      <rect x="46" y="27" width="6" height="2" fill="#c0392b" rx="1"/>
      <text x="42" y="19" fontSize="7" fill="#f5a623">HA</text>

      {/* Criança 2 rindo - mais ao centro */}
      <rect x="28" y="16" width="10" height="12" fill="#f4a460" rx="3"/>
      <rect x="28" y="22" width="10" height="8" fill="#4caf50" rx="1"/>
      <rect x="30" y="17" width="2" height="2" fill="#333" rx="1"/>
      <rect x="34" y="17" width="2" height="2" fill="#333" rx="1"/>
      <rect x="30" y="23" width="6" height="2" fill="#c0392b" rx="1"/>
      <text x="26" y="15" fontSize="7" fill="#f5a623">HA</text>

      {/* Estrelas de impacto */}
      <text x="2" y="36" fontSize="8" fill="#f5a623">★</text>
      <text x="18" y="28" fontSize="6" fill="#f5a623">✦</text>
    </svg>
  )
}

export { MascoteSVG }
