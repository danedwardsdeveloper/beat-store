import { ConfirmationStatus, UserRole } from '@prisma/client'

export interface SafeUser {
  id: string
  firstName: string
  role: UserRole
  confirmationStatus: ConfirmationStatus
}
