export function Hero({ onAnalyze, onDemo, t }) {
  return (
    <section className="relative overflow-hidden rounded-3xl card p-6 sm:p-10 mb-6" aria-labelledby="hero-title">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 animate-float" style={{ background: 'radial-gradient(circle,#4ade80,transparent 70%)' }} aria-hidden="true" />
      <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
        <div>
          <span className="eyebrow">Farmer-first AI · Demo ready</span>
          <h1 id="hero-title" className="font-display text-4xl sm:text-5xl font-bold mt-4 leading-[1.05]">
            {t('tagline')}
          </h1>
          <p className="mt-3 text-lg" style={{ color: 'var(--muted)' }}>{t('subtitle')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onAnalyze} className="btn-primary">Start analysis</button>
            <button onClick={onDemo} className="btn-outline">{t('demo')} — no signup</button>
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            {[
              ['<60s', 'to report'],
              ['8', 'diseases in library'],
              ['3', 'languages'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl border p-3 text-center" style={{ borderColor: 'var(--line)' }}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-bold">{v}</dd>
                <dd className="text-xs" style={{ color: 'var(--muted)' }}>{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative" aria-hidden="true">
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
            <svg viewBox="0 0 400 300" className="w-full h-auto block" role="img" aria-label="Leaf diagnosis illustration">
              <rect width="400" height="300" fill="#f0fdf4" />
              <ellipse cx="200" cy="150" rx="110" ry="90" fill="#dcfce7" />
              <path d="M200 70C160 110 140 140 140 175a60 60 0 0 0 120 0c0-35-20-65-60-105z" fill="#16a34a" opacity="0.9" />
              <path d="M200 90v140M200 130l-34-22M200 160l-40-10M200 190l-30-4M200 130l34-22M200 160l40-10" stroke="#f0fdf4" strokeWidth="5" strokeLinecap="round" />
              <circle cx="252" cy="128" r="26" fill="#fff" stroke="#16a34a" strokeWidth="3" />
              <path d="M244 128l6 6 12-12" stroke="#16a34a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="36" y="232" width="150" height="18" rx="9" fill="#14532d" opacity="0.85" />
              <rect x="36" y="232" width="118" height="18" rx="9" fill="#22c55e" />
            </svg>
          </div>
          <div className="absolute -bottom-4 left-4 right-4 sm:left-8 sm:right-8 rounded-2xl card p-3 flex items-center gap-3 animate-slide-up">
            <span className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">78%</span>
            <div className="text-sm">
              <p className="font-bold">Early Blight · moderate</p>
              <p style={{ color: 'var(--muted)' }}>Demo report with treatment steps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { n: '01', title: 'Capture or upload', text: 'Use a clear, well-lit leaf photo. JPEG, PNG, or WebP up to 10MB.' },
  { n: '02', title: 'AI analysis', text: 'Demo engine answers instantly; GPT-4o / Claude 3.5 when keys are set.' },
  { n: '03', title: 'Act with confidence', text: 'Severity, symptoms, treatment, prevention — plus print and share.' },
]

export function HowItWorks() {
  return (
    <section className="card p-6 sm:p-8 mb-6" aria-labelledby="how-title">
      <span className="eyebrow">How it works</span>
      <h2 id="how-title" className="font-display text-2xl sm:text-3xl font-bold mt-3">From photo to action in three steps</h2>
      <ol className="mt-6 grid md:grid-cols-3 gap-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-2xl border p-5 card-hover" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
            <p className="font-display text-sm font-bold text-green-700 dark:text-green-300">{s.n}</p>
            <h3 className="font-bold text-lg mt-1">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-2xl p-4 text-sm border" style={{ borderColor: '#fde047', background: 'rgba(250,204,21,0.12)' }} role="note">
        <strong>Field tip:</strong> photograph the worst-affected leaf in daylight, fill the frame, avoid shadows and fingers.
      </div>
    </section>
  )
}

export function TrustBar() {
  const items = [
    ['No signup', 'Demo works offline'],
    ['Private', 'Images are analyzed, never sold'],
    ['Explainable', 'Confidence + severity shown'],
    ['Printable', 'Share with your agronomist'],
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6" role="list" aria-label="Trust highlights">
      {items.map(([title, sub]) => (
        <div key={title} role="listitem" className="card p-4 flex gap-3 items-start">
          <span className="w-9 h-9 shrink-0 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 flex items-center justify-center" aria-hidden="true">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5" /></svg>
          </span>
          <span>
            <span className="block font-bold text-sm">{title}</span>
            <span className="block text-xs" style={{ color: 'var(--muted)' }}>{sub}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
