import React, { useEffect, useMemo, useState } from 'react'

// Libraries
import { Col, Container, Row, Navbar } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import getBnbMenuData, { BnbMenuData } from '../../Components/Header/BnbMenuData'
import EnhancedBnbSearch from '../../Components/BnbSearch/EnhancedBnbSearch'
import Buttons from '../../Components/Button/Buttons'
import InteractiveBanners15 from '../../Components/InteractiveBanners/InteractiveBanners15'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import BnbBookingModal from '../../Components/BookingModal/BnbBookingModal'
import WishlistButton from '../../Components/Wishlist/WishlistButton'
import { fadeIn } from '../../Functions/GlobalAnimations'

// Hooks
import { useListings, useSearchListings } from '../../api/useBnb'

// Skeletons and States
import {
  FeaturedListingsSkeleton,
  SearchResultsSkeleton,
  EmptyListingsState,
  ErrorState
} from '../../Components/Skeletons/BnbSkeletons'

// Helpers
const formatKes = (value) => {
  if (value == null) return '—'
  try { return `KES ${Number(value).toLocaleString('en-KE')}` } catch { return `KES ${value}` }
}

const transformListingToInteractiveBanner = (listing) => ({
  img: listing.images?.[0] || 'https://via.placeholder.com/800x1113',
  title: listing.title,
  content: `${formatKes(listing.nightly_price)}/night • Sleeps ${listing.capacity}`,
  btnTitle: 'View Details',
  btnLink: `/bnb/${listing.id}`,
  customButton: (
    <div className="flex items-center space-x-2">
      <WishlistButton 
        itemId={listing.id} 
        itemType="bnb" 
        size="sm"
      />
      <BnbBookingModal
        listing={listing}
        triggerButton={
          <Buttons
            className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
            themeColor="#232323"
            color="#fff"
            title="Book Now"
          />
        }
      />
    </div>
  ),
})

const getCriteriaFromURL = (searchParams) => {
  const params = {}
  if (searchParams.get('location')) params.location = searchParams.get('location')
  if (searchParams.get('check_in')) params.check_in = searchParams.get('check_in')
  if (searchParams.get('check_out')) params.check_out = searchParams.get('check_out')
  if (searchParams.get('guests')) params.guests = parseInt(searchParams.get('guests'))
  // map both max_price and price_max → price_max (backend expects price_max)
  if (searchParams.get('price_max')) params.price_max = parseInt(searchParams.get('price_max'))
  if (!params.price_max && searchParams.get('max_price')) params.price_max = parseInt(searchParams.get('max_price'))
  // carry-through optional type/category (not used server-side yet)
  if (searchParams.get('type')) params.type = searchParams.get('type')
  if (searchParams.get('category')) params.category = searchParams.get('category')
  return Object.keys(params).length > 0 ? params : null
}

const BnbListPage = (props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [criteria, setCriteria] = useState(getCriteriaFromURL(searchParams))

  // Keep URL in sync when criteria changes (only for search mode)
  useEffect(() => {
    if (!criteria) return
    const urlParams = new URLSearchParams()
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        urlParams.set(key, String(value))
      }
    })
    setSearchParams(urlParams)
  }, [criteria, setSearchParams])

  // Initialize from URL on mount
  useEffect(() => {
    const fromURL = getCriteriaFromURL(searchParams)
    if (fromURL) setCriteria(fromURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Data fetching
  const pageSize = 20
  const listingsQuery = useListings({}, pageSize)
  const searchQuery = useSearchListings(criteria || {}, !!criteria)

  const listings = useMemo(() => {
    if (criteria) return []
    const pages = listingsQuery?.data?.pages || []
    return pages.flat()
  }, [criteria, listingsQuery?.data])

  const gridData = useMemo(() => {
    const source = criteria ? (searchQuery?.data || []) : listings
    return (source || []).map(transformListingToInteractiveBanner)
  }, [criteria, searchQuery?.data, listings])

  const isInitialLoading = criteria ? searchQuery.isLoading : listingsQuery.isLoading
  const hasError = criteria ? searchQuery.isError : listingsQuery.isError
  const errorObj = criteria ? searchQuery.error : listingsQuery.error

  const hasNextPage = !criteria && listingsQuery.hasNextPage
  const isFetchingNextPage = !criteria && listingsQuery.isFetchingNextPage
  const fetchNextPage = !criteria ? listingsQuery.fetchNextPage : null

  const clearSearch = () => {
    setCriteria(null)
    setSearchParams({})
  }

  return (
    <div style={props.style}>
      {/* Header Start */}
      <Header topSpace={{ md: true }} type="header-always-fixed">
        <HeaderNav
          theme="dark"
          fluid="fluid"
          bg="dark"
          expand="lg"
          containerClass="sm:!px-0"
          className="py-[0px] border-b border-[#ffffff1a] px-[35px] md:pr-[15px] md:pl-0 md:py-[20px] bg-[#23262d]"
        >
          <Col xs="auto" lg={2} sm={6} className="me-auto ps-lg-0">
            <Link aria-label="header logo link" className="flex items-center" to="/">
              <span className="font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
            </Link>
          </Col>
          <Navbar.Toggle className="order-last md:ml-[25px] sm:ml-[17px]">
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
          </Navbar.Toggle>
          <Navbar.Collapse className="col-auto justify-center">
            <Menu {...props} data={BnbMenuData} className="text-black" />
          </Navbar.Collapse>
        </HeaderNav>
      </Header>
      {/* Header End */}

      {/* Search */}
      <EnhancedBnbSearch onSearch={(c) => setCriteria({ ...c, price_max: c?.max_price || c?.price_max })} />

      {/* Page Title */}
      <section className="py-[40px] bg-white border-b border-mediumgray">
        <Container>
          <Row className="items-center justify-between">
            <Col><h1 className="heading-6 font-serif text-darkgray mb-0">All Stays</h1></Col>
            <Col className="text-right">
              {criteria ? (
                <Buttons
                  ariaLabel="clear search"
                  onClick={clearSearch}
                  className="font-medium font-serif uppercase btn-link after:h-[2px] after:bg-red-500"
                  color="#ef4444"
                  size="lg"
                  title="Clear Filters"
                />
              ) : null}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Grid */}
      <m.section className="py-[80px] lg:py-[60px] md:py-[50px] sm:py-[40px] bg-white" {...fadeIn}>
        {isInitialLoading ? (
          criteria ? <SearchResultsSkeleton /> : <FeaturedListingsSkeleton />
        ) : hasError ? (
          <ErrorState title="Failed to load stays" message={errorObj?.message || 'Please try again.'} />
        ) : gridData.length > 0 ? (
          <Container>
            <Row>
              <Col>
                <InteractiveBanners15
                  data={gridData}
                  grid="row-cols-1 row-cols-xl-4 row-cols-md-2 gap-y-10"
                  animation={fadeIn}
                />
              </Col>
            </Row>
            {!criteria && hasNextPage && (
              <Row className="mt-10">
                <Col className="text-center">
                  <Buttons
                    ariaLabel="load more stays"
                    onClick={() => fetchNextPage && fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                    themeColor="#232323"
                    color="#fff"
                    title={isFetchingNextPage ? 'Loading...' : 'Load More'}
                  />
                </Col>
              </Row>
            )}
          </Container>
        ) : (
          <EmptyListingsState title="No stays found" message="Try adjusting your filters or search criteria." />
        )}
      </m.section>

      {/* Footer */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
    </div>
  )
}

export default BnbListPage


