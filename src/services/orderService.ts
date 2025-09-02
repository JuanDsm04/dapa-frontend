import type { Order } from '@/types/order'
import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const getOrders = async (): Promise<Order[]> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const createOrder = async (payload: Partial<Order>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
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

export const deleteOrder = async (orderId: number) => {
  return handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  )
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