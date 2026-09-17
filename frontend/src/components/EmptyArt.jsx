export default function EmptyArt({ title = "Nothing here yet", sub = "Analyze a leaf to get started." }) {
  return (
    <div className="text-center py-8">
      <svg viewBox="0 0 120 90" className="w-28 h-auto mx-auto" aria-hidden="true"><ellipse cx="60" cy="45" rx="44" ry="34" fill="#dcfce7" /><path d="M60 14C44 30 36 42 36 56a24 24 0 0 0 48 0c0-14-8-26-24-42z" fill="#16a34a" opacity="0.85" /></svg>
      <p className="font-bold mt-2">{title}</p>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>{sub}</p>
    </div>
  )
}
