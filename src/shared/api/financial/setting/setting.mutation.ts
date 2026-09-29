import { settingKeys } from './setting.keys'
import type { IFinance_Setting } from './setting.type'
import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export const useMutationFinanceSetting = () => {
  const mUpdate = useMutationPost<
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
