import { API_URL, getHeaders, handleResponse } from '@/utils/api'

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

export const getTotalIncomeReport = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/income`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getIncomePerMonth = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/financial/monthly`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getExpensesPerMonth = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/expenses/monthly`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getExpensesPerType = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/expenses/grouped`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getOrderTypeDist = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/financial/order-type`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getFinancialControlIncome = async (startDate?: string, endDate?: string) => {
  const qp = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/financial-control-income${qp}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getFinancialControlSpending = async (startDate?: string, endDate?: string) => {
  const qp = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/financial-control-spending${qp}`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}
