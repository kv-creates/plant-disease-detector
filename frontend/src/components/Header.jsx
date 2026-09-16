import { useEffect, useState } from 'react'
import { LOCALES } from '../utils/i18n'

function Logo() {
  return (
    <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#16a34a,#14532d)' }} aria-hidden="true">
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C8 7 5.5 10.5 5.5 14a6.5 6.5 0 0 0 13 0C18.5 10.5 16 7 12 3z" />
        <path d="M12 7v13M12 11l-3.2-2.4M12 14l-3.8-1.2M12 17l-2.8-.6M12 11l3.2-2.4M12 14l3.8-1.2" />
      </svg>
    </span>
  )
}

export default function Header({ activeTab, onTab, dark, onToggleDark, locale, onLocale, backendOnline }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { id: 'analyze', label: 'Analyze' },
    { id: 'library', label: 'Library' },
    { id: 'how', label: 'How it works' },
    { id: 'history', label: 'History' },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all ${scrolled ? 'shadow-soft' : ''}`}
      style={{ background: dark ? 'rgba(11,18,13,0.86)' : 'rgba(255,255,255,0.86)', borderColor: 'var(--line)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          <button onClick={() => onTab('analyze')} className="flex items-center gap-3 text-left" aria-label="Go to analyzer">
            <Logo />
            <span className="leading-tight">
              <span className="block font-display font-bold text-[17px]">Plant Doctor</span>
              <span className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                <span className={`inline-block w-2 h-2 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-amber-500'}`} aria-hidden="true" />
                {backendOnline ? 'API connected' : 'Demo mode ready'}
              </span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => onTab(l.id)}
                aria-current={activeTab === l.id ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === l.id ? 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-100' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                style={activeTab === l.id ? undefined : { color: 'var(--muted)' }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <label className="sr-only" htmlFor="locale">Language</label>
            <select
              id="locale"
              value={locale}
              onChange={(e) => onLocale(e.target.value)}
              className="text-sm font-semibold px-2.5 py-2 rounded-lg border"
              style={{ borderColor: 'var(--line)', background: 'var(--surface)', color: 'var(--ink)' }}
            >
              {LOCALES.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={onToggleDark}
              className="w-10 h-10 rounded-xl border flex items-center justify-center hover:-translate-y-0.5 transition-transform"
              style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={dark}
            >
              {dark ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
              )}
            </button>
            <a
              href="https://github.com/kv-creates/plant-disease-detector"
              target="_blank"
              rel="noreferrer"
              className="btn-outline !min-h-0 !py-2 !px-4 text-sm"
            >
              GitHub
            </a>
          </div>

          <button
            className="lg:hidden w-11 h-11 rounded-xl border flex items-center justify-center"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={open ? 'M6 18 18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </div>

        {open && (
          <nav className="lg:hidden pb-4 grid gap-1 animate-fade-in" aria-label="Mobile">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => { onTab(l.id); setOpen(false) }}
                className={`text-left px-3 py-3 rounded-xl font-semibold ${activeTab === l.id ? 'bg-green-100 dark:bg-green-900/40' : ''}`}
              >
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <select value={locale} onChange={(e) => onLocale(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }} aria-label="Language">
                {LOCALES.map((l) => <option key={l.id} value={l.id}>{l.label} — {l.id}</option>)}
              </select>
              <button onClick={onToggleDark} className="px-4 rounded-xl border font-semibold" style={{ borderColor: 'var(--line)' }}>
                {dark ? 'Light' : 'Dark'}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
