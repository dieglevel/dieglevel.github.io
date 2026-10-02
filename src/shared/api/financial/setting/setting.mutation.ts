import { settingKeys } from './setting.keys'
import type { IFinance_Setting } from './setting.type'
import { useMutationPatch } from '@/shared/lib/api/mutation/useMutation'

export const useMutationFinanceSetting = () => {
  const mUpdate = useMutationPatch<
    void,
    Partial<Omit<IFinance_Setting, 'id' | 'created_at'>>,
    'financial-setting'
  >({
    endPoint: 'financial-setting',
    queryKey: [settingKeys.get()],
  })

  return {
    mUpdate,
  }
}
