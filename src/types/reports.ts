export interface Income {
  date: Date
  totalAmount: number
  type: string
  user: string
}

export interface DriverReport {
  driverName: string
  totalOrders: number
  ordersPerWeek: number
}

export interface GraphData {
  series: string[]
  categories: string[]
}
