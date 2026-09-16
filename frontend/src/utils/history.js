const KEY = 'pdd:history:v1'
const MAX_ITEMS = 12

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : []
  } catch {
    return []
  }
}

export function saveResult(entry) {
  try {
    const current = loadHistory()
    const next = [{ ...entry, savedAt: new Date().toISOString() }, ...current].slice(0, MAX_ITEMS)
    localStorage.setItem(KEY, JSON.stringify(next))
    return next
  } catch {
    return loadHistory()
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  return []
}

export function exportHistory() {
  const data = JSON.stringify(loadHistory(), null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'plant-detector-history.json'
  a.click()
  URL.revokeObjectURL(url)
}
