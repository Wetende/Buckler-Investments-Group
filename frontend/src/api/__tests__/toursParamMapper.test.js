import { buildListParams, chooseEndpoint, extractCategory } from '../toursParamMapper'

describe('toursParamMapper', () => {
  test('buildListParams returns offset/limit when no filters', () => {
    const params = buildListParams({}, 0, 12)
    expect(params).toEqual({ offset: 0, limit: 12 })
  })

  test('buildListParams includes max_price and operator_id only when present', () => {
    const params = buildListParams({ max_price: 25000, operator_id: 3 }, 24, 12)
    expect(params).toEqual({ offset: 24, limit: 12, max_price: 25000, operator_id: 3 })
  })

  test('buildListParams ignores unsupported UI filters (min_price, flags, rating)', () => {
    const params = buildListParams({
      min_price: 1000,
      max_price: 15000,
      rating_gte: 4.0,
      free_cancellation: true,
      instant_confirmation: true,
      family_friendly: false,
    }, 0, 20)
    expect(params).toEqual({ offset: 0, limit: 20, max_price: 15000 })
    expect(Object.keys(params)).not.toContain('min_price')
    expect(Object.keys(params)).not.toContain('rating_gte')
    expect(Object.keys(params)).not.toContain('free_cancellation')
  })

  test('chooseEndpoint picks byCategory when category present', () => {
    expect(chooseEndpoint({ category: 'wildlife-safari' })).toBe('byCategory')
    expect(chooseEndpoint({})).toBe('list')
  })

  test('extractCategory returns empty string when none', () => {
    expect(extractCategory({})).toBe('')
    expect(extractCategory({ category: 'cultural' })).toBe('cultural')
  })
})
