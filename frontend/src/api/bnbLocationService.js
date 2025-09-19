/**
 * BnB Location Service - Handles location-based grouping API calls
 * Follows the API service patterns for the platform
 */

import { axiosInstance } from './axios'

/**
 * Get listings grouped by location for Airbnb-style homepage display
 * @param {Object} params - Query parameters
 * @param {number} params.limitPerGroup - Listings per location group (default: 4)
 * @param {number} params.maxGroups - Maximum location groups (default: 6)
 * @returns {Promise<Object>} Location grouped listings response
 */
export const getListingsGroupedByLocation = async (params = {}) => {
    const { limitPerGroup = 4, maxGroups = 6 } = params
    const { data } = await axiosInstance.get('/bnb/listings/grouped-by-location', {
        params: {
            limit_per_group: limitPerGroup,
            max_groups: maxGroups
        }
    })
    return data
}

/**
 * Get listings filtered by county
 * @param {string} county - County name (e.g., 'Mombasa', 'Nairobi')
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Maximum listings to return
 * @param {number} params.offset - Offset for pagination
 * @returns {Promise<Array>} Array of listings
 */
export const getListingsByCounty = async (county, params = {}) => {
    const { limit = 20, offset = 0 } = params
    const { data } = await axiosInstance.get(`/bnb/listings/by-county/${encodeURIComponent(county)}`, {
        params: { limit, offset }
    })
    return data
}

/**
 * Get listings filtered by town
 * @param {string} town - Town name (e.g., 'Kiambu', 'Nakuru')
 * @param {Object} params - Query parameters
 * @param {string} params.county - Optional county filter
 * @param {number} params.limit - Maximum listings to return
 * @param {number} params.offset - Offset for pagination
 * @returns {Promise<Array>} Array of listings
 */
export const getListingsByTown = async (town, params = {}) => {
    const { county, limit = 20, offset = 0 } = params
    const queryParams = { limit, offset }
    if (county) queryParams.county = county
    
    const { data } = await axiosInstance.get(`/bnb/listings/by-town/${encodeURIComponent(town)}`, {
        params: queryParams
    })
    return data
}

/**
 * Get popular locations for search suggestions
 * @returns {Promise<Array>} Array of popular location names
 */
export const getPopularLocations = async () => {
    // This will be derived from the grouped listings endpoint
    const groupedData = await getListingsGroupedByLocation({ maxGroups: 10 })
    return groupedData.popular_locations || []
}

export default {
    getListingsGroupedByLocation,
    getListingsByCounty,
    getListingsByTown,
    getPopularLocations
}
