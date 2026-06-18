export const getStatusColor = (status: string): string => {
  const statusLower = (status || '').toLowerCase()
  if (statusLower.includes('new') || statusLower.includes('closed'))
    return 'red'
  if (statusLower.includes('progress') || statusLower.includes('in progress')) {
    return '#1890ff'
  }
  if (statusLower.includes('feedback') || statusLower.includes('waiting')) {
    return '#c58300'
  }
  if (statusLower.includes('urgent') || statusLower.includes('critical')) {
    return '#f5222d'
  }
  if (statusLower.includes('resolved') || statusLower.includes('done')) {
    return '#52c41a'
  }
  return '#8c8c8c'
}
