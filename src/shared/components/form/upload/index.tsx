import { Button, Flex, Image, Typography, Upload } from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import FormUploadItem from './item'
import type { UploadFile, UploadProps } from 'antd'
import './index.css'

/**
 * button    – nút "Upload" + danh sách file tuỳ biến (giao diện cũ, nhiều file)
 * thumbnail – 1 ảnh, hiện ảnh lớn, hover ra nút xem / xoá (giao diện cũ, maxCount = 1)
 * card      – lưới ô vuông (picture-card), ô "+" để thêm
 * circle    – ô tròn, hợp làm avatar
 * dragger   – vùng kéo thả
 * list      – nút nhỏ + danh sách ảnh dạng hàng (picture)
 * text      – nút nhỏ + danh sách tên file (cho tài liệu: pdf, docx...)
 */
export type FormUploadVariant =
  | 'button'
  | 'thumbnail'
  | 'card'
  | 'circle'
  | 'dragger'
  | 'list'
  | 'text'

export interface FormUploadProps extends UploadProps<File> {
  /** Mặc định: maxCount === 1 ? 'thumbnail' : 'button' (giữ tương thích code cũ) */
  variant?: FormUploadVariant
  styleItem?: React.CSSProperties
  /** Chữ trên nút / ô thêm file */
  uploadText?: string
  /** Dòng gợi ý nhỏ, vd: "PNG, JPG tối đa 5MB" */
  hint?: string
  /** Kích thước ô (px) cho card / circle / thumbnail */
  size?: number
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i

const isImageFile = (f: UploadFile<File>) =>
  !!f.type?.startsWith('image/') || IMAGE_EXT.test(f.url || f.name || '')

export default function FormUpload({
  fileList = [],
  variant,
  styleItem,
  uploadText = 'Upload',
  hint,
  size = 104,
  ...props
}: FormUploadProps) {
  const { maxCount } = props
  const mode: FormUploadVariant =
    variant ?? (maxCount === 1 ? 'thumbnail' : 'button')

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<Array<string>>([])
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const [thumbnailImage, setThumbnailImage] = useState<string>()

  const reachedLimit = !!maxCount && fileList.length >= maxCount

  // Ảnh lớn cho variant "thumbnail"
  useEffect(() => {
    if (mode !== 'thumbnail') return
    const file = fileList[0]
    if (!file) {
      setThumbnailImage(undefined)
      return
    }

    let cancelled = false
    if (file.originFileObj) {
      getBase64(file.originFileObj)
        .then((src) => !cancelled && setThumbnailImage(src))
        .catch(() => !cancelled && setThumbnailImage(undefined))
    } else {
      setThumbnailImage(file.url || file.thumbUrl)
    }
    return () => {
      cancelled = true
    }
  }, [fileList, mode])

  const handleOnPreview = async (fileChoice: UploadFile<File>) => {
    if (!isImageFile(fileChoice)) {
      // File không phải ảnh: mở tab mới nếu có url
      if (fileChoice.url) window.open(fileChoice.url, '_blank', 'noopener')
      return
    }

    const images = fileList.filter(isImageFile)
    const srcList = await Promise.all(
      images.map(async (f) =>
        f.originFileObj
          ? getBase64(f.originFileObj)
          : f.url || f.thumbUrl || '',
      ),
    )
    setCurrentPreviewIndex(
      Math.max(
        0,
        images.findIndex((f) => f.uid === fileChoice.uid),
      ),
    )
    setPreviewImage(srcList)
    setPreviewOpen(true)
  }

  const sizeStyle = useMemo(
    () => ({ '--form-upload-size': `${size}px` }) as React.CSSProperties,
    [size],
  )

  // ---------- Nội dung nút kích hoạt theo từng variant ----------
  const trigger = (() => {
    if (reachedLimit && mode !== 'dragger') return null

    switch (mode) {
      case 'card':
      case 'circle':
        return (
          <Flex vertical align="center" gap={4}>
            <PlusOutlined />
            <span>{uploadText}</span>
          </Flex>
        )
      case 'dragger':
        return (
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Kéo thả file vào đây hoặc bấm để chọn
            </p>
            {hint && <p className="ant-upload-hint">{hint}</p>}
          </>
        )
      case 'list':
      case 'text':
        return <Button icon={<UploadOutlined />}>{uploadText}</Button>
      default:
        return (
          <Button icon={<PlusOutlined />} style={{ width: '100%' }}>
            {uploadText}
          </Button>
        )
    }
  })()

  // ---------- Cấu hình riêng cho từng variant ----------
  const variantProps: UploadProps<File> = (() => {
    switch (mode) {
      case 'card':
        return { listType: 'picture-card' }
      case 'circle':
        return { listType: 'picture-circle' }
      case 'dragger':
        return { listType: 'picture' }
      case 'list':
        return { listType: 'picture' }
      case 'text':
        return { listType: 'text' }
      case 'thumbnail':
        return {
          itemRender: (_node, _file, _list, action) => (
            <div className="form-upload-thumbnail" style={styleItem}>
              <Image src={thumbnailImage} preview={false} />
              <Flex
                className="form-upload-actions"
                justify="center"
                gap={8}
                style={{ position: 'absolute', bottom: 8, left: 0, right: 0 }}
              >
                <Button onClick={action.preview} icon={<EyeOutlined />} />
                <Button onClick={action.remove} icon={<DeleteOutlined />} />
              </Flex>
            </div>
          ),
        }
      default:
        return {
          itemRender: (originNode, file, uploadFileList, action) => (
            <FormUploadItem
              originNode={originNode}
              file={file}
              uploadFileList={uploadFileList}
              action={action}
            />
          ),
        }
    }
  })()

  const commonProps: UploadProps<File> = {
    beforeUpload: () => false,
    fileList,
    onPreview: handleOnPreview,
    ...variantProps,
    ...props,
  }

  return (
    <div
      className={`form-upload form-upload--${mode}`}
      style={{ width: '100%', ...sizeStyle }}
    >
      {mode === 'dragger' ? (
        <Upload.Dragger<File> {...commonProps}>{trigger}</Upload.Dragger>
      ) : (
        <Upload<File> {...commonProps}>{trigger}</Upload>
      )}

      {hint && mode !== 'dragger' && (
        <Typography.Text type="secondary" className="form-upload-hint">
          {hint}
        </Typography.Text>
      )}

      <Image.PreviewGroup
        items={previewImage}
        preview={{
          current: currentPreviewIndex,
          onChange: setCurrentPreviewIndex,
          open: previewOpen,
          onOpenChange: setPreviewOpen,
        }}
      />
    </div>
  )
}

function getBase64(file?: File) {
  if (!file) return Promise.reject(new Error('No file provided'))

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
