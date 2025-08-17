import type { Submission, SubmissionStats } from '@/types/form'
import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const createSubmission = async (payload: any) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/submissions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const getSubmissions = async (): Promise<Submission[]> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/submissions`, {
      method: 'GET',
      headers: getHeaders(),
    })
  )
  return response as Submission[]
}

export const getSubmissionStats = async (): Promise<SubmissionStats> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/submissions-stats`, {
      method: 'GET',
      headers: getHeaders(),
    })
  )
  return response as SubmissionStats
}

export const updateSubmissionStatus = async (id: number, payload: any) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/submissions/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}
