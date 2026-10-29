import { BaseEnumHelper } from '../enum.abstract'

// ===========================================================================================
// FEEDBACK_FEATURE
// ===========================================================================================
export enum FEEDBACK_FEATURE {
  DASHBOARD = 'DASHBOARD',
  TRANSACTION = 'TRANSACTION',
  WALLET = 'WALLET',
  CATEGORY = 'CATEGORY',
  DEBT = 'DEBT',
  GOAL = 'GOAL',
  RECURRING = 'RECURRING',
  REPORT = 'REPORT',
  SETTING = 'SETTING',
  PROFILE = 'PROFILE',
  AUTH = 'AUTH',
  OTHER = 'OTHER',
}

class FeedbackFeatureHelperImpl extends BaseEnumHelper<FEEDBACK_FEATURE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FEEDBACK_FEATURE

  protected readonly colorMap: Record<FEEDBACK_FEATURE, string> = {
    [FEEDBACK_FEATURE.DASHBOARD]: '#3b82f6',
    [FEEDBACK_FEATURE.TRANSACTION]: '#10b981',
    [FEEDBACK_FEATURE.WALLET]: '#8b5cf6',
    [FEEDBACK_FEATURE.CATEGORY]: '#f59e0b',
    [FEEDBACK_FEATURE.DEBT]: '#ef4444',
    [FEEDBACK_FEATURE.GOAL]: '#06b6d4',
    [FEEDBACK_FEATURE.RECURRING]: '#6366f1',
    [FEEDBACK_FEATURE.REPORT]: '#ec4899',
    [FEEDBACK_FEATURE.SETTING]: '#64748b',
    [FEEDBACK_FEATURE.PROFILE]: '#14b8a6',
    [FEEDBACK_FEATURE.AUTH]: '#f97316',
    [FEEDBACK_FEATURE.OTHER]: '#808080',
  }

  protected readonly labelMap: Record<FEEDBACK_FEATURE, string> = {
    [FEEDBACK_FEATURE.DASHBOARD]: 'Tổng quan (Dashboard)',
    [FEEDBACK_FEATURE.TRANSACTION]: 'Giao dịch (Transactions)',
    [FEEDBACK_FEATURE.WALLET]: 'Ví & Tài khoản (Wallets)',
    [FEEDBACK_FEATURE.CATEGORY]: 'Danh mục thu chi (Categories)',
    [FEEDBACK_FEATURE.DEBT]: 'Sổ nợ (Debts)',
    [FEEDBACK_FEATURE.GOAL]: 'Mục tiêu tiết kiệm (Goals)',
    [FEEDBACK_FEATURE.RECURRING]: 'Giao dịch định kỳ (Recurring)',
    [FEEDBACK_FEATURE.REPORT]: 'Báo cáo & Phân tích (Reports)',
    [FEEDBACK_FEATURE.SETTING]: 'Cài đặt hệ thống (Settings)',
    [FEEDBACK_FEATURE.PROFILE]: 'Hồ sơ người dùng (Profile)',
    [FEEDBACK_FEATURE.AUTH]: 'Đăng nhập & Xác thực (Auth)',
    [FEEDBACK_FEATURE.OTHER]: 'Khác (Other)',
  }
}

export const FeedbackFeatureHelper = new FeedbackFeatureHelperImpl()

// ===========================================================================================
// FEEDBACK_TYPE
// ===========================================================================================
export enum FEEDBACK_TYPE {
  BUG = 'BUG',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  IMPROVEMENT = 'IMPROVEMENT',
  OTHER = 'OTHER',
}

class FeedbackTypeHelperImpl extends BaseEnumHelper<FEEDBACK_TYPE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FEEDBACK_TYPE

  protected readonly colorMap: Record<FEEDBACK_TYPE, string> = {
    [FEEDBACK_TYPE.BUG]: '#ef4444',
    [FEEDBACK_TYPE.FEATURE_REQUEST]: '#3b82f6',
    [FEEDBACK_TYPE.IMPROVEMENT]: '#f59e0b',
    [FEEDBACK_TYPE.OTHER]: '#808080',
  }

  protected readonly labelMap: Record<FEEDBACK_TYPE, string> = {
    [FEEDBACK_TYPE.BUG]: 'Báo lỗi hệ thống',
    [FEEDBACK_TYPE.FEATURE_REQUEST]: 'Đề xuất tính năng mới',
    [FEEDBACK_TYPE.IMPROVEMENT]: 'Góp ý cải tiến giao diện / UX',
    [FEEDBACK_TYPE.OTHER]: 'Phản hồi khác',
  }
}

export const FeedbackTypeHelper = new FeedbackTypeHelperImpl()

// ===========================================================================================
// FEEDBACK_STATUS
// ===========================================================================================
export enum FEEDBACK_STATUS {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

class FeedbackStatusHelperImpl extends BaseEnumHelper<FEEDBACK_STATUS> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FEEDBACK_STATUS

  protected readonly colorMap: Record<FEEDBACK_STATUS, string> = {
    [FEEDBACK_STATUS.PENDING]: '#faad14',
    [FEEDBACK_STATUS.IN_REVIEW]: '#1890ff',
    [FEEDBACK_STATUS.RESOLVED]: '#52c41a',
    [FEEDBACK_STATUS.REJECTED]: '#ff4d4f',
  }

  protected readonly labelMap: Record<FEEDBACK_STATUS, string> = {
    [FEEDBACK_STATUS.PENDING]: 'Chờ tiếp nhận',
    [FEEDBACK_STATUS.IN_REVIEW]: 'Đang xem xét',
    [FEEDBACK_STATUS.RESOLVED]: 'Đã giải quyết',
    [FEEDBACK_STATUS.REJECTED]: 'Từ chối',
  }
}

export const FeedbackStatusHelper = new FeedbackStatusHelperImpl()
