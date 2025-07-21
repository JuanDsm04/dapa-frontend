export interface Question{
  id: string
  text: string
  type: 'text' | 'multiple' | 'dropdown' | 'unique'
  options?: string[]
  active: boolean
}