const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || `Request failed (${response.status})`)
  }

  return result
}
