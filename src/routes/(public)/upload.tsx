import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Flex } from 'antd'
import type { UploadFile } from 'antd'
import FormUpload from '@/shared/components/form/upload'

export const Route = createFileRoute('/(public)/upload')({
  component: RouteComponent,
})

function RouteComponent() {
  const [fileList, setFileList] = useState<Array<UploadFile>>([])

  return (
    <Flex>
      <FormUpload
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList)
        }}
        fileList={fileList}
        variant="card"
        maxCount={6}
        accept="image/*"
      />
      <FormUpload
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList)
        }}
        fileList={fileList}
        variant="circle"
        maxCount={1}
        size={120}
        uploadText="Ảnh đại diện"
      />
      <FormUpload
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList)
        }}
        fileList={fileList}
        variant="dragger"
        hint="PNG, JPG tối đa 5MB"
        multiple
      />
      <FormUpload
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList)
        }}
        fileList={fileList}
        variant="text"
        accept=".pdf,.docx"
        uploadText="Chọn tài liệu"
      />
    </Flex>
  )
}
