import { createFileRoute } from '@tanstack/react-router'
import { LanguageEnum } from '@/i18n/enum'
import { StaffOfHoma } from '@/shared/components/staff-of-homa/staff-of-homa'
import { useAuthStore } from '@/shared/auth/auth.store'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '@/shared/lib/service/local-storage'

type RouteSearch = {
  selectedMenu?: '' | 'login' | 'register'
}

export const Route = createFileRoute('/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): RouteSearch => {
    const selectedMenu = search.selectedMenu as string | undefined
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    // 1. Nếu không thuộc 'login' hoặc 'register', hoặc nếu đã đăng nhập => ép về ''
    if (
      !selectedMenu ||
      !['login', 'register'].includes(selectedMenu) ||
      isAuthenticated
    ) {
      return {
        ...search,
        selectedMenu: undefined,
      }
    }

    return {
      ...search,
      selectedMenu: selectedMenu as RouteSearch['selectedMenu'],
    }
  },
  beforeLoad: () => {
    const loadToken = AuthTokenService.loadTokens()
    useAuthStore.setState({
      accessToken: loadToken?.accessToken || null,
      refreshToken: loadToken?.refreshToken || null,
      user: loadToken?.user || null,
      isAuthenticated: !!loadToken,
    })

    const language = LocalStorageService.get<LanguageEnum>(
      LOCAL_STORAGE_KEY.LANGUAGE,
    )

    if (language) {
      LocalStorageService.set(LOCAL_STORAGE_KEY.LANGUAGE, LanguageEnum.EN)
    }
  },
})

function RouteComponent() {
  return <StaffOfHoma />
}
