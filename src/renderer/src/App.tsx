import { useEffect, useState } from 'react'
import { useGame } from './store/GameContext'
import { MainMenu } from './screens/MainMenu/MainMenu'
import { NewGame } from './screens/NewGame/NewGame'
import { Hub } from './screens/Hub/Hub'
import { NewspaperScreen } from './screens/Jornal/NewspaperScreen'
import { Notifications } from './components/Notifications'
import './App.css'

type Theme = 'dark' | 'light'

export default function App() {
  const { state } = useGame()
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('ic_theme') as Theme) ?? 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ic_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <>
      <Notifications />
      <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}>
        {theme === 'dark' ? '☀' : '☾'}
      </button>
      {state.fase === 'menu' && <MainMenu />}
      {state.fase === 'novo_jogo' && <NewGame />}
      {state.fase === 'jornal' && <NewspaperScreen />}
      {state.fase === 'jogando' && <Hub />}
    </>
  )
}
