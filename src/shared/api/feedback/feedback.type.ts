import type { IBaseEntity } from '@/shared/types/base-entity'
import type {
  FEEDBACK_FEATURE,
  FEEDBACK_STATUS,
  FEEDBACK_TYPE,
} from './feedback.enum'
import type { IFile } from '@/shared/api/upload/file.type'

export interface IFeedback extends IBaseEntity {
  title: string
  content: string
  feature: FEEDBACK_FEATURE
  type: FEEDBACK_TYPE
  status: FEEDBACK_STATUS
  contactEmail?: string | null
  contactName?: string | null
  files?: Array<IFile>
  accountId?: number | null
  account?: {
    id: number
    username: string
    email: string
  } | null
}

export interface Feedback_Create_Request {
  title: string
  content: string
  feature: FEEDBACK_FEATURE
  type?: FEEDBACK_TYPE
  contactEmail?: string
  contactName?: string
  fileIds?: Array<number>
}

export interface Feedback_UpdateStatus_Request {
  status: FEEDBACK_STATUS
}
