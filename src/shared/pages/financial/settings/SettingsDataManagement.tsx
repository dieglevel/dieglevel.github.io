import React from 'react'
import { Button, Card, List, Space, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  CloudSyncOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export const SettingsDataManagement: React.FC = () => {
  const { t } = useTranslation('settings')
  const [messageApi, contextHolder] = message.useMessage()

  const handleAction = (msg: string) => {
    messageApi.success(msg)
  }

  return (
    <>
      {contextHolder}
      <Card
        title={
          <Space>
            <DatabaseOutlined style={{ color: '#1677ff' }} />
            <span>{t('dataManagement.title')}</span>
          </Space>
        }
      >
        <List itemLayout="horizontal">
          <List.Item
            extra={
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  handleAction(t('dataManagement.exportStarted'))
                }
              >
                {t('dataManagement.export')}
              </Button>
            }
          >
            <List.Item.Meta
              title={t('dataManagement.exportExcel')}
              description={
                <Text type="secondary">
                  {t('dataManagement.exportExcelDescription')}
                </Text>
              }
            />
          </List.Item>

          <List.Item
            extra={
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleAction(t('dataManagement.pdfGenerated'))}
              >
                {t('dataManagement.export')}
              </Button>
            }
          >
            <List.Item.Meta
              title={t('dataManagement.exportPdf')}
              description={
                <Text type="secondary">
                  {t('dataManagement.exportPdfDescription')}
                </Text>
              }
            />
          </List.Item>

          <List.Item
            extra={
              <Button
                icon={<UploadOutlined />}
                onClick={() =>
                  handleAction(t('dataManagement.openFilePicker'))
                }
              >
                {t('dataManagement.import')}
              </Button>
            }
          >
            <List.Item.Meta
              title={t('dataManagement.importData')}
              description={
                <Text type="secondary">
                  {t('dataManagement.importDataDescription')}
                </Text>
              }
            />
          </List.Item>

          <List.Item
            extra={
              <Button
                icon={<CloudSyncOutlined />}
                onClick={() => handleAction('Backup completed successfully')}
              >
                {t('dataManagement.backup')}
              </Button>
            }
          >
            <List.Item.Meta
              title={t('dataManagement.backupRestore')}
              description={
                <Text type="secondary">
                  {t('dataManagement.backupRestoreDescription')}
                </Text>
              }
            />
          </List.Item>
        </List>
      </Card>
    </>
  )
}
