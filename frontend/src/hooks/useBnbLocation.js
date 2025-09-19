/**
 * React Query hooks for BnB location-based data
 * Follows the React Query hooks patterns for the platform
 */

import { useQuery } from '@tanstack/react-query'
import { 
    getListingsGroupedByLocation, 
    getListingsByCounty, 
    getListingsByTown,
    getPopularLocations 
} from '../api/bnbLocationService'

/**
 * Hook to get listings grouped by location for Airbnb-style homepage
 * @param {Object} params - Query parameters
 * @param {number} params.limitPerGroup - Listings per group
 * @param {number} params.maxGroups - Maximum groups
 * @returns {Object} React Query result
 */
export const useListingsGroupedByLocation = (params = {}) => {
    return useQuery({
        queryKey: ['bnb', 'listings', 'grouped-by-location', params],
        queryFn: () => getListingsGroupedByLocation(params),
        staleTime: 5 * 60 * 1000, // 5 minutes - location data doesn't change often
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

/**
 * Hook to get listings filtered by county
 * @param {string} county - County name
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useListingsByCounty = (county, params = {}) => {
    return useQuery({
        queryKey: ['bnb', 'listings', 'by-county', county, params],
        queryFn: () => getListingsByCounty(county, params),
        enabled: !!county, // Only run if county is provided
        staleTime: 3 * 60 * 1000, // 3 minutes
    })
}

/**
 * Hook to get listings filtered by town
 * @param {string} town - Town name
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useListingsByTown = (town, params = {}) => {
    return useQuery({
        queryKey: ['bnb', 'listings', 'by-town', town, params],
        queryFn: () => getListingsByTown(town, params),
        enabled: !!town, // Only run if town is provided
        staleTime: 3 * 60 * 1000, // 3 minutes
    })
}

/**
 * Hook to get popular locations for search suggestions
 * @returns {Object} React Query result
 */
export const usePopularLocations = () => {
    return useQuery({
        queryKey: ['bnb', 'popular-locations'],
        queryFn: getPopularLocations,
        staleTime: 30 * 60 * 1000, // 30 minutes - popular locations are relatively stable
        gcTime: 60 * 60 * 1000, // 1 hour
    })
}

export default {
    useListingsGroupedByLocation,
    useListingsByCounty,
    useListingsByTown,
    usePopularLocations
}
