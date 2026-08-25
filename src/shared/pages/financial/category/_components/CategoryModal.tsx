import { useEffect } from 'react'
import {
  Flex,
  Form,
  Input,
  InputNumber,
  Tag,
  TreeSelect,
  Typography,
} from 'antd'

import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import type { ExtendedFinanceCategory } from '..'
import type { FINANCIAL_CATEGORY_SPENDING_NATURE } from '@/shared/api/financial/category/category.enum'
import ColorPicker from '@/shared/components/color-picker'
import { IconPicker } from '@/shared/components/icon-picker'
import { InputWithComma } from '@/shared/components/input/utils'
import Select from '@/shared/components/select'
import {
  FINANCIAL_CATEGORY_TYPE,
  FinancialCategorySpendingNatureHelper,
  FinancialCategoryTypeHelper,
} from '@/shared/api/financial/category/category.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import BaseModal from '@/shared/components/modal'

const { Text } = Typography

interface CategoryModalProps {
  open: boolean
  mode: 'add' | 'edit'
  category?: IFinance_Category | null
  defaultParentId?: number | null
  categories: Array<ExtendedFinanceCategory>
  onCancel: () => void
  onSubmit: (data: Omit<IFinance_Category, 'id'>) => Promise<void>
}

export default function CategoryModal({
  open,
  mode,
  category,
  defaultParentId,
  categories,
  onCancel,
  onSubmit,
}: CategoryModalProps) {
  const [form] = Form.useForm<IFinance_Category>()
  const watchColor = Form.useWatch('color', form)

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && category) {
      form.setFieldsValue({
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        monthlyBudget: category.monthlyBudget,
        parentId: category.parentId,
        spendingNature: category.spendingNature,
        archived: category.archived,
      })
    } else if (mode === 'add' && category) {
      form.setFieldsValue({
        color: '#1677ff',
        type: FINANCIAL_CATEGORY_TYPE.EXPENSE,
        spendingNature:
          FinancialCategorySpendingNatureHelper.getOptions()[0].value,
        monthlyBudget: undefined,
        parentId: category.id,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        color: '#1677ff',
        type: FINANCIAL_CATEGORY_TYPE.EXPENSE,
        spendingNature:
          FinancialCategorySpendingNatureHelper.getOptions()[0].value,
        monthlyBudget: undefined,
        parentId: defaultParentId || null,
      })
    }
  }, [category, defaultParentId, form, mode, open])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit({
      ...values,
      parentId: values.parentId || null,
    })
    form.resetFields()
  }

  return (
    <BaseModal
      open={open}
      title={mode === 'add' ? 'Add Category' : 'Edit Category'}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
    >
      <Form form={form} layout="vertical">
        {/* Category Name */}
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter category name',
            },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        {/* Parent Category Select */}
        <Form.Item label="Parent Category" name="parentId">
          <TreeSelect
            allowClear
            showSearch={{
              filterTreeNode: (input, treeNode) =>
                treeNode.name.toLowerCase().includes(input.toLowerCase()),
            }}
            style={{ width: '100%' }}
            placeholder="None (Root Category)"
            treeData={categories}
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'children',
            }}
            treeTitleRender={(data) => {
              return (
                <Flex align="center" gap={8} justify="space-between">
                  <Flex gap={8} align="center">
                    <IconRenderer
                      iconName={data.icon}
                      size={16}
                      color={data.color}
                    />
                    <Text>{data.name}</Text>
                  </Flex>

                  <Flex gap={8}>
                    <Tag
                      color={FinancialCategorySpendingNatureHelper.getColor(
                        data.spendingNature,
                      )}
                      style={{ fontSize: '12px' }}
                    >
                      {FinancialCategorySpendingNatureHelper.getLabel(
                        data.spendingNature,
                      )}
                    </Tag>
                    <Tag
                      color={FinancialCategoryTypeHelper.getColor(data.type)}
                      style={{ fontSize: '12px' }}
                    >
                      {FinancialCategoryTypeHelper.getLabel(data.type)}
                    </Tag>
                  </Flex>
                </Flex>
              )
            }}
            treeDefaultExpandAll
          />
        </Form.Item>

        {/* Budget & Icon */}
        <Flex gap={16} align="center">
          <Form.Item
            label="Monthly Budget"
            name="monthlyBudget"
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              style={{ width: '100%', flex: 1 }}
              {...InputWithComma}
              suffix={'VND'}
            />
          </Form.Item>

          <Form.Item label="Icon" name="icon" required>
            <IconPicker color={watchColor} />
          </Form.Item>
        </Flex>

        {/* Color Picker */}
        <Form.Item label="Color" shouldUpdate required>
          <Form.Item noStyle name="color">
            <ColorPicker />
          </Form.Item>
        </Form.Item>

        {/* Hidden Fields */}
        <Form.Item hidden name="totalSpent">
          <InputNumber />
        </Form.Item>

        <Form.Item name="archived" hidden>
          <Input />
        </Form.Item>

        <Flex gap={16} align="center" flex={1}>
          <Form.Item label="Type" name="type" required style={{ flex: 1 }}>
            <Select
              options={FinancialCategoryTypeHelper.getOptions()}
              labelRender={(data) => {
                const value = data.value as FINANCIAL_CATEGORY_TYPE
                return (
                  <Tag color={FinancialCategoryTypeHelper.getColor(value)}>
                    {FinancialCategoryTypeHelper.getLabel(value)}
                  </Tag>
                )
              }}
              optionRender={(data) => {
                const value = data.value as FINANCIAL_CATEGORY_TYPE
                return (
                  <Tag color={FinancialCategoryTypeHelper.getColor(value)}>
                    {FinancialCategoryTypeHelper.getLabel(value)}
                  </Tag>
                )
              }}
            />
          </Form.Item>

          <Form.Item
            label="Spending Nature"
            name="spendingNature"
            required
            style={{ flex: 1 }}
          >
            <Select
              options={FinancialCategorySpendingNatureHelper.getOptions()}
              labelRender={(data) => {
                const value = data.value as FINANCIAL_CATEGORY_SPENDING_NATURE
                return (
                  <Tag
                    color={FinancialCategorySpendingNatureHelper.getColor(
                      value,
                    )}
                  >
                    {FinancialCategorySpendingNatureHelper.getLabel(value)}
                  </Tag>
                )
              }}
              optionRender={(data) => {
                const value = data.value as FINANCIAL_CATEGORY_SPENDING_NATURE
                return (
                  <Tag
                    color={FinancialCategorySpendingNatureHelper.getColor(
                      value,
                    )}
                  >
                    {FinancialCategorySpendingNatureHelper.getLabel(value)}
                  </Tag>
                )
              }}
            />
          </Form.Item>
        </Flex>

        <Text type="secondary">
          Selected icon will automatically update its background color based on
          the chosen color.
        </Text>
      </Form>
    </BaseModal>
  )
}
