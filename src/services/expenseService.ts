import type { Expense, ExpenseType } from '@/types/expense';
import { API_URL, getHeaders, handleResponse } from '@/utils/api'

export const getExpenses = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/expenses`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const getExpenseTypes = async () => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/expense-types`, {
      method: 'GET',
      headers: getHeaders()
    })
  )
  return response
}

export const createExpense = async (payload: any) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const createExpenseType = async (payload: Partial<ExpenseType>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/expense-types`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

export const updateExpense = async (id: number, payload: Partial<Expense>) => {
  const response = await handleResponse(
    await fetch(`${API_URL}/api/expenses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
  )
  return response
}

