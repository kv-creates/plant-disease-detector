export default function Footer({ onTab, backendOnline }) {
  return (
    <footer className="mt-10 border-t" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display font-bold text-lg">Plant Doctor — Plant Disease Detector</p>
          <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: 'var(--muted)' }}>
            Snap a leaf photo for instant guidance. Demo mode works offline; live vision uses
            GPT-4o or Claude 3.5 when configured. Educational support — confirm treatment locally.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-amber-500'}`} aria-hidden="true" />
            {backendOnline ? 'Backend connected' : 'Backend offline — demo mode active'}
          </p>
        </div>
        <nav aria-label="Explore">
          <p className="font-bold text-sm mb-3">Explore</p>
          <ul className="space-y-2 text-sm">
            {[['analyze', 'Analyzer'], ['library', 'Disease library'], ['how', 'How it works'], ['history', 'History'], ['faq', 'FAQ']].map(([id, label]) => (
              <li key={id}><button onClick={() => onTab(id)} className="hover:underline underline-offset-4" style={{ color: 'var(--muted)' }}>{label}</button></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-bold text-sm mb-3">Resources</p>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
            <li><a className="hover:underline underline-offset-4" href="http://localhost:8000/docs" target="_blank" rel="noreferrer">API docs</a></li>
            <li><a className="hover:underline underline-offset-4" href="https://github.com/kv-creates/plant-disease-detector" target="_blank" rel="noreferrer">GitHub repository</a></li>
            <li>OpenAI GPT-4o · Claude 3.5</li>
            <li>MIT licensed</li>
          </ul>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <p>© {new Date().getFullYear()} kv-creates · Plant Disease Detector v2.0</p>
          <p>Not a certified diagnostic device. Verify treatment with an extension officer.</p>
        </div>
      </div>
    </footer>
  )
}
