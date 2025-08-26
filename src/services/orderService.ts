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

export const getOrders = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  
  return response
}

export const getOrderById = async (orderId: number) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  
  return response
}

export const updateOrder = async (orderId: number, payload: any) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })
  )
  
  return response
}

export const assignOrder = async (orderId: number, userId: number, vehicleId: number) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        userId: userId,
        vehicleId: vehicleId
      })
    })
  )
  
  return response
}