import React, { useState } from 'react'

// Libraries
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import HeaderData from '../../Components/Header/HeaderData'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import Buttons from '../../Components/Button/Buttons'
import MessageBox from '../../Components/MessageBox/MessageBox'
import InteractiveBanners15 from '../../Components/InteractiveBanners/InteractiveBanners15'
import WishlistButton from '../../Components/Wishlist/WishlistButton'
import { fadeIn } from '../../Functions/GlobalAnimations'

// Hooks
import { useFavorites } from '../../api/useFavorites'
import { useListing } from '../../api/useBnb'

// Utils
import { formatKes } from '../../Functions/Utils'

const WishlistItem = ({ favorite }) => {
  const { data: listing, isLoading } = useListing(favorite.item_id)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return null
  }

  return (
    <m.div 
      {...fadeIn}
      className="bg-white rounded-lg shadow-lg overflow-hidden relative group"
    >
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton 
          itemId={listing.id} 
          itemType="bnb" 
          size="md"
        />
      </div>

      {/* Image */}
      <div className="relative overflow-hidden">
        <Link to={`/bnb/${listing.id}`}>
          <img
            src={listing.images?.[0] || "https://via.placeholder.com/400x300"}
            alt={listing.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/bnb/${listing.id}`} className="block">
          <h3 className="heading-6 font-serif text-darkgray mb-2 hover:text-gray-600 transition-colors">
            {listing.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {listing.address}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium text-darkgray">
              {formatKes(listing.nightly_price)}
            </span>
            <span className="text-sm text-gray-600 ml-1">/night</span>
          </div>
          
          <div className="text-sm text-gray-600">
            Sleeps {listing.capacity}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <Buttons
            ariaLabel="view details"
            to={`/bnb/${listing.id}`}
            className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase flex-1"
            themeColor="#232323"
            color="#fff"
            title="View Details"
            size="sm"
          />
        </div>
      </div>
    </m.div>
  )
}

const Wishlist = () => {
  const [filterType, setFilterType] = useState('all')
  const { data: favorites, isLoading, error, refetch } = useFavorites()

  const filteredFavorites = favorites?.filter(favorite => 
    filterType === 'all' || favorite.item_type === filterType
  ) || []

  const favoritesByType = favorites?.reduce((acc, favorite) => {
    acc[favorite.item_type] = (acc[favorite.item_type] || 0) + 1
    return acc
  }, {}) || {}

  return (
    <div className="bg-lightgray">
      <Header topSpace={{ md: true }} type="reverse-scroll">
        <HeaderNav theme="light" expand="lg" menu="light" className="px-[35px] py-[0px] md:px-0">
          <Col className="col-auto col-sm-6 col-lg-2 me-auto ps-lg-0">
            <Link aria-label="header logo" className="flex items-center" to="/">
              <img className="default-logo" width="111" height="36" loading="lazy" src='/assets/img/webp/logo-black.webp' data-rjs='/assets/img/webp/logo-black@2x.webp' alt='logo' />
              <img className="alt-logo" width="111" height="36" loading="lazy" src='/assets/img/webp/logo-black.webp' data-rjs='/assets/img/webp/logo-black@2x.webp' alt='logo' />
              <img className="mobile-logo" width="111" height="36" loading="lazy" src='/assets/img/webp/logo-black.webp' data-rjs='/assets/img/webp/logo-black@2x.webp' alt='logo' />
            </Link>
          </Col>
          <div className="col-auto">
            <div className="header-icon">
              <div className="header-button">
                <Link aria-label="account" to="/account">
                  <i className="feather-user text-[#828282]"></i>
                </Link>
              </div>
            </div>
          </div>
          <Menu {...HeaderData} />
        </HeaderNav>
      </Header>

      {/* Page Header */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-cover cover-background" style={{backgroundImage: "url('/assets/img/webp/architect-header-img.webp')"}}>
        <Container>
          <Row className="items-center justify-center">
            <Col xl={6} lg={6} md={8} className="text-center">
              <h1 className="heading-2 font-serif text-[#262b35] font-semibold -tracking-[1px] mb-0">My Wishlist</h1>
              <p className="text-lg mb-0">Your saved favorites</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row>
            <Col lg={12}>
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between mb-8">
                <div className="flex space-x-4">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'bnb', label: 'Stays' },
                    { key: 'tours', label: 'Tours' },
                    { key: 'cars', label: 'Cars' },
                    { key: 'property', label: 'Properties' }
                  ].map(type => (
                    <button
                      key={type.key}
                      onClick={() => setFilterType(type.key)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        filterType === type.key
                          ? 'bg-darkgray text-white'
                          : 'bg-white text-darkgray hover:bg-lightgray'
                      }`}
                    >
                      {type.label}
                      {favoritesByType[type.key] && type.key !== 'all' && (
                        <span className="ml-2 text-xs opacity-70">
                          ({favoritesByType[type.key]})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-600">
                  {filteredFavorites.length} item{filteredFavorites.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-darkgray"></div>
                  <p className="mt-2 text-gray-600">Loading your wishlist...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <MessageBox
                  theme="message-box01"
                  variant="error"
                  message="Failed to load your wishlist. Please try again."
                  action={
                    <Buttons
                      onClick={() => refetch()}
                      className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase mt-4"
                      themeColor="#232323"
                      color="#fff"
                      title="Retry"
                      size="sm"
                    />
                  }
                />
              )}

              {/* Wishlist Grid */}
              {!isLoading && !error && (
                <>
                  {filteredFavorites.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💝</div>
                      <h3 className="heading-5 font-serif text-darkgray mb-4">
                        {filterType === 'all' ? 'Your wishlist is empty' : `No ${filterType} favorites`}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {filterType === 'all' 
                          ? "Start exploring and save your favorite places!"
                          : `You haven't saved any ${filterType} items yet.`
                        }
                      </p>
                      {filterType === 'all' && (
                        <div className="space-x-4">
                          <Buttons
                            ariaLabel="browse stays"
                            to="/bnb/list"
                            className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase"
                            themeColor="#232323"
                            color="#fff"
                            title="Browse Stays"
                          />
                          <Buttons
                            ariaLabel="browse tours"
                            to="/tours"
                            className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase"
                            themeColor="#232323"
                            color="#232323"
                            title="Browse Tours"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredFavorites.map((favorite) => (
                        <WishlistItem
                          key={`${favorite.item_type}-${favorite.item_id}`}
                          favorite={favorite}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <FooterStyle01 theme="dark" className="text-slateblue bg-[#262b35]" />
    </div>
  )
}

export default Wishlist
