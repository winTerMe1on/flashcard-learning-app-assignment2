import { apiRequest } from './api'

export function getFlashcards(deckId = '') {
  const query = deckId ? `?deck=${deckId}` : ''
  return apiRequest(`/api/flashcards${query}`)
}

export function createFlashcard(flashcard) {
  return apiRequest('/api/flashcards', {
    method: 'POST',
    body: JSON.stringify(flashcard),
  })
}

export function updateFlashcard(flashcardId, flashcard) {
  return apiRequest(`/api/flashcards/${flashcardId}`, {
    method: 'PUT',
    body: JSON.stringify(flashcard),
  })
}

export function deleteFlashcard(flashcardId) {
  return apiRequest(`/api/flashcards/${flashcardId}`, {
    method: 'DELETE',
  })
}
