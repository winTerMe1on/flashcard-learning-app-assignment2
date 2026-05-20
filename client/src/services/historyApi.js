import { apiRequest } from './api'

export function createHistoryRecord(historyRecord) {
  return apiRequest('/api/history', {
    method: 'POST',
    body: JSON.stringify(historyRecord),
  })
}

export function getMyHistory() {
  return apiRequest('/api/history/me')
}

export function getAdminHistory() {
  return apiRequest('/api/history/admin')
}
