import type { Question } from '@/types/form'
import { getHeaders, handleResponse, API_URL } from '@/utils/api'

export const getQuestions = async (): Promise<Question[]> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/questions`, { 
      headers: getHeaders() 
    })
  )
  
  return response
}

export const getActiveQuestions = async (): Promise<Question[]> => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/questions-active`, { 
      headers: getHeaders() 
    })
  )
  
  return response
}

export const createQuestion = async (payload: any) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })
  )
  
  return response
}

export const updateQuestion = async (id: number, payload: any) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/questions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })
  )
  
  return response
}

export const deleteQuestion = async (id: number) => {
  return handleResponse(
    await fetch(`${API_URL}/api/questions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
  )
}

export const getQuestionTypes = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/question-types`, { 
      headers: getHeaders() 
    })
  )
  
  return response || []
}

export const createQuestionOption = async (questionId: number, option: string) => {
  return handleResponse(
    await fetch(`${API_URL}/api/questions/${questionId}/options`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ option })
    })
  )
}

export const toggleActiveQuestion = async (questionId: number) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/questions/${questionId}/active`, {
      method: 'PATCH',
      headers: getHeaders()
    })
  )

  return response
}

export const reorderQuestions = async (questionSourceId: number, questionTargetId: number) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/questions/reorder`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ sourceId: questionSourceId, targetId: questionTargetId })
    })
  )

  return response
}