const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'
const DEFAULT_TIMEOUT_MS = 60000

class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

function parseBool(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'boolean') return value
  return String(value).toLowerCase() !== 'false'
}

export async function detectDisease(imageFile, options = {}, { timeoutMs = DEFAULT_TIMEOUT_MS, retries = 1 } = {}) {
  const formData = new FormData()
  formData.append('file', imageFile)
  formData.append('provider', options.provider || 'openai')
  formData.append('include_treatment', parseBool(options.include_treatment, true))
  formData.append('include_prevention', parseBool(options.include_prevention, true))

  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/detect`, { method: 'POST', body: formData }, timeoutMs)
      if (!response.ok) {
        let detail = `Request failed (${response.status})`
        try {
          const err = await response.json()
          detail = err.detail || err.error || detail
        } catch {
          /* keep default */
        }
        throw new ApiError(detail, { status: response.status })
      }
      return await response.json()
    } catch (err) {
      lastError = err?.name === 'AbortError' ? new ApiError('Request timed out. Try a smaller image or demo mode.') : err
      if (attempt < retries) await new Promise((r) => setTimeout(r, 600 * (attempt + 1)))
    }
  }
  throw lastError
}

export async function checkHealth(timeoutMs = 8000) {
  const response = await fetchWithTimeout(`${API_BASE}/health`, {}, timeoutMs)
  if (!response.ok) throw new ApiError('Health check failed', { status: response.status })
  return response.json()
}

export async function getProviders(timeoutMs = 8000) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/providers`, {}, timeoutMs)
    if (!response.ok) throw new Error('providers failed')
    return await response.json()
  } catch {
    return { providers: [], demo_available: true, demo_mode: true, default: 'openai' }
  }
}

export async function getDiseases(timeoutMs = 8000) {
  const response = await fetchWithTimeout(`${API_BASE}/diseases`, {}, timeoutMs)
  if (!response.ok) throw new ApiError('Failed to load disease library')
  return response.json()
}

export async function sendFeedback(payload, timeoutMs = 8000) {
  const response = await fetchWithTimeout(
    `${API_BASE}/feedback`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
    timeoutMs,
  )
  if (!response.ok) throw new ApiError('Feedback failed')
  return response.json()
}

export { ApiError }
