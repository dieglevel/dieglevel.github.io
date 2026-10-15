import type { IBaseEntity } from '@/shared/types/base-entity'
import type { FileProvider, FileType } from './file.enum'

export interface CreateUploadRequest {
  file: File
  fileType: FileType
  fileProvider?: FileProvider
}

export const createUploadFormData = (
  payload: CreateUploadRequest,
): FormData => {
  const formData = new FormData()

  formData.append('file', payload.file)
  formData.append('fileType', payload.fileType)
  if (payload.fileProvider) {
    formData.append('fileProvider', payload.fileProvider)
  }
  return formData
}

export interface IFile extends IBaseEntity {
  provider: string | null
  storagePath: string | null
  size: number | null
  fileKey: string | null
  originalName: string | null
  mimeType: string | null
  order: number | null
  metadata: string | null
  isTemporary: boolean | null
  url: string | null
}
