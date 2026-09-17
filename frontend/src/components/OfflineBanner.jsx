export default function OfflineBanner({ online }) {
  if (online) return null
  return (
    <div className="rounded-2xl border border-amber-300 p-3 text-sm text-center" style={{ background: 'rgba(250,204,21,0.14)' }} role="status">
      Backend offline — demo engine active. Your samples still work.
    </div>
  )
}
