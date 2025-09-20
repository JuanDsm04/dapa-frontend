export interface Order {
  id: number
  submissionId: number
  userId?: number
  vehicleId?: number
  origin: string
  destination: string
  totalAmount: number
  details?: string | null
  status: string
  type: string
  date: string
}

export interface CreateOrderPayload {
  submissionId: number
  origin: string
  destination: string
  totalAmount: number
  details?: string
  status: string
  type: string
  date: string
  userId?: number
  vehicleId?: number
}

export interface UpdateOrderPayload {
  userId?: number
  vehicleId?: number
  origin?: string
  destination?: string
  totalAmount?: number
  details?: string
  status?: string
  type?: string
  date?: string
}

export interface orderFilter {
  value: string,
  label: string
}

export type BackendCargoType = 'move' | 'cargo' | 'corporate'
export type FrontendCargoType = 'mudanza' | 'flete' | 'empresarial'
