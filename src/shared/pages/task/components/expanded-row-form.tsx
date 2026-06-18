import { Button, Image, Input, Typography } from 'antd'
import { memo } from 'react'
import type { ClipboardEvent } from 'react'
import type { ExpandedInputSet } from '../storage'

const { TextArea } = Input
const { Text } = Typography

interface ExpandedRowFormProps {
  rowKey: string
  inputSets: Array<ExpandedInputSet>
  note: string
  images: Array<string>
  onInputChange: (
    rowKey: string,
    index: number,
    field: 'mng' | 'be' | 'homepage',
    value: string,
  ) => void
  onAddInputSet: (rowKey: string) => void
  onRemoveInputSet: (rowKey: string) => void
  onNoteChange: (rowKey: string, value: string) => void
  onImageUpload: (rowKey: string, file: File) => void
  onImageRemove: (rowKey: string, index: number) => void
}

export const ExpandedRowForm = memo(function ExpandedRowForm({
  rowKey,
  inputSets,
  note,
  images,
  onInputChange,
  onAddInputSet,
  onRemoveInputSet,
  onNoteChange,
  onImageUpload,
  onImageRemove,
}: ExpandedRowFormProps) {
  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const clipboardFile = Array.from(event.clipboardData.items)
      .map((item) => item.getAsFile())
      .find((file): file is File =>
        Boolean(file && file.type.startsWith('image/')),
      )

    if (!clipboardFile) return

    event.preventDefault()
    event.stopPropagation()
    onImageUpload(rowKey, clipboardFile)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '12px',
      }}
      onPaste={handlePaste}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {inputSets.map((inputSet, index) => (
          <div
            key={`${rowKey}-${index}`}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
          >
            <Input
              placeholder="MNG"
              value={inputSet.mng}
              onChange={(event) => {
                onInputChange(rowKey, index, 'mng', event.target.value)
              }}
              style={{ flex: 1, minWidth: 120 }}
            />
            <Input
              placeholder="BE"
              value={inputSet.be}
              onChange={(event) => {
                onInputChange(rowKey, index, 'be', event.target.value)
              }}
              style={{ flex: 1, minWidth: 120 }}
            />
            <Input
              placeholder="HOMEPAGE"
              value={inputSet.homepage}
              onChange={(event) => {
                onInputChange(rowKey, index, 'homepage', event.target.value)
              }}
              style={{ flex: 1, minWidth: 140 }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="small"
            onClick={(event) => {
              event.stopPropagation()
              onAddInputSet(rowKey)
            }}
          >
            Add
          </Button>
          <Button
            size="small"
            danger
            onClick={(event) => {
              event.stopPropagation()
              onRemoveInputSet(rowKey)
            }}
          >
            Remove
          </Button>
        </div>
      </div>

      <TextArea
        placeholder="Enter note..."
        value={note}
        onChange={(event) => {
          onNoteChange(rowKey, event.target.value)
        }}
        rows={4}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="file"
          accept="image/*"
          onClick={(event) => {
            event.stopPropagation()
          }}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              onImageUpload(rowKey, file)
            }

            event.currentTarget.value = ''
          }}
        />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Paste an image here or use the file picker. Right-click image to
          remove.
        </Text>
        <Image.PreviewGroup>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {images.map((imageSrc, index) => (
              <div
                key={`${rowKey}-image-${index}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: 'center',
                }}
                onContextMenu={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onImageRemove(rowKey, index)
                }}
              >
                <Image
                  src={imageSrc}
                  alt={`Task upload ${index + 1}`}
                  width={180}
                  height={180}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9',
                  }}
                />
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      </div>
    </div>
  )
})
