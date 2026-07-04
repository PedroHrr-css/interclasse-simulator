import { useGame } from '@/store/GameContext'
import { KitCanvas } from './KitCanvas'
import type { KitConfig } from '@/types'
import './Kit.css'

export function KitScreen() {
  const { state, dispatch } = useGame()
  const { kit } = state

  const update = (partial: Partial<KitConfig>) => {
    dispatch({ type: 'UPDATE_KIT', payload: partial })
  }

  return (
    <div>
      <div className="screen-header">
        <h1 className="screen-title">UNIFORME DO TIME</h1>
      </div>

      <div className="kit-screen-grid">
        <div className="kit-screen-preview">
          <KitCanvas kit={kit} size={200} numero={10} />
          <KitCanvas kit={kit} size={120} numero={1} />
          <KitCanvas kit={kit} size={80} numero={7} />
        </div>

        <div className="card kit-screen-controls">
          <div className="card-title">PERSONALIZAR</div>

          <div className="kit-control">
            <label className="new-game__label">COR PRIMÁRIA</label>
            <div className="kit-control__row">
              <input type="color" value={kit.corPrimaria}
                onChange={(e) => update({ corPrimaria: e.target.value })}
                className="kit-editor__color" />
              <span className="text-gray text-xs">{kit.corPrimaria}</span>
            </div>
          </div>

          <div className="kit-control">
            <label className="new-game__label">COR SECUNDÁRIA</label>
            <div className="kit-control__row">
              <input type="color" value={kit.corSecundaria}
                onChange={(e) => update({ corSecundaria: e.target.value })}
                className="kit-editor__color" />
              <span className="text-gray text-xs">{kit.corSecundaria}</span>
            </div>
          </div>

          <div className="kit-control">
            <label className="new-game__label">COR DO NÚMERO</label>
            <div className="kit-control__row">
              <input type="color" value={kit.corNumero}
                onChange={(e) => update({ corNumero: e.target.value })}
                className="kit-editor__color" />
              <span className="text-gray text-xs">{kit.corNumero}</span>
            </div>
          </div>

          <div className="kit-control">
            <label className="new-game__label">ESTILO</label>
            <select className="new-game__select" value={kit.estilo}
              onChange={(e) => update({ estilo: e.target.value as KitConfig['estilo'] })}>
              <option value="solido">Sólido</option>
              <option value="bicolor">Bicolor</option>
              <option value="listra_v">Listras Verticais</option>
              <option value="listra_h">Listras Horizontais</option>
            </select>
          </div>

          <div className="kit-control">
            <label className="new-game__label">SÍMBOLO (2 letras)</label>
            <input className="new-game__input" type="text"
              value={kit.simbolo}
              onChange={(e) => update({ simbolo: e.target.value.slice(0, 2).toUpperCase() })}
              maxLength={2} />
          </div>
        </div>
      </div>
    </div>
  )
}
