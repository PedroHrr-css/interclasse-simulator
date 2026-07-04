import { useState } from 'react'
import { useGame } from '@/store/GameContext'
import { Sidebar } from './Sidebar'
import { SquadScreen } from '../Squad/SquadScreen'
import { TransferMarket } from '../Transfer/TransferMarket'
import { CompetitionScreen } from '../Competition/CompetitionScreen'
import { EconomyScreen } from '../Economy/EconomyScreen'
import { SchoolScreen } from '../School/SchoolScreen'
import { KitScreen } from '../Kit/KitScreen'
import { LineupScreen } from '../Lineup/LineupScreen'
import './Hub.css'

export type HubTab = 'escalacao' | 'elenco' | 'mercado' | 'campeonato' | 'escola' | 'financas' | 'camisa'

const TAB_LABELS: Record<HubTab, string> = {
  escalacao: '📋 Escalação',
  elenco: '👥 Elenco',
  mercado: '🔄 Mercado',
  campeonato: '🏆 Campeonato',
  escola: '🏫 Escola',
  financas: '💰 Finanças',
  camisa: '👕 Camisa'
}

export function Hub() {
  const { state } = useGame()
  const [activeTab, setActiveTab] = useState<HubTab>('escalacao')

  return (
    <div className="hub">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="hub__main">
        <div className="hub__tabs">
          {(Object.keys(TAB_LABELS) as HubTab[]).map((tab) => (
            <button
              key={tab}
              className={`hub__tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <div className={`hub__content ${activeTab === 'escalacao' ? 'hub__content--court' : ''}`}>
          {activeTab === 'escalacao' && <LineupScreen />}
          {activeTab === 'elenco' && <SquadScreen />}
          {activeTab === 'mercado' && <TransferMarket />}
          {activeTab === 'campeonato' && <CompetitionScreen />}
          {activeTab === 'escola' && <SchoolScreen />}
          {activeTab === 'financas' && <EconomyScreen />}
          {activeTab === 'camisa' && <KitScreen />}
        </div>
      </div>
    </div>
  )
}
