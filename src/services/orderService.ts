import type { Order, CreateOrderPayload, UpdateOrderPayload } from '@/types/order'
import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const getOrders = async (status?: string): Promise<Order[]> => {
    const url = new URL(`${API_URL}/api/orders`)
    if (status) {
      url.searchParams.append('status', status)
    }

    const response = await handleResponse(
      await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders()
      })
    )

    return response.data
}

export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response.data
}

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const updateOrder = async (orderId: number, payload: UpdateOrderPayload): Promise<Order> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })
  )
  return response
}

export const changeOrderStatus = async (orderId: number, status: string): Promise<void> => {
  return handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({status: status})
    })
  )
}

export const deleteOrder = async (orderId: number): Promise<void> => {
  return handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  )
}

export const assignOrder = async (orderId: number, userId: number, vehicleId: number): Promise<Order> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}/assign`, {
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

export interface OrderTracking {
  origin: string
  destination: string
  status: string
  type: string
}

export const trackOrder = async (token: string): Promise<OrderTracking> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/track?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  )
  return response.data
}

export const getOrderToken = async (orderId: number): Promise<string> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders/${orderId}/token`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response.data.token
}