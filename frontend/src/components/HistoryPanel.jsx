import { clearHistory, exportHistory } from '../utils/history'

export default function HistoryPanel({ items, onRestore, onClear, onExport }) {
  if (!items.length) {
    return (
      <div className="card p-8 text-center" role="status">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-2xl" aria-hidden="true">🌱</div>
        <h3 className="font-display text-xl font-bold mt-3">No analyses yet</h3>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Your recent diagnoses will appear here on this device.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold">Recent on this device ({items.length})</h3>
        <span className="flex-1" />
        <button onClick={() => { exportHistory(); onExport?.() }} className="btn-ghost !min-h-0 !py-2">Export JSON</button>
        <button
          onClick={() => { if (confirm('Clear local history?')) onClear(clearHistory()) }}
          className="btn-ghost !min-h-0 !py-2 !text-red-600"
        >
          Clear
        </button>
      </div>
      <ul className="grid sm:grid-cols-2 gap-3">
        {items.map((h, i) => (
          <li key={`${h.savedAt}-${i}`} className="card card-hover p-4 flex gap-3">
            {h.preview && <img src={h.preview} alt="" aria-hidden="true" className="w-16 h-16 rounded-xl object-cover border" style={{ borderColor: 'var(--line)' }} />}
            <div className="min-w-0 flex-1">
              <p className="font-bold truncate">{h.result?.disease?.name || 'Analysis'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                {(h.result?.disease?.severity || '')} · {Math.round((h.result?.disease?.confidence || 0) * 100)}% · {new Date(h.savedAt).toLocaleString()}
                {h.result?.demo ? ' · demo' : ''}
              </p>
              <button onClick={() => onRestore(h)} className="mt-2 text-sm font-bold text-green-700 dark:text-green-300 underline underline-offset-4">
                Restore report
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs" style={{ color: 'var(--muted)' }}>Stored only in your browser. Clearing site data removes it.</p>
    </div>
  )
}
