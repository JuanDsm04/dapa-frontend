import type { Question } from '@/types/form'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const getHeaders = () => {
  const token = localStorage.getItem('token') || ''
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorText = await res.text()
    let errorMessage = res.statusText
    
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.message || errorData.error || errorText
    } catch {
      errorMessage = errorText || res.statusText
    }
    
    throw new Error(errorMessage)
  }
  return res.json()
}

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