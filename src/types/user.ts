export interface User {
  id: number
  name: string
  lastName: string
  email: string
  phone: string
  password?: string
  role?: string
  licenseExpirationDate: string
  isActive: boolean
}
