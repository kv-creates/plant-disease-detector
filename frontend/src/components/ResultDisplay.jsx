import { useMemo, useState } from 'react'
import { sendFeedback } from '../utils/api'

function ConfidenceRing({ value }) {
  const r = 26
  const c = 2 * Math.PI * r
  const off = c - (value / 100) * c
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#ca8a04' : '#dc2626'
  return (
    <span className="flex items-center gap-3" role="img" aria-label={`Confidence ${value} percent`}>
      <svg className="confidence-ring" width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" strokeWidth="8" stroke="rgba(127,127,127,0.18)" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
        <text x="34" y="39" textAnchor="middle" fontSize="15" fontWeight="800" fill="currentColor" transform="rotate(90 34 34)">{value}%</text>
      </svg>
      <span className="text-sm leading-tight" style={{ color: 'var(--muted)' }}>model<br />confidence</span>
    </span>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 flex items-center justify-center" aria-hidden="true">{icon}</span>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  )
}

const ICONS = {
  desc: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l5 5v11a2 2 0 0 1-2 2z" /></svg>,
  area: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  sym: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m5-2a9 9 0 1 1-14 0 9 9 0 0 1 14 0z" /></svg>,
  rx: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 4v16m8-8H4" /></svg>,
  shield: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" /></svg>,
}

export default function ResultDisplay({ result, preview, onRetry, onNewAnalysis, notify }) {
  const [copied, setCopied] = useState(false)
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)
  const { disease, processing_time_ms, demo, provider, detection_id } = result || {}

  const confidence = useMemo(() => Math.round((disease?.confidence ?? 0) * 100), [disease])

  if (!result?.success || !disease) {
    return (
      <div className="text-center py-6 animate-fade-in" role="alert">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600">!</div>
        <h3 className="font-display text-2xl font-bold mt-4">Analysis failed</h3>
        <p className="mt-1" style={{ color: 'var(--muted)' }}>{result?.error || 'Unknown error'}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={onRetry} className="btn-primary">Try again</button>
          <button onClick={onNewAnalysis} className="btn-outline">New photo</button>
        </div>
      </div>
    )
  }

  const shareText = `${disease.name} (${disease.severity}, ${confidence}% confidence). Symptoms: ${disease.symptoms.slice(0, 3).join('; ')}.`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${disease.name}\n${disease.description}\n\nTreatment: ${disease.treatment || '—'}\nPrevention: ${disease.prevention || '—'}`)
      setCopied(true)
      notify?.('Report copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      notify?.('Copy failed in this browser')
    }
  }

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: disease.name, text: shareText }) } catch { /* dismissed */ }
    } else copy()
  }

  const submitRating = async (v) => {
    setRating(v)
    try {
      await sendFeedback({ detection_id, rating: v, provider })
      setSent(true)
      notify?.('Thanks — feedback recorded')
    } catch {
      notify?.('Feedback needs the backend online')
    }
  }

  return (
    <article className="space-y-5 animate-slide-up" aria-labelledby="result-title">
      <div className="flex flex-wrap gap-2">
        {demo && <span className="chip !bg-amber-100 !border-amber-300 !text-amber-900">Demo result — connect API for live vision</span>}
        {provider && !demo && <span className="chip">Analyzed with {provider}</span>}
        {detection_id && <span className="chip">ID {detection_id}</span>}
      </div>

      <div className="flex flex-col md:flex-row gap-5 md:items-center">
        {preview && <img src={preview} alt="Analyzed leaf" className="w-full md:w-52 h-40 object-cover rounded-2xl border" style={{ borderColor: 'var(--line)' }} />}
        <div className="flex-1">
          <p className="eyebrow">Diagnosis ready</p>
          <h2 id="result-title" className="font-display text-3xl font-bold mt-2">{disease.name}</h2>
          {disease.scientific_name && <p className="italic" style={{ color: 'var(--muted)' }}>{disease.scientific_name}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`severity-badge severity-${disease.severity}`}>{disease.severity}</span>
            <ConfidenceRing value={confidence} />
            <span className="text-sm" style={{ color: 'var(--muted)' }}>{Math.round(processing_time_ms)}ms</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="What it is" icon={ICONS.desc}><p style={{ color: 'var(--ink)' }}>{disease.description}</p></Section>
        <Section title="Where it shows" icon={ICONS.area}><p>{disease.affected_area}</p></Section>
      </div>

      <Section title={`Visible symptoms (${disease.symptoms.length})`} icon={ICONS.sym}>
        <ul className="grid sm:grid-cols-2 gap-2">
          {disease.symptoms.map((s, i) => (
            <li key={i} className="flex gap-2 rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
              <span className="w-6 h-6 shrink-0 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      {disease.treatment && (
        <Section title="Treatment plan" icon={ICONS.rx}>
          <p className="whitespace-pre-wrap">{disease.treatment}</p>
          <p className="mt-3 text-sm rounded-xl p-3 border" style={{ borderColor: '#fde047', background: 'rgba(250,204,21,0.12)' }}>
            Always confirm chemicals and doses with your local extension officer. Demo advice is educational only.
          </p>
        </Section>
      )}

      {disease.prevention && (
        <Section title="Prevention calendar" icon={ICONS.shield}>
          <p className="whitespace-pre-wrap">{disease.prevention}</p>
          <div className="mt-3 grid sm:grid-cols-3 gap-2 text-sm">
            {['This week: scout + sanitize', 'This month: spacing + mulch', 'Season: rotate + resistant seed'].map((x) => (
              <div key={x} className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>{x}</div>
            ))}
          </div>
        </Section>
      )}

      <div className="rounded-2xl border p-4 flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--line)' }}>
        <span className="text-sm font-bold">Was this helpful?</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rate this diagnosis">
          {[1, 2, 3, 4, 5].map((v) => (
            <button key={v} onClick={() => submitRating(v)} aria-label={`${v} star`} aria-pressed={rating === v} className={`w-10 h-10 rounded-xl border text-lg transition-transform hover:scale-110 ${rating >= v ? 'bg-amber-100 border-amber-400' : ''}`} style={{ borderColor: 'var(--line)' }}>
              ★
            </button>
          ))}
        </div>
        {sent && <span className="text-sm text-green-700 dark:text-green-300 font-semibold">Recorded — thank you.</span>}
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <button onClick={copy} className="btn-outline !py-2.5">{copied ? 'Copied!' : 'Copy report'}</button>
        <button onClick={share} className="btn-outline !py-2.5">Share</button>
        <button onClick={() => window.print()} className="btn-outline !py-2.5">Print / PDF</button>
        <span className="flex-1" />
        <button onClick={onRetry} className="btn-ghost">Re-analyze</button>
        <button onClick={onNewAnalysis} className="btn-primary !py-2.5">New photo</button>
      </div>
    </article>
  )
}
