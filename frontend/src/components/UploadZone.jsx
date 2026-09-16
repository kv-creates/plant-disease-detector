import { useCallback, useRef, useState } from 'react'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function UploadZone({
  image, preview, loading, error, onImageSelect, onRemoveImage, onAnalyze,
  provider, setProvider, includeTreatment, setIncludeTreatment,
  includePrevention, setIncludePrevention, onDemo, t,
}) {
  const [dragActive, setDragActive] = useState(false)
  const [localError, setLocalError] = useState(null)
  const fileInputRef = useRef(null)

  const validate = useCallback((file) => {
    if (!file) return 'No file selected.'
    if (!ALLOWED.includes(file.type)) return 'Please use JPEG, PNG, or WebP.'
    if (file.size > MAX_BYTES) return `Image is ${formatBytes(file.size)} — max is 10MB. Try a smaller photo.`
    if (file.size === 0) return 'This file is empty.'
    return null
  }, [])

  const pick = useCallback((file) => {
    const problem = validate(file)
    if (problem) {
      setLocalError(problem)
      return
    }
    setLocalError(null)
    onImageSelect(file)
  }, [onImageSelect, validate])

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    if (e.dataTransfer.files?.[0]) pick(e.dataTransfer.files[0])
  }, [pick])

  const shownError = localError || error

  if (image && preview) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="relative rounded-2xl overflow-hidden border bg-black/5" style={{ borderColor: 'var(--line)' }}>
          <img src={preview} alt="Selected leaf preview" className="w-full max-h-[420px] object-contain bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:24px_24px] dark:bg-none dark:bg-black/30" />
          <div className="absolute left-3 bottom-3 flex flex-wrap gap-2">
            <span className="chip !bg-white/95">{image.name?.slice(0, 28) || 'leaf image'}</span>
            <span className="chip !bg-white/95">{formatBytes(image.size)}</span>
            <span className="chip !bg-white/95">{image.type?.replace('image/', '').toUpperCase()}</span>
          </div>
          <button
            onClick={onRemoveImage}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            aria-label="Remove image and choose another"
          >
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <fieldset className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
          <legend className="px-2 text-sm font-bold" style={{ color: 'var(--muted)' }}>Analysis options</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="AI provider">
            {[
              ['openai', 'OpenAI GPT-4o'],
              ['anthropic', 'Claude 3.5 Sonnet'],
            ].map(([id, label]) => (
              <label key={id} className={`cursor-pointer px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${provider === id ? 'border-green-600 bg-green-50 dark:bg-green-900/30' : 'hover:border-green-400'}`} style={provider === id ? undefined : { borderColor: 'var(--line)' }}>
                <input type="radio" name="provider" value={id} checked={provider === id} onChange={(e) => setProvider(e.target.value)} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ['treatment', includeTreatment, setIncludeTreatment, 'Treatment plan'],
              ['prevention', includePrevention, setIncludePrevention, 'Prevention plan'],
            ].map(([id, val, set, label]) => (
              <label key={id} className={`cursor-pointer px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 ${val ? 'border-green-600 bg-green-50 dark:bg-green-900/30' : ''}`} style={val ? undefined : { borderColor: 'var(--line)' }}>
                <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="w-4 h-4 accent-green-600" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <button onClick={onAnalyze} disabled={loading} className="btn-primary w-full text-lg">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" /></svg>
              {t('analyzing')}
            </>
          ) : t('analyze')}
        </button>

        {shownError && (
          <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 p-4 text-sm flex gap-3" role="alert">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
            <span>{shownError}</span>
          </div>
        )}
        <p className="text-center text-xs" style={{ color: 'var(--muted)' }}>Tip: press <kbd className="chip">Enter</kbd> to analyze, <kbd className="chip">Esc</kbd> to remove.</p>
      </div>
    )
  }

  return (
    <div
      className={`drop-zone ${dragActive ? 'active' : ''}`}
      onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
      role="button"
      tabIndex={0}
      aria-label="Upload leaf image. Activate to browse files, or drag and drop."
    >
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} aria-hidden="true" tabIndex={-1} />
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-white shadow-lg animate-float" style={{ background: 'linear-gradient(135deg,#22c55e,#14532d)' }}>
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M12 16V6m0 0-3.5 3.5M12 6l3.5 3.5" /><path d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5M4 16.5 6 13m16 3.5L18 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold">Drop your leaf photo here</h3>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>or <span className="font-semibold text-green-700 dark:text-green-300 underline underline-offset-4">browse files</span> — daylight photos work best</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
          {['JPEG', 'PNG', 'WebP', '≤ 10MB'].map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
        {shownError && <div className="max-w-md mx-auto rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 p-3 text-sm" role="alert">{shownError}</div>}
        <div className="pt-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDemo?.() }}
            className="btn-ghost underline underline-offset-4"
            type="button"
          >
            No photo handy? {t('demo')} instantly
          </button>
        </div>
      </div>
    </div>
  )
}
