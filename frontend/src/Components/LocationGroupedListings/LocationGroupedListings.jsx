/**
 * LocationGroupedListings Component
 * Displays BnB listings grouped by location in Airbnb-style sections
 * Reuses existing Litho components for consistency
 */

import React from 'react'
import { m } from 'framer-motion'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Buttons from '../Button/Buttons'
import { fadeIn } from '../../Functions/GlobalAnimations'

const LocationGroupedListings = ({ 
    groups = [], 
    isLoading = false, 
    className = '' 
}) => {
    if (isLoading) {
        return <LocationGroupingSkeleton />
    }

    if (!groups || groups.length === 0) {
        return null
    }

    return (
        <div className={`location-grouped-listings ${className}`}>
            {groups.map((group, groupIndex) => (
                <m.section 
                    key={`${group.county}-${group.town}-${groupIndex}`}
                    className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] xs:py-[40px] bg-white"
                    {...{ ...fadeIn, transition: { delay: groupIndex * 0.1, duration: 0.8 } }}
                >
                    <Container>
                        <Row className="justify-center">
                            <Col lg={8} className="text-center mb-16 md:mb-12 sm:mb-8">
                                <h2 className="heading-4 font-serif font-semibold text-darkgray mb-6">
                                    {getLocationSectionTitle(group)}
                                </h2>
                                <p className="text-lg md:text-md text-gray-600">
                                    {group.listing_count} amazing stays available • 
                                    {group.town ? ` in ${group.town}, ${group.county}` : ` in ${group.county}`}
                                </p>
                            </Col>
                        </Row>
                        
                        <Row className="justify-center">
                            <Col>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {group.sample_listings.map((listing, listingIndex) => (
                                        <LocationListingCard 
                                            key={listing.id}
                                            listing={listing}
                                            animationDelay={listingIndex * 0.1}
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        
                        {group.listing_count > group.sample_listings.length && (
                            <Row className="justify-center mt-12">
                                <Col className="text-center">
                                    <Buttons
                                        to={getLocationUrl(group)}
                                        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                                        themeColor="#232323"
                                        color="#fff"
                                        title={`View all ${group.listing_count} stays`}
                                        size="lg"
                                    />
                                </Col>
                            </Row>
                        )}
                    </Container>
                </m.section>
            ))}
        </div>
    )
}

/**
 * Individual listing card component
 */
const LocationListingCard = ({ listing, animationDelay = 0 }) => {
    const listingUrl = `/rentals/${listing.id}`
    
    return (
        <m.div 
            className="location-listing-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            {...{ ...fadeIn, transition: { delay: animationDelay, duration: 0.6 } }}
        >
            <Link to={listingUrl} className="block">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    {listing.images && listing.images.length > 0 ? (
                        <img 
                            src={listing.images[0]} 
                            alt={listing.title}
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                        </div>
                    )}
                </div>
                
                <div className="p-4">
                    <h3 className="font-serif font-semibold text-lg text-darkgray mb-2 line-clamp-2">
                        {listing.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                        {listing.capacity} guest{listing.capacity !== 1 ? 's' : ''} • 
                        {listing.town ? ` ${listing.town}, ` : ' '}
                        {listing.county}
                    </p>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-lg font-semibold text-darkgray">
                                KES {Number(listing.nightly_price).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">per night</span>
                        </div>
                        
                        {listing.instant_book && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Instant Book
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </m.div>
    )
}

/**
 * Loading skeleton for location groups
 */
const LocationGroupingSkeleton = () => {
    return (
        <div className="location-grouped-listings">
            {Array.from({ length: 3 }).map((_, groupIndex) => (
                <section 
                    key={groupIndex}
                    className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] xs:py-[40px] bg-white"
                >
                    <Container>
                        <Row className="justify-center">
                            <Col lg={8} className="text-center mb-16">
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {Array.from({ length: 4 }).map((_, cardIndex) => (
                                        <div key={cardIndex} className="animate-pulse">
                                            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            ))}
        </div>
    )
}

/**
 * Helper functions
 */
const getLocationSectionTitle = (group) => {
    const weekend = isWeekend() ? ' this weekend' : ''
    const templates = [
        `Popular homes in ${group.county}`,
        `Stay in ${group.county}${weekend}`,
        `Available in ${group.county}${weekend}`,
        `Discover ${group.county}`,
    ]
    
    if (group.town) {
        templates.push(`Amazing stays in ${group.town}`)
        templates.push(`${group.town} getaways${weekend}`)
    }
    
    // Rotate titles based on group position for variety
    return templates[Math.abs(group.county.length) % templates.length]
}

const getLocationUrl = (group) => {
    if (group.town) {
        return `/bnb/list?town=${encodeURIComponent(group.town)}&county=${encodeURIComponent(group.county)}`
    }
    return `/bnb/list?county=${encodeURIComponent(group.county)}`
}

const isWeekend = () => {
    const day = new Date().getDay()
    return day === 0 || day === 6 // Sunday or Saturday
}

export default LocationGroupedListings
