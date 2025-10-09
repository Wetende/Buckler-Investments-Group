import React, { useState, useMemo } from 'react'
import { Col, Container, Row, Nav, Tab } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import Brand from '../../Components/Header/Brand'
import getBnbMenuData, { BnbMenuData } from '../../Components/Header/BnbMenuData'
import PageTitle from '../../Components/PageTitle/PageTitle'
import Buttons from '../../Components/Button/Buttons'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import { fadeIn, fadeInLeft } from '../../Functions/GlobalAnimations'

// Forms
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '../../Components/Form/Form'

// API
import { logout } from '../../api/authService'
import { useMyBookings, useCancelBooking } from '../../api/useBnb'
import { axiosPrivate } from '../../api/axios'

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
  // Add logic based on your booking status field
  if (booking.status === 'confirmed') return { text: 'Confirmed', color: 'text-green-600', bg: 'bg-green-100' }
  if (booking.status === 'pending') return { text: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' }
  if (booking.status === 'cancelled') return { text: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' }
  return { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' }
}

const Account = (props) => {
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('bookings')

  // Fetch user bookings and cancel mutation
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useMyBookings()
  const cancelBooking = useCancelBooking()

  // Separate bookings by status/date
  const { upcomingBookings, pastBookings } = useMemo(() => {
    if (!bookings) return { upcomingBookings: [], pastBookings: [] }
    
    const now = new Date()
    const upcoming = bookings.filter(b => new Date(b.check_out) >= now)
    const past = bookings.filter(b => new Date(b.check_out) < now)
    
    return { upcomingBookings: upcoming, pastBookings: past }
  }, [bookings])

  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to homepage where login modal is available
      window.location.href = '/'
    } catch (e) {
      setMessage('Logout failed')
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking.mutateAsync(bookingId)
        setMessage('Booking cancelled successfully')
      } catch (error) {
        setMessage('Failed to cancel booking. Please try again.')
      }
    }
  }

  const BookingCard = ({ booking }) => {
    const status = getBookingStatus(booking)

  return (
      <div className="bg-white p-6 rounded-lg shadow-md border mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-serif font-semibold text-lg mb-1">
              {booking.listing_title || `Booking #${booking.id}`}
            </h4>
            <p className="text-gray-600 text-sm">{booking.listing_location}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
            {status.text}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-500">Check-in</span>
            <div className="font-medium">{formatDate(booking.check_in)}</div>
          </div>
          <div>
            <span className="text-gray-500">Check-out</span>
            <div className="font-medium">{formatDate(booking.check_out)}</div>
          </div>
          <div>
            <span className="text-gray-500">Guests</span>
            <div className="font-medium">{booking.guests}</div>
          </div>
          <div>
            <span className="text-gray-500">Total</span>
            <div className="font-medium">{formatKes(booking.total_amount)}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {booking.listing_id && (
            <Buttons
              ariaLabel="view listing"
              to={`/bnb/${booking.listing_id}`}
              className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase text-xs"
              themeColor="#232323"
              color="#232323"
              title="View Listing"
              size="sm"
            />
          )}
          {booking.status !== 'cancelled' && new Date(booking.check_in) > new Date() && (
            <Buttons
              ariaLabel="cancel booking"
              className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase text-xs"
              themeColor="#ef4444"
              color="#ef4444"
              title="Cancel"
              size="sm"
              onClick={() => handleCancelBooking(booking.id)}
              disabled={cancelBooking.isLoading}
            />
          )}
        </div>
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
              <Brand
                theme="dark"
                size="default"
                className="text-white"
              />
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
        title="My Account"
        subtitle="Manage your bookings and account settings"
        bg="https://via.placeholder.com/1920x1080"
      />
      {/* Page Title End */}

      {/* Account Content Start */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          {message && (
            <Row className="mb-6">
              <Col>
                <div className="bg-lightgray p-4 rounded-lg text-center">
                  <p className="text-darkgray mb-0">{message}</p>
                </div>
              </Col>
            </Row>
          )}

          <Row>
            <Col>
              <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                {/* Tab Navigation */}
                <Nav variant="tabs" className="border-b border-gray-200 mb-8">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="bookings"
                      className={`px-6 py-3 font-serif font-medium ${
                        activeTab === 'bookings' 
                          ? 'border-b-2 border-basecolor text-basecolor' 
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      My Bookings ({bookings?.length || 0})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="profile"
                      className={`px-6 py-3 font-serif font-medium ${
                        activeTab === 'profile' 
                          ? 'border-b-2 border-basecolor text-basecolor' 
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      Profile & Security
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {/* Tab Content */}
                <Tab.Content>
                  {/* Bookings Tab */}
                  <Tab.Pane eventKey="bookings">
                    <m.div {...fadeInLeft}>
                      {bookingsLoading ? (
                        <div className="text-center py-12">
                          <div className="animate-pulse">
                            <div className="bg-gray-300 h-8 w-1/3 mx-auto mb-4 rounded"></div>
                            <div className="bg-gray-300 h-32 rounded mb-4"></div>
                            <div className="bg-gray-300 h-32 rounded"></div>
                          </div>
                        </div>
                      ) : bookingsError ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 opacity-20">⚠️</div>
                          <h3 className="heading-6 font-serif text-red-600 mb-4">Failed to load bookings</h3>
                          <p className="text-lg text-gray-600">Please try refreshing the page.</p>
                        </div>
                      ) : (bookings && bookings.length > 0) ? (
                        <>
                          {/* Upcoming Bookings */}
                          {upcomingBookings.length > 0 && (
                            <div className="mb-8">
                              <h3 className="heading-6 font-serif font-semibold text-darkgray mb-6">
                                Upcoming Trips ({upcomingBookings.length})
                              </h3>
                              {upcomingBookings.map(booking => (
                                <BookingCard key={booking.id} booking={booking} />
                              ))}
                            </div>
                          )}

                          {/* Past Bookings */}
                          {pastBookings.length > 0 && (
                            <div>
                              <h3 className="heading-6 font-serif font-semibold text-darkgray mb-6">
                                Past Trips ({pastBookings.length})
                              </h3>
                              {pastBookings.map(booking => (
                                <BookingCard key={booking.id} booking={booking} />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 opacity-20">🏠</div>
                          <h3 className="heading-6 font-serif text-darkgray mb-4">No bookings yet</h3>
                          <p className="text-lg text-gray-600 mb-6">
                            Start planning your next getaway by browsing our amazing stays.
                          </p>
                          <Buttons
                            ariaLabel="browse stays"
                            to="/bnb"
                            className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                            themeColor="#cee002"
                            color="#232323"
                            title="Browse Stays"
                          />
                        </div>
                      )}
                    </m.div>
                  </Tab.Pane>

                  {/* Profile Tab */}
                  <Tab.Pane eventKey="profile">
                    <m.div {...fadeInLeft}>
                      <Row>
                        <Col lg={8}>
                          {/* Change Password Section */}
                          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">
                              Change Password
                            </h4>
          <Formik
                              initialValues={{ old_password: '', new_password: '', confirm_password: '' }}
            validationSchema={Yup.object().shape({
                                old_password: Yup.string().required('Current password is required'),
                                new_password: Yup.string()
                                  .min(8, 'Password must be at least 8 characters')
                                  .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
                                  .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
                                  .matches(/(?=.*\d)/, 'Password must contain at least one number')
                                  .required('New password is required'),
                                confirm_password: Yup.string()
                                  .oneOf([Yup.ref('new_password')], 'Passwords must match')
                                  .required('Please confirm your password'),
            })}
            onSubmit={async (values, actions) => {
              try {
                                  await axiosPrivate.post('/auth/change-password', {
                                    old_password: values.old_password,
                                    new_password: values.new_password
                                  })
                actions.resetForm()
                setMessage('Password changed successfully')
              } catch (e) {
                                  const errorMessage = e.response?.data?.detail || 'Password change failed'
                                  actions.setStatus(errorMessage)
                                  setMessage(errorMessage)
                                }
                              }}
                            >
                              {({ isSubmitting, status }) => (
                                <Form className="space-y-4">
                                  <Input 
                                    name="old_password" 
                                    type="password" 
                                    label="Current Password"
                                    labelClass="!mb-[5px] font-medium"
                                    className="py-[12px] px-[14px] w-full border border-[#dfdfdf] rounded" 
                                  />
                                  <Input 
                                    name="new_password" 
                                    type="password" 
                                    label="New Password"
                                    labelClass="!mb-[5px] font-medium"
                                    className="py-[12px] px-[14px] w-full border border-[#dfdfdf] rounded" 
                                  />
                                  <Input 
                                    name="confirm_password" 
                                    type="password" 
                                    label="Confirm New Password"
                                    labelClass="!mb-[5px] font-medium"
                                    className="py-[12px] px-[14px] w-full border border-[#dfdfdf] rounded" 
                                  />
                                  
                                  {status && (
                                    <div className="text-red-600 text-sm">{status}</div>
                                  )}
                                  
                                  <Buttons 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase" 
                                    themeColor="#232323" 
                                    color="#fff" 
                                    title={isSubmitting ? "Updating..." : "Update Password"} 
                                  />
              </Form>
            )}
          </Formik>
                          </div>

                          {/* Account Actions */}
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">
                              Account Actions
                            </h4>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center py-3 border-b">
                                <div>
                                  <h6 className="font-medium">Become a Host</h6>
                                  <p className="text-sm text-gray-600">Start earning by listing your property</p>
                                </div>
                                <Buttons
                                  ariaLabel="become host"
                                  href={`${process.env.REACT_APP_ADMIN_BASE_URL || 'http://localhost:5173'}/dashboard/bnb-dashboard`}
                                  className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
                                  themeColor="#cee002"
                                  color="#cee002"
                                  title="Get Started"
                                  size="sm"
                                />
                              </div>
                              
                              <div className="flex justify-between items-center py-3">
                                <div>
                                  <h6 className="font-medium text-red-600">Sign Out</h6>
                                  <p className="text-sm text-gray-600">Sign out of your account</p>
                                </div>
                                <Buttons 
                                  onClick={handleLogout} 
                                  className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase" 
                                  themeColor="#ef4444" 
                                  color="#ef4444" 
                                  title="Sign Out" 
                                  size="sm"
                                />
                              </div>
        </div>
      </div>
                        </Col>
                      </Row>
                    </m.div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Account Content End */}

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}
    </div>
  )
}

export default Account


