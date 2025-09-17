import React, { useState } from 'react'
import { Col, Container, Row, Nav, Tab } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import BnbMenuData from '../../Components/Header/BnbMenuData'
import PageTitle from '../../Components/PageTitle/PageTitle'
import Buttons from '../../Components/Button/Buttons'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import { fadeIn, fadeInLeft } from '../../Functions/GlobalAnimations'

// API Hooks
import { useHostDashboard, useHostListings, useHostBookings, useHostEarnings, useApproveBooking, useRejectBooking } from '../../api/useBnb'

// Utils
const formatKes = (value) => {
  if (value == null) return '—'
  try { return `KES ${Number(value).toLocaleString('en-KE')}` } catch { return `KES ${value}` }
}

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-KE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

const getBookingStatus = (booking) => {
  if (booking.status === 'confirmed') return { text: 'Confirmed', color: 'text-green-600', bg: 'bg-green-100' }
  if (booking.status === 'pending') return { text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' }
  if (booking.status === 'cancelled') return { text: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' }
  return { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' }
}

const HostDashboard = (props) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [earningsPeriod, setEarningsPeriod] = useState('month')

  // Fetch host data
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useHostDashboard()
  const { data: listings, isLoading: listingsLoading } = useHostListings()
  const { data: bookings, isLoading: bookingsLoading } = useHostBookings()
  const { data: earnings, isLoading: earningsLoading } = useHostEarnings(earningsPeriod)
  
  // Booking management mutations
  const approveBooking = useApproveBooking()
  const rejectBooking = useRejectBooking()

  const handleBookingAction = async (bookingId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this booking?`)) {
      try {
        if (action === 'approve') {
          await approveBooking.mutateAsync(bookingId)
        } else {
          await rejectBooking.mutateAsync(bookingId)
        }
      } catch (error) {
        console.error(`Failed to ${action} booking:`, error)
      }
    }
  }

  // Overview Cards Component
  const OverviewCard = ({ title, value, subtitle, icon, color = "text-basecolor" }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-serif font-semibold text-darkgray">{value}</h4>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`text-3xl ${color}`}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  )

  // Listing Card Component
  const ListingCard = ({ listing }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-serif font-semibold text-lg mb-1">{listing.title}</h4>
          <p className="text-gray-600 text-sm">{listing.location}</p>
          <p className="text-basecolor font-medium mt-2">{formatKes(listing.price_per_night)}/night</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {listing.status}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-500">Bookings</span>
          <div className="font-medium">{listing.total_bookings || 0}</div>
        </div>
        <div>
          <span className="text-gray-500">Guests</span>
          <div className="font-medium">Up to {listing.max_guests}</div>
        </div>
        <div>
          <span className="text-gray-500">Rating</span>
          <div className="font-medium">{listing.rating ? `${listing.rating}/5` : 'No reviews'}</div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Buttons
          ariaLabel="view listing"
          to={`/bnb/${listing.id}`}
          className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase text-xs"
          themeColor="#232323"
          color="#232323"
          title="View"
          size="sm"
        />
        <Buttons
          ariaLabel="edit listing"
          to={`/host/listings/${listing.id}`}
          className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase text-xs"
          themeColor="#cee002"
          color="#cee002"
          title="Edit"
          size="sm"
        />
      </div>
    </div>
  )

  // Recent Booking Component
  const BookingCard = ({ booking }) => {
    const status = getBookingStatus(booking)
    
    return (
      <div className="bg-white p-4 rounded-lg border mb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h5 className="font-medium text-darkgray">{booking.guest_name}</h5>
            <p className="text-sm text-gray-600">{booking.listing_title}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
            {status.text}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
          <div>
            <span>Check-in</span>
            <div className="font-medium">{formatDate(booking.check_in)}</div>
          </div>
          <div>
            <span>Guests</span>
            <div className="font-medium">{booking.guests}</div>
          </div>
          <div>
            <span>Total</span>
            <div className="font-medium">{formatKes(booking.total_amount)}</div>
          </div>
        </div>
        
        {booking.status === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Buttons
              ariaLabel="approve booking"
              onClick={() => handleBookingAction(booking.id, 'approve')}
              className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase text-xs"
              themeColor="#10b981"
              color="#fff"
              title="Approve"
              size="sm"
              disabled={approveBooking.isLoading || rejectBooking.isLoading}
            />
            <Buttons
              ariaLabel="reject booking"
              onClick={() => handleBookingAction(booking.id, 'reject')}
              className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase text-xs"
              themeColor="#ef4444"
              color="#ef4444"
              title="Reject"
              size="sm"
              disabled={approveBooking.isLoading || rejectBooking.isLoading}
            />
          </div>
        )}
      </div>
    )
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
          <Col xs="auto" lg={2} className="me-auto ps-lg-0">
            <Link aria-label="header logo link" className="flex items-center" to="/">
              <span className="font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">
                Buckler Investment Group
              </span>
            </Link>
          </Col>
          <Menu {...props} data={BnbMenuData} />
          <Col xs="auto" lg={2} className="nav-bar-contact text-end xs:hidden pe-0">
            <a aria-label="link for top" href="#top" className="text-md text-[#fff] font-serif font-medium">
              <i className="feather-phone-call mr-[15px]"></i>
              0222 8899900
            </a>
          </Col>
        </HeaderNav>
      </Header>
      {/* Header End */}

      {/* Page Title Start */}
      <PageTitle
        title="Host Dashboard"
        subtitle="Manage your listings, bookings, and earnings"
        bg="https://via.placeholder.com/1920x1080"
      />
      {/* Page Title End */}

      {/* Dashboard Content Start */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-lightgray">
        <Container>
          <Row>
            <Col>
              <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                {/* Tab Navigation */}
                <Nav variant="tabs" className="border-b border-gray-200 mb-8">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="overview"
                      className={`px-6 py-3 font-serif font-medium ${
                        activeTab === 'overview' 
                          ? 'border-b-2 border-basecolor text-basecolor' 
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="listings"
                      className={`px-6 py-3 font-serif font-medium ${
                        activeTab === 'listings' 
                          ? 'border-b-2 border-basecolor text-basecolor' 
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      My Listings ({listings?.length || 0})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="bookings"
                      className={`px-6 py-3 font-serif font-medium ${
                        activeTab === 'bookings' 
                          ? 'border-b-2 border-basecolor text-basecolor' 
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      Bookings ({bookings?.length || 0})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="earnings"
                      className={`px-6 py-3 font-serif font-medium ${
                        activeTab === 'earnings' 
                          ? 'border-b-2 border-basecolor text-basecolor' 
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      Earnings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {/* Tab Content */}
                <Tab.Content>
                  {/* Overview Tab */}
                  <Tab.Pane eventKey="overview">
                    <m.div {...fadeInLeft}>
                      {dashboardLoading ? (
                        <div className="text-center py-12">
                          <div className="animate-pulse">
                            <div className="grid grid-cols-4 gap-6 mb-8">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-gray-300 h-32 rounded"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : dashboardError ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 opacity-20">⚠️</div>
                          <h3 className="heading-6 font-serif text-red-600 mb-4">Failed to load dashboard</h3>
                          <p className="text-lg text-gray-600">Please try refreshing the page.</p>
                        </div>
                      ) : (
                        <>
                          {/* Overview Cards */}
                          <Row className="mb-8">
                            <Col lg={3} md={6} className="mb-6">
                              <OverviewCard
                                title="Total Listings"
                                value={dashboard?.total_listings || listings?.length || 0}
                                subtitle="Active properties"
                                icon="feather-home"
                                color="text-blue-600"
                              />
                            </Col>
                            <Col lg={3} md={6} className="mb-6">
                              <OverviewCard
                                title="Total Bookings"
                                value={dashboard?.total_bookings || 0}
                                subtitle="All time"
                                icon="feather-calendar"
                                color="text-green-600"
                              />
                            </Col>
                            <Col lg={3} md={6} className="mb-6">
                              <OverviewCard
                                title="Monthly Revenue"
                                value={formatKes(dashboard?.monthly_revenue || 0)}
                                subtitle="Current month"
                                icon="feather-dollar-sign"
                                color="text-basecolor"
                              />
                            </Col>
                            <Col lg={3} md={6} className="mb-6">
                              <OverviewCard
                                title="Avg Rating"
                                value={dashboard?.average_rating ? `${dashboard.average_rating.toFixed(1)}/5` : 'No reviews'}
                                subtitle="Across all listings"
                                icon="feather-star"
                                color="text-yellow-600"
                              />
                            </Col>
                          </Row>

                          <Row>
                            {/* Recent Bookings */}
                            <Col lg={8} className="mb-6">
                              <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-6">
                                  <h3 className="heading-6 font-serif font-semibold text-darkgray">
                                    Recent Bookings
                                  </h3>
                                  <Buttons
                                    ariaLabel="view all bookings"
                                    onClick={() => setActiveTab('bookings')}
                                    className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase text-xs"
                                    themeColor="#232323"
                                    color="#232323"
                                    title="View All"
                                    size="sm"
                                  />
                                </div>

                                {bookingsLoading ? (
                                  <div className="animate-pulse space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <div key={i} className="bg-gray-300 h-16 rounded"></div>
                                    ))}
                                  </div>
                                ) : bookings && bookings.length > 0 ? (
                                  bookings.slice(0, 5).map(booking => (
                                    <BookingCard key={booking.id} booking={booking} />
                                  ))
                                ) : (
                                  <div className="text-center py-8">
                                    <div className="text-4xl mb-2 opacity-20">📅</div>
                                    <p className="text-gray-600">No bookings yet</p>
                                  </div>
                                )}
                              </div>
                            </Col>

                            {/* Quick Actions */}
                            <Col lg={4} className="mb-6">
                              <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="heading-6 font-serif font-semibold text-darkgray mb-6">
                                  Quick Actions
                                </h3>
                                
                                <div className="space-y-4">
                                  <Buttons
                                    ariaLabel="create listing"
                                    to="/host/listings/new"
                                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full"
                                    themeColor="#cee002"
                                    color="#232323"
                                    title="Create New Listing"
                                  />
                                  
                                  <Buttons
                                    ariaLabel="manage listings"
                                    onClick={() => setActiveTab('listings')}
                                    className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase w-full"
                                    themeColor="#232323"
                                    color="#232323"
                                    title="Manage Listings"
                                  />
                                  
                                  <Buttons
                                    ariaLabel="view earnings"
                                    onClick={() => setActiveTab('earnings')}
                                    className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase w-full"
                                    themeColor="#232323"
                                    color="#232323"
                                    title="View Earnings"
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </>
                      )}
                    </m.div>
                  </Tab.Pane>

                  {/* Listings Tab */}
                  <Tab.Pane eventKey="listings">
                    <m.div {...fadeInLeft}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="heading-6 font-serif font-semibold text-darkgray">
                          My Listings
                        </h3>
                        <Buttons
                          ariaLabel="create listing"
                          to="/host/listings/new"
                          className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                          themeColor="#cee002"
                          color="#232323"
                          title="Create New Listing"
                        />
                      </div>

                      {listingsLoading ? (
                        <div className="animate-pulse space-y-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-gray-300 h-48 rounded"></div>
                          ))}
                        </div>
                      ) : listings && listings.length > 0 ? (
                        <Row>
                          {listings.map(listing => (
                            <Col lg={6} key={listing.id} className="mb-4">
                              <ListingCard listing={listing} />
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 opacity-20">🏠</div>
                          <h3 className="heading-6 font-serif text-darkgray mb-4">No listings yet</h3>
                          <p className="text-lg text-gray-600 mb-6">
                            Create your first listing to start hosting guests.
                          </p>
                          <Buttons
                            ariaLabel="create first listing"
                            to="/host/listings/new"
                            className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                            themeColor="#cee002"
                            color="#232323"
                            title="Create Your First Listing"
                          />
                        </div>
                      )}
                    </m.div>
                  </Tab.Pane>

                  {/* Bookings Tab */}
                  <Tab.Pane eventKey="bookings">
                    <m.div {...fadeInLeft}>
                      <h3 className="heading-6 font-serif font-semibold text-darkgray mb-6">
                        All Bookings
                      </h3>

                      {bookingsLoading ? (
                        <div className="animate-pulse space-y-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-gray-300 h-24 rounded"></div>
                          ))}
                        </div>
                      ) : bookings && bookings.length > 0 ? (
                        bookings.map(booking => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 opacity-20">📅</div>
                          <h3 className="heading-6 font-serif text-darkgray mb-4">No bookings yet</h3>
                          <p className="text-lg text-gray-600">
                            Bookings from your listings will appear here.
                          </p>
                        </div>
                      )}
                    </m.div>
                  </Tab.Pane>

                  {/* Earnings Tab */}
                  <Tab.Pane eventKey="earnings">
                    <m.div {...fadeInLeft}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="heading-6 font-serif font-semibold text-darkgray">
                          Earnings
                        </h3>
                        <select 
                          value={earningsPeriod} 
                          onChange={(e) => setEarningsPeriod(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded"
                        >
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="year">This Year</option>
                        </select>
                      </div>

                      {earningsLoading ? (
                        <div className="animate-pulse">
                          <div className="bg-gray-300 h-64 rounded mb-6"></div>
                          <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="bg-gray-300 h-24 rounded"></div>
                            ))}
                          </div>
                        </div>
                      ) : earnings ? (
                        <>
                          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h4 className="font-serif font-semibold text-2xl text-center text-basecolor">
                              {formatKes(earnings.total_earnings || 0)}
                            </h4>
                            <p className="text-center text-gray-600 mt-2">
                              Total earnings for {earningsPeriod === 'week' ? 'this week' : earningsPeriod === 'month' ? 'this month' : 'this year'}
                            </p>
                          </div>

                          <Row>
                            <Col md={4} className="mb-4">
                              <OverviewCard
                                title="Gross Revenue"
                                value={formatKes(earnings.gross_revenue || 0)}
                                icon="feather-trending-up"
                                color="text-green-600"
                              />
                            </Col>
                            <Col md={4} className="mb-4">
                              <OverviewCard
                                title="Service Fees"
                                value={formatKes(earnings.service_fees || 0)}
                                icon="feather-percent"
                                color="text-red-600"
                              />
                            </Col>
                            <Col md={4} className="mb-4">
                              <OverviewCard
                                title="Net Earnings"
                                value={formatKes(earnings.net_earnings || 0)}
                                icon="feather-dollar-sign"
                                color="text-basecolor"
                              />
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 opacity-20">💰</div>
                          <h3 className="heading-6 font-serif text-darkgray mb-4">No earnings data</h3>
                          <p className="text-lg text-gray-600">
                            Start hosting to see your earnings here.
                          </p>
                        </div>
                      )}
                    </m.div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Dashboard Content End */}

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}
    </div>
  )
}

export default HostDashboard
