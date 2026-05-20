import { apiRequest } from './api'

export function getDecks() {
  return apiRequest('/api/decks')
}

export function createDeck(deck) {
  return apiRequest('/api/decks', {
    method: 'POST',
    body: JSON.stringify(deck),
  })
}

export function updateDeck(deckId, deck) {
  return apiRequest(`/api/decks/${deckId}`, {
    method: 'PUT',
    body: JSON.stringify(deck),
  })
}

export function deleteDeck(deckId) {
  return apiRequest(`/api/decks/${deckId}`, {
    method: 'DELETE',
  })
}
