export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const getHeaders = () => {
  const token = localStorage.getItem('token') || ''
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorText = await res.text()
    let errorMessage = res.statusText
    
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.message || errorData.error || errorText
    } catch {
      errorMessage = errorText || res.statusText
    }
    
    throw new Error(errorMessage)
  }
  return res.json()
}