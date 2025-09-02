import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const getPerformanceData = async (filters?: any) => {
  const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/performance${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getQuotesPerformance = async (filters?: any) => {
  const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/quotes-performance${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getEmployeePerformance = async (filters?: any) => {
  const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/employee-performance${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}