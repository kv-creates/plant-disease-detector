import { Component } from 'react'

export function Toasts({ items }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[min(92vw,480px)]" aria-live="polite" aria-atomic="false">
      {items.map((toast) => (
        <div key={toast.id} className="toast-enter card px-4 py-3 flex items-center gap-3 text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('UI error', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="card p-8 text-center" role="alert">
          <h2 className="font-display text-2xl font-bold">Something glitched</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Reload to continue. Your history stays on this device.</p>
          <button onClick={() => location.reload()} className="btn-primary mt-5">Reload app</button>
        </div>
      )
    }
    return this.props.children
  }
}
