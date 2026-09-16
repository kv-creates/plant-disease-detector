import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/Feedback'
import './styles/index.css'
import './styles/print.css'

// Apply persisted theme before first paint to avoid flash.
try {
  const saved = localStorage.getItem('pdd:theme:v1')
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark')
} catch {
  /* ignore */
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)