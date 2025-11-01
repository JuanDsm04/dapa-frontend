import type { PerformanceGoal } from '@/types/kpi'
import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const getDriversReport = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/drivers`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getCurrentKPIs = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/kpi/current`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getKPIGoals = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/kpi/goals`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const updatePerformanceGoal = async (payload: Partial<PerformanceGoal>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/kpi/goals`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const getQuotationsPerMonth = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/completed-quotations`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getQuotationsPerStatus = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/quotations-status`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getPerformanceChart = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/drivers-performance`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getDriversParticipationChart = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/reports/drivers-participation`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}
