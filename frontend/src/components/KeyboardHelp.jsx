export default function KeyboardHelp() {
  const rows = [["Enter", "Analyze loaded photo"], ["Esc", "Remove photo / reset"], ["Tab", "Move through controls"], ["1–5", "Rate report (when visible)"]];
  return (
    <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--line)' }}>
      <p className="font-bold">Keyboard shortcuts</p>
      <ul className="mt-2 grid sm:grid-cols-2 gap-2">
        {rows.map(([k, v]) => (<li key={k} className="flex gap-2"><kbd className="chip">{k}</kbd><span style={{ color: 'var(--muted)' }}>{v}</span></li>))}
      </ul>
    </div>
  )
}
