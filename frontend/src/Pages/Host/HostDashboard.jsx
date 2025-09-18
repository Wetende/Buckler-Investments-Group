import React from 'react'

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
import { useHostDashboard, useHostListings, useHostBookings } from '../../api/useBnb'

// Utils
import { formatKes } from '../../Functions/Utils'

const StatCard = ({ title, value, icon, change }) => (
  <m.div 
    {...fadeIn}
    className="bg-white rounded-lg shadow-lg p-6"
  >
      <div className="flex items-center justify-between">
        <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-darkgray">{value}</p>
        {change && (
          <p className={`text-sm ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {change.type === 'increase' ? '↗' : '↘'} {change.value}
          </p>
        )}
      </div>
      <div className="text-3xl text-gray-400">
        <i className={`feather-${icon}`}></i>
      </div>
    </div>
  </m.div>
)

const HostDashboard = () => {
  const { data: dashboard, isLoading: dashboardLoading } = useHostDashboard()
  const { data: listings, isLoading: listingsLoading } = useHostListings()
  const { data: bookings, isLoading: bookingsLoading } = useHostBookings()

  if (dashboardLoading) {
    return (
      <div className="bg-lightgray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-darkgray mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-lightgray">
      <Header topSpace={{ md: true }} type="reverse-scroll">
        <HeaderNav theme="light" expand="lg" menu="light" className="px-[35px] py-[0px] md:px-0">
          <Col className="col-auto col-sm-6 col-lg-2 me-auto ps-lg-0">
            <Link aria-label="header logo" className="flex items-center" to="/">
              <img className="default-logo" width="111" height="36" loading="lazy" src='/assets/img/webp/logo-black.webp' data-rjs='/assets/img/webp/logo-black@2x.webp' alt='logo' />
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
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-darkgray">
        <Container>
          <Row className="items-center justify-center">
            <Col xl={8} lg={8} md={10} className="text-center">
              <h1 className="heading-2 font-serif text-white font-semibold -tracking-[1px] mb-4">Host Dashboard</h1>
              <p className="text-lg text-gray-300 mb-6">Manage your listings and track performance</p>
              
              <div className="flex justify-center space-x-4">
                <Buttons
                  ariaLabel="add new listing"
                  to="/host/listings/new"
                  className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase"
                  themeColor="#fff"
                  color="#232323"
                  title="Add New Listing"
                />
                <Buttons
                  ariaLabel="view help"
                  to="/host/help"
                  className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase"
                  themeColor="#fff"
                  color="#fff"
                  title="Host Resources"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Dashboard Stats */}
      <section className="py-[100px] lg:py-[75px] md:py-[60px] sm:py-[50px]">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                  title="Total Earnings"
                  value={dashboard?.total_earnings ? formatKes(dashboard.total_earnings) : formatKes(0)}
                  icon="dollar-sign"
                  change={{ type: 'increase', value: '+12% this month' }}
                />
                <StatCard
                  title="Active Listings"
                  value={dashboard?.active_listings || listings?.length || 0}
                  icon="home"
                />
                <StatCard
                  title="Pending Bookings"
                  value={dashboard?.pending_bookings || 0}
                  icon="clock"
                />
                <StatCard
                  title="Average Rating"
                  value={dashboard?.average_rating ? `${dashboard.average_rating}/5` : 'N/A'}
                  icon="star"
                                  />
                                </div>

                            {/* Quick Actions */}
              <m.div {...fadeIn} className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="heading-5 font-serif text-darkgray mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Buttons
                                    ariaLabel="manage listings"
                    to="/host/listings"
                    className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase w-full"
                                    themeColor="#232323"
                                    color="#232323"
                                    title="Manage Listings"
                                  />
                                  <Buttons
                    ariaLabel="view bookings"
                    to="/host/bookings"
                    className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase w-full"
                                    themeColor="#232323"
                                    color="#232323"
                    title="View Bookings"
                  />
                        <Buttons
                    ariaLabel="earnings report"
                    to="/host/earnings"
                    className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase w-full"
                    themeColor="#232323"
                          color="#232323"
                    title="Earnings Report"
                          />
                        </div>
                    </m.div>

              {/* Recent Activity */}
              <m.div {...fadeIn} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="heading-5 font-serif text-darkgray mb-6">Recent Activity</h3>

                      {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-darkgray"></div>
                        </div>
                      ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium">{booking.listing?.title}</p>
                          <p className="text-sm text-gray-600">
                            {booking.guest_name} • {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatKes(booking.total_amount)}</p>
                          <p className="text-sm text-gray-600 capitalize">{booking.status}</p>
                        </div>
                      </div>
                            ))}
                          </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No recent bookings</p>
                        </div>
                      )}
                    </m.div>
            </Col>
          </Row>
        </Container>
      </section>

      <FooterStyle01 theme="dark" className="text-slateblue bg-[#262b35]" />
    </div>
  )
}

export default HostDashboard