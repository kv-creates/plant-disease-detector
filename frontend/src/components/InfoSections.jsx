// Reusable informational sections — farmer tips, feature grid, prevention calendar.

export function FeaturesGrid() {
  const features = [
    ['Instant', 'Photo → report in under a minute, staged progress included.'],
    ['Honest AI', 'Confidence + severity always shown; demo clearly labeled.'],
    ['Private', 'History stays on-device; export or clear anytime.'],
    ['Field-ready', 'Mobile-first, dark mode, Hindi/Marathi, printable reports.'],
  ]
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 my-6" aria-label="Highlights">
      {features.map(([title, text]) => (
        <div key={title} className="card card-hover p-5">
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{text}</p>
        </div>
      ))}
    </section>
  )
}

export function FarmerTips() {
  const tips = [
    ['Morning scouting', 'Check undersides of 10 leaves weekly — early spots are cheapest to fix.'],
    ['Water at the base', 'Wet foliage spreads blight. Drip or furrow beats overhead sprinklers.'],
    ['Tool hygiene', 'Wipe secateurs with soap water between rows to stop bacterial spread.'],
  ]
  return (
    <section className="card p-5 sm:p-6 my-6" aria-labelledby="tips-title">
      <h2 id="tips-title" className="font-display text-xl font-bold">Field tips that prevent reports</h2>
      <ul className="mt-4 grid md:grid-cols-3 gap-3">
        {tips.map(([title, text]) => (
          <li key={title} className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-bold text-sm">{title}</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function PreventionCalendar() {
  const rows = [
    ['Daily', 'Glance for wilting while watering'],
    ['Weekly', 'Scout 10 leaves + remove debris'],
    ['Monthly', 'Mulch, spacing check, tool clean'],
    ['Seasonal', 'Rotate family, choose resistant seed'],
  ]
  return (
    <section className="card p-5 sm:p-6 my-6" aria-labelledby="cal-title">
      <h2 id="cal-title" className="font-display text-xl font-bold">Prevention rhythm</h2>
      <dl className="mt-4 grid sm:grid-cols-4 gap-3">
        {rows.map(([when, what]) => (
          <div key={when} className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
            <dt className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-300">{when}</dt>
            <dd className="mt-1 text-sm">{what}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
