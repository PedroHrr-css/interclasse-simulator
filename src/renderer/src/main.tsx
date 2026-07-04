import './index.css'
import ReactDOM from 'react-dom/client'
import { Component, type ReactNode, type ErrorInfo } from 'react'
import { GameProvider } from './store/GameContext'
import App from './App'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('React error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: '#0a0a1a', color: '#e94560', padding: 32,
          fontFamily: 'monospace', fontSize: 12, height: '100vh'
        }}>
          <h1 style={{ marginBottom: 16 }}>ERRO DE INICIALIZAÇÃO</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#e8e8f0' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')
console.log('[Interclasse] root element:', rootEl)

if (!rootEl) {
  document.body.innerHTML = '<div style="color:red;padding:20px">ERRO: elemento #root não encontrado</div>'
} else {
  ReactDOM.createRoot(rootEl).render(
    <ErrorBoundary>
      <GameProvider>
        <App />
      </GameProvider>
    </ErrorBoundary>
  )
}
