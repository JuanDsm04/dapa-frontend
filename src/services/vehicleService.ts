import type { Vehicle } from '@/types/vehicle'
import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/vehicles`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response.data
}

export const getVehicleById = async (id: number): Promise<Vehicle> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/vehicles/${id}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response.data
}

export const createVehicle = async (payload: Partial<Vehicle>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/vehicles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const updateVehicle = async (id: number, payload: Partial<Vehicle>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/vehicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const deleteVehicle = async (id: number) => {
  return handleResponse(
    await fetch(`${API_URL}/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  )
}
