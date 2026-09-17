export function toMarkdown(result) {
  const d = result?.disease
  if (!d) return "# No diagnosis"
  const lines = [`# ${d.name}`, d.scientific_name ? `_${d.scientific_name}_` : "", "", d.description, "", `- Severity: ${d.severity}`, `- Confidence: ${Math.round(d.confidence * 100)}%`, `- Area: ${d.affected_area}`, "", "## Symptoms", ...(d.symptoms || []).map((s) => `- ${s}`)]
  if (d.treatment) lines.push("", "## Treatment", d.treatment)
  if (d.prevention) lines.push("", "## Prevention", d.prevention)
  return lines.filter((x) => x !== undefined).join("\n")
}
export function download(name, text, type = "text/markdown") {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}
