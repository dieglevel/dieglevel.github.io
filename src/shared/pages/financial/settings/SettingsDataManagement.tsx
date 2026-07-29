import React from 'react'
import { Button, Card, List, Space, Typography, message } from 'antd'
import {
  CloudSyncOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export const SettingsDataManagement: React.FC = () => {
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
            <span>Data Management</span>
          </Space>
        }
      >
        <List itemLayout="horizontal">
          <List.Item
            extra={
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  handleAction('Export started — file will download shortly')
                }
              >
                Export
              </Button>
            }
          >
            <List.Item.Meta
              title="Export to Excel"
              description={
                <Text type="secondary">Download all transactions as .xlsx</Text>
              }
            />
          </List.Item>

          <List.Item
            extra={
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleAction('PDF report generated')}
              >
                Export
              </Button>
            }
          >
            <List.Item.Meta
              title="Export to PDF"
              description={
                <Text type="secondary">
                  Download a formatted financial report
                </Text>
              }
            />
          </List.Item>

          <List.Item
            extra={
              <Button
                icon={<UploadOutlined />}
                onClick={() =>
                  handleAction('Open your file picker to import data')
                }
              >
                Import
              </Button>
            }
          >
            <List.Item.Meta
              title="Import Data"
              description={
                <Text type="secondary">Upload transactions from bank CSV</Text>
              }
            />
          </List.Item>

          <List.Item
            extra={
              <Button
                icon={<CloudSyncOutlined />}
                onClick={() => handleAction('Backup completed successfully')}
              >
                Backup
              </Button>
            }
          >
            <List.Item.Meta
              title="Backup & Restore"
              description={
                <Text type="secondary">Last backup: Jul 13, 2025 at 09:14</Text>
              }
            />
          </List.Item>
        </List>
      </Card>
    </>
  )
}
