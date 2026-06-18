import type { Example_Status_Enum } from './example.enum'

// I<Entity>
export interface IExample {
  id: number
  name: string
  email: string
  isActive: boolean
  roles: Array<string>
  metadata: null
  status: Example_Status_Enum
}
