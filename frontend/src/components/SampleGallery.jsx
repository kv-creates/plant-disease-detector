const SAMPLES = [
  {
    id: 'blight',
    title: 'Blight sample',
    hint: 'Brown rings · moderate',
    gradient: 'linear-gradient(135deg,#14532d,#22c55e)',
    leaf: '#16a34a',
    spots: ['#7f1d1d', '#92400e', '#78350f'],
  },
  {
    id: 'mildew',
    title: 'Mildew sample',
    hint: 'White powder · mild',
    gradient: 'linear-gradient(135deg,#0f766e,#4ade80)',
    leaf: '#15803d',
    spots: ['#f8fafc', '#e2e8f0', '#f1f5f9'],
  },
  {
    id: 'healthy',
    title: 'Healthy sample',
    hint: 'Uniform green · healthy',
    gradient: 'linear-gradient(135deg,#166534,#86efac)',
    leaf: '#16a34a',
    spots: [],
  },
]

function SampleArt({ s }) {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-28 block" aria-hidden="true">
      <rect width="200" height="140" fill="#f0fdf4" />
      <path d="M100 18C74 44 60 64 60 88a40 40 0 0 0 80 0c0-24-14-44-40-70z" fill={s.leaf} opacity="0.92" />
      <path d="M100 34v84" stroke="#f0fdf4" strokeWidth="4" strokeLinecap="round" />
      {s.spots.map((c, i) => (
        <circle key={i} cx={78 + i * 22} cy={78 + (i % 2) * 14} r={i === 1 ? 9 : 6} fill={c} opacity="0.9" />
      ))}
    </svg>
  )
}

export default function SampleGallery({ onPick, disabled }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
      <div className="flex items-center gap-2">
        <h3 className="font-bold">No photo? Try a sample</h3>
        <span className="chip">Offline</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            disabled={disabled}
            onClick={() => onPick(s.id)}
            className="group rounded-2xl overflow-hidden border text-left transition-transform hover:-translate-y-1 disabled:opacity-50"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
            aria-label={`Use ${s.title} demo`}
          >
            <SampleArt s={s} />
            <span className="block p-2.5">
              <span className="block text-sm font-bold">{s.title}</span>
              <span className="block text-xs" style={{ color: 'var(--muted)' }}>{s.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function sampleFileFor(id) {
  // Generate a real JPEG blob client-side so demo + upload paths share code.
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 480
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 640, 480)
  if (id === 'mildew') { g.addColorStop(0, '#0f766e'); g.addColorStop(1, '#4ade80') }
  else if (id === 'healthy') { g.addColorStop(0, '#166534'); g.addColorStop(1, '#86efac') }
  else { g.addColorStop(0, '#14532d'); g.addColorStop(1, '#22c55e') }
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 640, 480)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = 'bold 42px system-ui'
  ctx.fillText(id.toUpperCase(), 40, 80)
  return new Promise((resolve) => canvas.toBlob((b) => {
    const file = new File([b], `${id}-sample.jpg`, { type: 'image/jpeg' })
    resolve(file)
  }, 'image/jpeg', 0.9))
}
