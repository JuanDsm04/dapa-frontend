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
