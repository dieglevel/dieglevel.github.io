import type { IBaseEntity } from '@/shared/types/base-entity'

export interface IProfile extends IBaseEntity {
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  avatar: Avatar | null
}

export interface Avatar extends IBaseEntity {
  url: string
}
