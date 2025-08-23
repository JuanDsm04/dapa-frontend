const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const getHeaders = () => {
  const token = localStorage.getItem('token') || ''
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

const handleResponse = async (res: Response) => {
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

export const getUsers = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/users`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  
  return response
}