// Utilities to align Tours frontend filters with backend DTOs

// Contract
// Input filters shape (from UI state):
// { category?: string, min_price?: number, max_price?: number, rating_gte?: number,
//   free_cancellation?: boolean, instant_confirmation?: boolean, family_friendly?: boolean,
//   operator_id?: number }
// Backend list endpoint accepts: { limit, offset, operator_id?, max_price? }
// Category-specific endpoint: path param category, query supports { limit, offset, max_price? }

export const buildListParams = (filters = {}, offset = 0, limit = 20) => {
  const params = { offset, limit }

  if (typeof filters.operator_id === 'number') {
    params.operator_id = filters.operator_id
  }
  if (typeof filters.max_price === 'number') {
    params.max_price = filters.max_price
  }
  // Note: min_price, rating_gte, and boolean flags are UI-only today and not supported by backend
  return params
}

export const chooseEndpoint = (filters = {}) => {
  // When category is specified, use category-specific endpoint
  if (filters.category) return 'byCategory'
  return 'list'
}

export const extractCategory = (filters = {}) => filters.category || ''

const toursParamMapper = { buildListParams, chooseEndpoint, extractCategory }
export default toursParamMapper
