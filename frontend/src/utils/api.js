const API_BASE = '/api/v1'

export async function detectDisease(imageFile, options = {}) {
  const formData = new FormData()
  formData.append('file', imageFile)
  formData.append('provider', options.provider || 'openai')
  formData.append('include_treatment', options.include_treatment !== false)
  formData.append('include_prevention', options.include_prevention !== false)

  const response = await fetch(`${API_BASE}/detect`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to analyze image')
  }

  return response.json()
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`)
  if (!response.ok) {
    throw new Error('Health check failed')
  }
  return response.json()
}

export async function getProviders() {
  const response = await fetch(`${API_BASE}/providers`)
  if (!response.ok) {
    throw new Error('Failed to get providers')
  }
  return response.json()
}