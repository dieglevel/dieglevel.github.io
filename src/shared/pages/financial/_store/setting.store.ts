import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { IFinance_Setting } from '@/shared/api/financial/setting/setting.type'

interface SettingState {
  setting: IFinance_Setting | null
  set: (setting: IFinance_Setting) => void
  clear: () => void
}

export const useSettingStore = create<SettingState>()(
  devtools((set) => ({
    setting: null,
    set: (setting) => set({ setting }),
    clear: () => set({ setting: null }),
  })),
)
