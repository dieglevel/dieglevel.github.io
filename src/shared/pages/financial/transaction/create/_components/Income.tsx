import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  TreeSelect,
  Typography,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { InputWithComma } from '@/shared/components/input/utils'

const { Text, Title } = Typography

interface IncomeProps {
  selectedType: FINANCIAL_TRANSACTION_TYPE
  selectedOriginalTx?: IFinance_Transaction
  isLoadingCategories: boolean
  categories?: Array<IFinance_Category>
  calculatedTotalAmount: number
}

export default function Income({
  selectedType,
  selectedOriginalTx,
  categories,
  calculatedTotalAmount,
}: IncomeProps) {
  return (
    
  )
}
