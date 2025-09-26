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

export const getFinancialReport = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/financial`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getFinancialReportByDate = async (startDate: string, endDate: string) => {
  const queryParams = `?startDate=${startDate}&endDate=${endDate}`
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/financial/date${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getDriversReport = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/drivers`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getTotalIncomeReport = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/income`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}
