import { BaseEnumHelper } from '@/shared/api/enum.abstract'

export enum LanguageEnum {
  EN = 'en',
  VI = 'vi',
  KO = 'ko',
}

class LanguageHelperImpl extends BaseEnumHelper<LanguageEnum> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = LanguageEnum

  protected readonly colorMap: Record<LanguageEnum, string> = {
    [LanguageEnum.EN]: '#10b981',
    [LanguageEnum.VI]: '#f59e0b',
    [LanguageEnum.KO]: '#3b82f6',
  }

  // Khai báo labelMap để thỏa mãn abstract member từ lớp BaseEnumHelper
  protected readonly labelMap: Record<LanguageEnum, string> = {
    [LanguageEnum.EN]: 'English',
    [LanguageEnum.VI]: 'Tiếng Việt',
    [LanguageEnum.KO]: '한국어',
  }

  public getColor(value: LanguageEnum): string {
    return this.colorMap[value]
  }

  public override getLabel(
    value: LanguageEnum,
    lang: LanguageEnum = LanguageEnum.VI,
  ): string {
    return this.labelMap[value]
  }
}

export const LanguageHelper = new LanguageHelperImpl()
