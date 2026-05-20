import { apiRequest } from './api'

export function registerUser(userDetails) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userDetails),
  })
}

export function loginUser(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser() {
  return apiRequest('/api/auth/me')
}
