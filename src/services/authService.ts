import { API_URL } from '@/utils/api'

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  
  if (data?.data) {
    localStorage.setItem('token', data.data)
  }

  return data
}

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/api/auth/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  return await response.json()
}

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await fetch(`${API_URL}/api/auth/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  })

  const data = await response.json()
  
  return {
    ok: response.ok,
    status: response.status,
    data: data
  }
}