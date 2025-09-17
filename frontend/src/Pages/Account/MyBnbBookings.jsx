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
import { fadeIn } from '../../Functions/GlobalAnimations'

// Hooks
import { useMyBookings, useCancelBooking } from '../../api/useBnb'

// Utils
import { formatKes } from '../../Functions/Utils'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusBadge = (status) => {
  const statusConfig = {
    confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' }
  }
  
  const config = statusConfig[status] || statusConfig.pending
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  )
}

const BookingCard = ({ booking, onCancel }) => {
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setIsCancelling(true)
      try {
        await onCancel(booking.id)
      } finally {
        setIsCancelling(false)
      }
    }
  }

  const canCancel = booking.status === 'confirmed' || booking.status === 'pending'
  const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24))

  return (
    <m.div 
      {...fadeIn} 
      className="bg-white rounded-lg shadow-lg overflow-hidden mb-6"
    >
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/3">
          <img
            src={booking.listing?.images?.[0] || "https://via.placeholder.com/400x300"}
            alt={booking.listing?.title}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="heading-6 font-serif text-darkgray mb-2">
                {booking.listing?.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {booking.listing?.address}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Booking #{booking.id}</span>
                <span>•</span>
                <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(booking.status)}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</p>
              <p className="text-sm font-medium">{formatDate(booking.check_in)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</p>
              <p className="text-sm font-medium">{formatDate(booking.check_out)}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-lightgray p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span>{formatKes(booking.nightly_rate)} × {nights} night{nights !== 1 ? 's' : ''}</span>
              <span>{formatKes(booking.subtotal)}</span>
            </div>
            {booking.service_fee > 0 && (
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Service fee</span>
                <span>{formatKes(booking.service_fee)}</span>
              </div>
            )}
            {booking.taxes > 0 && (
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Taxes</span>
                <span>{formatKes(booking.taxes)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span>{formatKes(booking.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Buttons
              ariaLabel="view booking details"
              to={`/account/bookings/${booking.id}`}
              className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase"
              themeColor="#232323"
              color="#fff"
              title="View Details"
              size="sm"
            />
            
            {booking.status === 'completed' && (
              <Buttons
                ariaLabel="write review"
                to={`/bnb/${booking.listing?.id}/review`}
                className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase"
                themeColor="#232323"
                color="#232323"
                title="Write Review"
                size="sm"
              />
            )}

            {canCancel && (
              <Buttons
                ariaLabel="cancel booking"
                onClick={handleCancel}
                disabled={isCancelling}
                className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase"
                themeColor="#dc2626"
                color="#dc2626"
                title={isCancelling ? "Cancelling..." : "Cancel"}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </m.div>
  )
}

const MyBnbBookings = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: bookings, isLoading, error, refetch } = useMyBookings()
  const cancelBooking = useCancelBooking()

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking.mutateAsync(bookingId)
      refetch() // Refresh the bookings list
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  const filteredBookings = bookings?.filter(booking => 
    statusFilter === 'all' || booking.status === statusFilter
  ) || []

  const statusCounts = bookings?.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1
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
          <div className="col-auto hidden-xs">
            <div className="header-icon">
              <div className="header-button">
                <Link aria-label="search" className="search-form-icon header-search-form" to="#search-header">
                  <i className="feather-search text-[#828282]"></i>
                </Link>
              </div>
            </div>
          </div>
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
              <h1 className="heading-2 font-serif text-[#262b35] font-semibold -tracking-[1px] mb-0">My Bookings</h1>
              <p className="text-lg mb-0">Manage your stay bookings</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row>
            <Col lg={12}>
              {/* Status Filter */}
              <div className="flex flex-wrap items-center justify-between mb-8">
                <div className="flex space-x-4">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'confirmed', label: 'Confirmed' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'completed', label: 'Completed' },
                    { key: 'cancelled', label: 'Cancelled' }
                  ].map(status => (
                    <button
                      key={status.key}
                      onClick={() => setStatusFilter(status.key)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        statusFilter === status.key
                          ? 'bg-darkgray text-white'
                          : 'bg-white text-darkgray hover:bg-lightgray'
                      }`}
                    >
                      {status.label}
                      {statusCounts[status.key] && status.key !== 'all' && (
                        <span className="ml-2 text-xs opacity-70">
                          ({statusCounts[status.key]})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-600">
                  {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-darkgray"></div>
                  <p className="mt-2 text-gray-600">Loading your bookings...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <MessageBox
                  theme="message-box01"
                  variant="error"
                  message="Failed to load your bookings. Please try again."
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

              {/* Bookings List */}
              {!isLoading && !error && (
                <>
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🏠</div>
                      <h3 className="heading-5 font-serif text-darkgray mb-4">
                        {statusFilter === 'all' ? 'No bookings yet' : `No ${statusFilter} bookings`}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {statusFilter === 'all' 
                          ? "When you book a stay, you'll see your trips here."
                          : `You don't have any ${statusFilter} bookings at the moment.`
                        }
                      </p>
                      {statusFilter === 'all' && (
                        <Buttons
                          ariaLabel="start searching"
                          to="/bnb/list"
                          className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase"
                          themeColor="#232323"
                          color="#fff"
                          title="Start searching"
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {filteredBookings.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          onCancel={handleCancelBooking}
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

export default MyBnbBookings
