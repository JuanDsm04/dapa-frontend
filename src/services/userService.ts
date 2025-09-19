import type { User } from '@/types/user'
import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const getUsers = async (): Promise<User[]> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/users`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response.data
}

export const getUserById = async (id: number): Promise<User> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/users/${id}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const createUser = async (payload: Partial<User>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const updateUser = async (id: number, payload: Partial<User>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const deleteUser = async (id: number) => {
  return handleResponse(
    await fetch(`${API_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  )
}