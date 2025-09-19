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
    await fetch(`${API_URL}/api/form/submissions`, {
      method: 'GET',
      headers: getHeaders(),
    })
  )
  return response.data as Submission[]
}

export const getSubmissionById = async (id: number): Promise<Submission> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/form/submissions/${id}`,{
      method: 'GET',
      headers: getHeaders(),
    })
  )

  return response.data as Submission
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

export const acceptSubmission = async (id: number, payload: any ) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const rejectSubmission = async (id: number) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/form/submissions/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'cancelled' }),
    })
  )
  return response
}
