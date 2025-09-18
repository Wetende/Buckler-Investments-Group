import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

// Skeleton for listing cards in InteractiveBanners15 format
export const ListingCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-300 h-8 w-24 rounded mt-3"></div>
    </div>
  </div>
)

// Skeleton for portfolio-style listings
export const PortfolioCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
    <div className="space-y-2 text-center">
      <div className="bg-gray-300 h-4 w-2/3 rounded mx-auto"></div>
      <div className="bg-gray-300 h-3 w-1/2 rounded mx-auto"></div>
    </div>
  </div>
)

// Featured listings section skeleton
export const FeaturedListingsSkeleton = () => (
  <Container fluid className="lg:px-[30px]">
    <Row className="row-cols-1 row-cols-xl-4 row-cols-md-2 gap-y-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <Col key={i}>
          <ListingCardSkeleton />
        </Col>
      ))}
    </Row>
  </Container>
)

// Latest listings slider skeleton
export const LatestListingsSkeleton = () => (
  <Container fluid>
    <Row>
      <Col>
        <div className="flex space-x-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[300px]">
              <PortfolioCardSkeleton />
            </div>
          ))}
        </div>
      </Col>
    </Row>
  </Container>
)

// Nearby listings skeleton
export const NearbyListingsSkeleton = () => (
  <Container>
    <Row className="justify-center">
      <Col className="text-center divider-full mb-[3rem] p-0">
        <div className="divider-border divider-light flex items-center w-full">
          <span className="font-serif font-medium text-basecolor uppercase tracking-[1px] block px-[30px]">Finding Nearby Stays...</span>
        </div>
      </Col>
    </Row>
    <Row className="row-cols-1 row-cols-xl-4 row-cols-md-2 gap-y-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <Col key={i}>
          <ListingCardSkeleton />
        </Col>
      ))}
    </Row>
  </Container>
)

// Search results skeleton
export const SearchResultsSkeleton = () => (
  <Container>
    <Row className="justify-center">
      <Col className="text-center divider-full mb-[3rem] p-0">
        <div className="divider-border divider-light flex items-center w-full">
          <span className="font-serif font-medium text-basecolor uppercase tracking-[1px] block px-[30px]">Searching...</span>
        </div>
      </Col>
    </Row>
    <Row className="row-cols-1 row-cols-xl-4 row-cols-md-2 gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <Col key={i}>
          <ListingCardSkeleton />
        </Col>
      ))}
    </Row>
  </Container>
)

// Empty state for no results
export const EmptyListingsState = ({ title = "No listings found", message = "Try adjusting your search criteria or browse our featured stays." }) => (
  <Container>
    <Row className="justify-center">
      <Col md={6} className="text-center py-16">
        <div className="text-6xl mb-4 opacity-20">🏠</div>
        <h3 className="heading-6 font-serif text-darkgray mb-4">{title}</h3>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
      </Col>
    </Row>
  </Container>
)

// Error state for failed requests
export const ErrorState = ({ title = "Something went wrong", message = "Please try again later.", onRetry = null }) => (
  <Container>
    <Row className="justify-center">
      <Col md={6} className="text-center py-16">
        <div className="text-6xl mb-4 opacity-20">⚠️</div>
        <h3 className="heading-6 font-serif text-red-600 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="font-medium font-serif uppercase btn-link after:h-[2px] after:bg-red-500 text-red-600 hover:text-red-700"
          >
            Try Again
          </button>
        )}
      </Col>
    </Row>
  </Container>
)

export default {
  ListingCardSkeleton,
  PortfolioCardSkeleton,
  FeaturedListingsSkeleton,
  LatestListingsSkeleton,
  NearbyListingsSkeleton,
  SearchResultsSkeleton,
  EmptyListingsState,
  ErrorState,
}

