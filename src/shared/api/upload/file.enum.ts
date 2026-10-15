import { BaseEnumHelper } from '../enum.abstract'

// ===========================================================================================
// FILE_TYPE
// ===========================================================================================
export enum FileType {
  PROFILE_AVATAR = 'profile_avatar',
  OTHER = 'other',
}

class FileTypeHelperImpl extends BaseEnumHelper<FileType> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FileType

  protected readonly colorMap: Record<FileType, string> = {
    [FileType.PROFILE_AVATAR]: '#3b82f6',
    [FileType.OTHER]: '#808080',
  }

  protected readonly labelMap: Record<FileType, string> = {
    [FileType.PROFILE_AVATAR]: 'enum.file.type.profileAvatar',
    [FileType.OTHER]: 'enum.file.type.other',
  }
}

export const FileTypeHelper = new FileTypeHelperImpl()

// ===========================================================================================
// FILE_PROVIDER
// ===========================================================================================
export enum FileProvider {
  LOCAL_DISK = 'LocalDisk',
  CLOUDINARY = 'Cloudinary',
}

class FileProviderHelperImpl extends BaseEnumHelper<FileProvider> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FileProvider

  protected readonly colorMap: Record<FileProvider, string> = {
    [FileProvider.LOCAL_DISK]: '#10b981',
    [FileProvider.CLOUDINARY]: '#3b82f6',
  }

  protected readonly labelMap: Record<FileProvider, string> = {
    [FileProvider.LOCAL_DISK]: 'enum.file.provider.localDisk',
    [FileProvider.CLOUDINARY]: 'enum.file.provider.cloudinary',
  }
}

export const FileProviderHelper = new FileProviderHelperImpl()
