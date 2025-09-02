import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export interface FinancialRecord {
  id?: number
  date: string
  type: 'income' | 'expense'
  amount: number
  category: string
  paymentMethod: string
  responsible: string
  description: string
}

export const getFinancialRecords = async (filters?: any): Promise<FinancialRecord[]> => {
  const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
  const response = await handleResponse(
    await fetch(`${API_URL}/api/financial-records${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const createFinancialRecord = async (payload: Partial<FinancialRecord>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/financial-records`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const updateFinancialRecord = async (id: number, payload: Partial<FinancialRecord>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/financial-records/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const deleteFinancialRecord = async (id: number) => {
  return handleResponse(
    await fetch(`${API_URL}/api/financial-records/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  )
}

export const getFinancialSummary = async (filters?: any) => {
  const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
  const response = await handleResponse(
    await fetch(`${API_URL}/api/financial-summary${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}