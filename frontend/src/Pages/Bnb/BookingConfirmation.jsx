import React, { useEffect } from 'react'

// Libraries
import { Col, Container, Row, Navbar } from 'react-bootstrap'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import { BnbMenuData } from '../../Components/Header/BnbMenuData'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import Buttons from '../../Components/Button/Buttons'
import MessageBox from '../../Components/MessageBox/MessageBox'
import { fadeIn } from '../../Functions/GlobalAnimations'

// Hooks
import { useBooking } from '../../api/useBnb'

// Utils
import { formatKes } from '../../Functions/Utils'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const BookingConfirmation = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { data: booking, isLoading, error } = useBooking(bookingId)

  useEffect(() => {
    if (!bookingId) {
      navigate('/account/bnb-bookings')
    }
  }, [bookingId, navigate])

  if (isLoading) {
    return (
      <div className="bg-lightgray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-darkgray mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="bg-lightgray min-h-screen">
        {/* Header with Center Navigation */}
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
                <Navbar.Brand className="inline-block p-0 m-0">
                  <span className="default-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                  <span className="alt-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                  <span className="mobile-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler</span>
                </Navbar.Brand>
              </Link>
            </Col>
            <Navbar.Toggle className="order-last md:ml-[25px] sm:ml-[17px]">
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
            </Navbar.Toggle>
            <Navbar.Collapse className="col-auto justify-center">
              <Menu {...BnbMenuData} />
            </Navbar.Collapse>
            <Col className="col-auto text-right pe-0">
              <div className="header-icon">
                <div className="header-button">
                  <Link aria-label="account" to="/account">
                    <i className="feather-user text-white"></i>
                  </Link>
                </div>
              </div>
            </Col>
          </HeaderNav>
        </Header>

        <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <Row className="justify-center">
              <Col lg={8}>
                <MessageBox
                  theme="message-box01"
                  variant="error"
                  message="Booking not found. Please check your booking confirmation email or contact support."
                  action={
                    <div className="mt-4 space-x-4">
                      <Buttons
                        to="/account/bookings"
                        className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase"
                        themeColor="#232323"
                        color="#fff"
                        title="View All Bookings"
                      />
                      <Buttons
                        to="/bnb/list"
                        className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase"
                        themeColor="#232323"
                        color="#232323"
                        title="Continue Browsing"
                      />
                    </div>
                  }
                />
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    )
  }

  const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-lightgray">
      {/* Header with Center Navigation */}
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
              <Navbar.Brand className="inline-block p-0 m-0">
                <span className="default-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                <span className="alt-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                <span className="mobile-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler</span>
              </Navbar.Brand>
            </Link>
          </Col>
          <Navbar.Toggle className="order-last md:ml-[25px] sm:ml-[17px]">
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
          </Navbar.Toggle>
          <Navbar.Collapse className="col-auto justify-center">
            <Menu {...BnbMenuData} />
          </Navbar.Collapse>
          <Col className="col-auto text-right pe-0">
            <div className="header-icon">
              <div className="header-button">
                <Link aria-label="account" to="/account">
                  <i className="feather-user text-white"></i>
                </Link>
              </div>
            </div>
          </Col>
        </HeaderNav>
      </Header>

      {/* Confirmation Header */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-white">
        <Container>
          <Row className="justify-center">
            <Col lg={8} className="text-center">
              <m.div {...fadeIn}>
                <div className="text-6xl mb-6">✅</div>
                <h1 className="heading-2 font-serif text-[#262b35] font-semibold -tracking-[1px] mb-4">
                  Booking Confirmed!
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Your reservation has been successfully created. A confirmation email has been sent to your inbox.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                  <p className="text-sm font-medium text-green-800">
                    Booking Reference: #{booking.id}
                  </p>
                </div>
              </m.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Booking Details */}
      <section className="py-[100px] lg:py-[75px] md:py-[50px] sm:py-[40px]">
        <Container>
          <Row className="justify-center">
            <Col lg={10}>
              <m.div {...fadeIn} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  {/* Property Image */}
                  <div className="md:w-2/5">
                    <img
                      src={booking.listing?.images?.[0] || "https://via.placeholder.com/600x400"}
                      alt={booking.listing?.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="md:w-3/5 p-8">
                    <div className="mb-6">
                      <h2 className="heading-4 font-serif text-darkgray mb-2">
                        {booking.listing?.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {booking.listing?.address}
                      </p>
                      
                      {/* Host Contact */}
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <i className="feather-user text-gray-600"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hosted by {booking.listing?.host_name || 'Host'}</p>
                          <p className="text-xs text-gray-600">Contact details will be shared closer to your arrival</p>
                        </div>
                      </div>
                    </div>

                    {/* Stay Details */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Check-in</h4>
                        <p className="text-sm text-gray-600">{formatDate(booking.check_in)}</p>
                        <p className="text-xs text-gray-500">After 3:00 PM</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Check-out</h4>
                        <p className="text-sm text-gray-600">{formatDate(booking.check_out)}</p>
                        <p className="text-xs text-gray-500">Before 11:00 AM</p>
                      </div>
                    </div>

                    {/* Guest Info */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Guest Information</h4>
                      <p className="text-sm text-gray-600">
                        {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        Primary guest: {booking.guest_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Contact: {booking.guest_email} • {booking.guest_phone}
                      </p>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{formatKes(booking.nightly_rate)} × {nights} night{nights !== 1 ? 's' : ''}</span>
                          <span>{formatKes(booking.subtotal)}</span>
                        </div>
                        
                        {booking.service_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Service fee</span>
                            <span>{formatKes(booking.service_fee)}</span>
                          </div>
                        )}
                        
                        {booking.taxes > 0 && (
                          <div className="flex justify-between">
                            <span>Taxes</span>
                            <span>{formatKes(booking.taxes)}</span>
                          </div>
                        )}
                        
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between font-medium">
                            <span>Total paid</span>
                            <span>{formatKes(booking.total_amount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      {booking.payment_method && (
                        <div className="mt-4 pt-3 border-t">
                          <p className="text-xs text-gray-500">
                            Paid with {booking.payment_method} ending in {booking.payment_last_four || '****'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </m.div>

              {/* Action Buttons */}
              <m.div {...fadeIn} className="mt-8 text-center space-x-4">
                <Buttons
                  ariaLabel="view all bookings"
                  to="/account/bookings"
                  className="btn-fill btn-fancy font-medium font-serif rounded-none uppercase"
                  themeColor="#232323"
                  color="#fff"
                  title="View All Bookings"
                />
                
                <Buttons
                  ariaLabel="contact host"
                  to={`/messages/host/${booking.listing?.host_id}`}
                  className="btn-outline btn-fancy font-medium font-serif rounded-none uppercase"
                  themeColor="#232323"
                  color="#232323"
                  title="Contact Host"
                />

                <Buttons
                  ariaLabel="continue browsing"
                  to="/bnb/list"
                  className="btn-link btn-fancy font-medium font-serif rounded-none uppercase"
                  themeColor="#232323"
                  color="#232323"
                  title="Continue Browsing"
                />
              </m.div>

              {/* Important Information */}
              <m.div {...fadeIn} className="mt-12">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <i className="feather-info mr-2"></i>
                    Important Information
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• A confirmation email with your booking details has been sent to {booking.guest_email}</li>
                    <li>• Please arrive after 3:00 PM on your check-in date</li>
                    <li>• Host contact information will be shared 24 hours before your arrival</li>
                    <li>• Check our <Link to="/cancellation-policy" className="underline">cancellation policy</Link> for modification options</li>
                    <li>• Save this confirmation page for your records</li>
                  </ul>
                </div>
              </m.div>
            </Col>
          </Row>
        </Container>
      </section>

      <FooterStyle01 theme="dark" className="text-slateblue bg-[#262b35]" />
    </div>
  )
}

export default BookingConfirmation
