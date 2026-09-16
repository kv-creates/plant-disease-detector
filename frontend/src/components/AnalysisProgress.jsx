import { useEffect, useState } from 'react'

const STAGES = [
  'Validating image',
  'Enhancing leaf detail',
  'Scanning symptoms',
  'Scoring severity',
  'Writing your report',
]

export default function AnalysisProgress({ preview, provider }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    setStage(0)
    const timers = STAGES.map((_, i) => setTimeout(() => setStage(i), 450 * (i + 1)))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in" role="status" aria-live="polite" aria-label="Analysis in progress">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {preview && (
          <img src={preview} alt="" aria-hidden="true" className="w-full sm:w-44 h-32 object-cover rounded-2xl border" style={{ borderColor: 'var(--line)' }} />
        )}
        <div className="flex-1 w-full">
          <p className="eyebrow">Analyzing with {provider === 'anthropic' ? 'Claude 3.5' : provider === 'demo' ? 'Demo engine' : 'GPT-4o'}</p>
          <h3 className="font-display text-2xl font-bold mt-2">{STAGES[Math.min(stage, STAGES.length - 1)]}…</h3>
          <ol className="mt-4 space-y-2.5">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm" aria-current={i === stage ? 'step' : undefined}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < stage ? 'bg-green-600 text-white' : i === stage ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 animate-pulse' : 'bg-black/10 dark:bg-white/10'}`} style={i > stage ? { color: 'var(--muted)' } : undefined}>
                  {i < stage ? '✓' : i + 1}
                </span>
                <span className={i <= stage ? 'font-semibold' : ''} style={i > stage ? { color: 'var(--muted)' } : undefined}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border p-5 space-y-3" style={{ borderColor: 'var(--line)' }}>
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
