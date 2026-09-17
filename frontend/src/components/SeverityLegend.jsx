const ROWS = [["mild", "Watch + cultural care"], ["moderate", "Act this week"], ["severe", "Act now + expert"]]
export default function SeverityLegend() {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Severity legend">
      {ROWS.map(([k, v]) => (<span key={k} className="chip" title={v}><span className={`severity-badge severity-${k}`}>{k}</span><span>{v}</span></span>))}
    </div>
  )
}
