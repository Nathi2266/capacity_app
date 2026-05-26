const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const TOKEN_KEY = 'capacity_app_token'

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage
}

export function getAccessToken() {
  return getStorage()?.getItem(TOKEN_KEY) || null
}

export function setAccessToken(token) {
  const storage = getStorage()
  if (!storage) return
  if (token) storage.setItem(TOKEN_KEY, token)
  else storage.removeItem(TOKEN_KEY)
}

export function clearAccessToken() {
  setAccessToken(null)
}

function normalizeRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return record
  }

  return {
    ...record,
    created_date: record.created_date ?? record.created_at,
    updated_date: record.updated_date ?? record.updated_at,
  }
}

function normalizeResponse(data) {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeRecord(item))
  }
  if (data && typeof data === 'object') {
    if (data.user) {
      return { ...data, user: normalizeRecord(data.user) }
    }
    return normalizeRecord(data)
  }
  return data
}

function toQueryString(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || key === 'sort') {
      if (key === 'sort' && value) {
        searchParams.set('sort', value)
      }
      return
    }
    searchParams.set(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

async function request(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.detail || data?.message || 'Request failed'
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return normalizeResponse(data)
}

function createEntityApi(entityName) {
  const basePath = `/${entityName.toLowerCase()}`

  return {
    list: (queryOrSort) => {
      if (typeof queryOrSort === 'string') {
        return request(`${basePath}${toQueryString({ sort: queryOrSort })}`)
      }
      return request(`${basePath}${toQueryString(queryOrSort || {})}`)
    },
    filter: (query = {}) => request(`${basePath}${toQueryString(query)}`),
    get: (id) => request(`${basePath}/${id}`),
    create: (payload) => request(`${basePath}`, { method: 'POST', body: payload }),
    update: (id, payload) => request(`${basePath}/${id}`, { method: 'PUT', body: payload }),
    delete: (id) => request(`${basePath}/${id}`, { method: 'DELETE' }),
  }
}

async function loginViaEmailPassword(email, password) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
  if (response?.access_token) {
    setAccessToken(response.access_token)
  }
  return response
}

async function register(payload) {
  const response = await request('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  })
  if (response?.access_token) {
    setAccessToken(response.access_token)
  }
  return response
}

async function me() {
  return request('/auth/me')
}

async function resetPasswordRequest(email) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: { email },
    auth: false,
  })
}

async function resetPassword({ resetToken, newPassword }) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: { token: resetToken, new_password: newPassword },
    auth: false,
  })
}

function logout() {
  clearAccessToken()
}

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.assign('/login')
  }
}

function loginWithProvider() {
  throw new Error('Google login is not supported by this backend.')
}

function verifyOtp() {
  throw new Error('OTP verification is not supported by this backend.')
}

function resendOtp() {
  throw new Error('OTP verification is not supported by this backend.')
}

function setToken(token) {
  setAccessToken(token)
}

export const base44 = {
  entities: {
    Employee: createEntityApi('employees'),
    Project: createEntityApi('projects'),
    Allocation: createEntityApi('allocations'),
    Notification: createEntityApi('notifications'),
  },
  auth: {
    loginViaEmailPassword,
    register,
    me,
    resetPasswordRequest,
    resetPassword,
    logout,
    redirectToLogin,
    loginWithProvider,
    verifyOtp,
    resendOtp,
    setToken,
  },
}

export { API_BASE_URL }
