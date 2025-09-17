import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import BnbMenuData from '../../Components/Header/BnbMenuData'
import PageTitle from '../../Components/PageTitle/PageTitle'
import Buttons from '../../Components/Button/Buttons'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import BnbBookingModal from '../../Components/BookingModal/BnbBookingModal'
import { fadeIn, fadeInLeft, zoomIn } from '../../Functions/GlobalAnimations'
import WishlistButton from '../../Components/Wishlist/WishlistButton'
import LiveChatWidget from '../../Components/LiveChat/LiveChatWidget'

// API Hooks
import { useListing, useAvailability } from '../../api/useBnb'

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

// Skeleton Components
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-96 mb-8 rounded"></div>
    <div className="space-y-4">
      <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-300 h-24 rounded"></div>
    </div>
  </div>
)

const BnbDetail = (props) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Fetch listing data
  const {
    data: listing,
    isLoading: listingLoading,
    isError: listingError,
    error: listingErrorDetails
  } = useListing(id)

  // Get availability for next 30 days
  const today = new Date()
  const thirtyDaysLater = new Date(today)
  thirtyDaysLater.setDate(today.getDate() + 30)

  const {
    data: availability,
    isLoading: availabilityLoading
  } = useAvailability(id, {
    start_date: today.toISOString().split('T')[0],
    end_date: thirtyDaysLater.toISOString().split('T')[0]
  })

  // Transform images for gallery
  const galleryImages = useMemo(() => {
    if (!listing?.images) return []
    return listing.images.map((img, index) => ({
      src: img,
      alt: `${listing.title} - Image ${index + 1}`
    }))
  }, [listing])

  if (listingLoading) {
    return (
      <div style={props.style}>
        <Header topSpace={{ md: true }} type="header-always-fixed">
          <HeaderNav
            theme="dark"
            fluid="fluid"
            bg="dark"
            expand="lg"
            className="py-[0px] border-b border-[#ffffff1a] px-[35px] bg-[#23262d]"
          >
            <Col xs="auto" lg={2}>
              <Link aria-label="header logo link" className="flex items-center" to="/">
                <span className="font-serif font-semibold text-[18px] text-white">Buckler Investment Group</span>
              </Link>
            </Col>
            <Menu {...props} data={BnbMenuData} />
          </HeaderNav>
        </Header>
        
        <PageTitle
          title="Loading..."
          subtitle="Please wait while we load the listing details"
          bg="https://via.placeholder.com/1920x1080"
        />
        
        <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <DetailSkeleton />
          </Container>
        </section>
        
        <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      </div>
    )
  }

  if (listingError) {
    return (
      <div style={props.style}>
        <Header topSpace={{ md: true }} type="header-always-fixed">
          <HeaderNav
            theme="dark"
            fluid="fluid"
            bg="dark"
            expand="lg"
            className="py-[0px] border-b border-[#ffffff1a] px-[35px] bg-[#23262d]"
          >
            <Col xs="auto" lg={2}>
              <Link aria-label="header logo link" className="flex items-center" to="/">
                <span className="font-serif font-semibold text-[18px] text-white">Buckler Investment Group</span>
              </Link>
            </Col>
            <Menu {...props} data={BnbMenuData} />
          </HeaderNav>
        </Header>
        
        <PageTitle
          title="Listing Not Found"
          subtitle="The listing you're looking for doesn't exist or has been removed"
          bg="https://via.placeholder.com/1920x1080"
        />
        
        <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] text-center">
          <Container>
            <Row className="justify-center">
              <Col md={6}>
                <div className="text-6xl mb-4 opacity-20">🏠</div>
                <h3 className="heading-6 font-serif text-darkgray mb-4">Listing Not Found</h3>
                <p className="text-lg text-gray-600 mb-6">
                  The BnB listing you're looking for might have been removed or doesn't exist.
                </p>
                <Buttons 
                  ariaLabel="back to listings" 
                  to="/bnb"
                  className="font-medium font-serif uppercase btn-link after:h-[2px] after:bg-basecolor" 
                  color="#cee002" 
                  size="lg" 
                  title="Back to Listings" 
                />
              </Col>
            </Row>
          </Container>
        </section>
        
        <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
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
        title={listing?.title || "BnB Listing"}
        subtitle={`${formatKes(listing?.price_per_night)}/night • Up to ${listing?.max_guests || 0} guests`}
        bg={listing?.images?.[0] || "https://via.placeholder.com/1920x1080"}
      />
      {/* Page Title End */}

      {/* Gallery Section Start */}
      {galleryImages.length > 0 && (
        <m.section className="py-[80px] lg:py-[60px] md:py-[50px] sm:py-[40px] xs:py-[30px]" {...fadeIn}>
          <Container>
            <Row>
              <Col>
                <Swiper
                  className="gallery-slider h-[500px] md:h-[400px] sm:h-[300px]"
                  modules={[Navigation, Pagination, Autoplay]}
                  slidesPerView={1}
                  navigation={true}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
                >
                  {galleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div 
                        className="h-full bg-cover bg-center bg-no-repeat rounded-lg"
                        style={{ backgroundImage: `url(${img.src})` }}
                      >
                        <img 
                          src={img.src} 
                          alt={img.alt}
                          className="w-full h-full object-cover rounded-lg opacity-0"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Thumbnail Navigation */}
                {galleryImages.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
                    {galleryImages.slice(0, 6).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                          selectedImageIndex === index ? 'border-basecolor' : 'border-gray-300'
                        }`}
                      >
                        <img 
                          src={img.src} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    {galleryImages.length > 6 && (
                      <div className="w-16 h-16 rounded border-2 border-gray-300 flex items-center justify-center bg-gray-100">
                        <span className="text-xs text-gray-600">+{galleryImages.length - 6}</span>
                      </div>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </m.section>
      )}
      {/* Gallery Section End */}

      {/* Details Section Start */}
      <section className="py-[80px] lg:py-[60px] md:py-[50px] sm:py-[40px] bg-lightgray">
        <Container>
          <Row>
            {/* Main Content */}
            <Col lg={8} md={7} className="pr-[50px] lg:pr-[30px] md:pr-[15px]">
              <m.div {...fadeInLeft}>
                <h2 className="heading-5 font-serif font-semibold text-darkgray mb-6">
                  {listing?.title}
                </h2>
                
                <div className="flex items-center mb-6 text-md">
                  <i className="feather-map-pin mr-2 text-basecolor"></i>
                  <span>{listing?.location}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded">
                    <i className="feather-users text-2xl text-basecolor mb-2"></i>
                    <div className="font-semibold">{listing?.max_guests || 0}</div>
                    <div className="text-sm text-gray-600">Guests</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded">
                    <i className="feather-home text-2xl text-basecolor mb-2"></i>
                    <div className="font-semibold">{listing?.bedrooms || 0}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded">
                    <i className="feather-droplet text-2xl text-basecolor mb-2"></i>
                    <div className="font-semibold">{listing?.bathrooms || 0}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded">
                    <i className="feather-dollar-sign text-2xl text-basecolor mb-2"></i>
                    <div className="font-semibold">{formatKes(listing?.price_per_night)}</div>
                    <div className="text-sm text-gray-600">Per Night</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">Description</h4>
                  <p className="text-lg leading-relaxed">
                    {listing?.description || "No description available."}
                  </p>
                </div>

                {listing?.amenities && listing.amenities.length > 0 && (
                  <div className="mb-8">
                    <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">Amenities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {listing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <i className="feather-check text-basecolor mr-2"></i>
                          <span className="capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability Calendar */}
                <div className="mb-8">
                  <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">Availability</h4>
                  {availabilityLoading ? (
                    <div className="bg-white p-6 rounded">
                      <div className="animate-pulse">
                        <div className="bg-gray-300 h-4 w-1/2 mb-2 rounded"></div>
                        <div className="bg-gray-300 h-32 rounded"></div>
                      </div>
                    </div>
                  ) : availability && availability.length > 0 ? (
                    <div className="bg-white p-6 rounded">
                      <p className="text-sm text-gray-600 mb-4">Available dates for the next 30 days:</p>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="p-2 font-semibold text-xs">{day}</div>
                        ))}
                        {availability.slice(0, 28).map((day, index) => (
                          <div 
                            key={index}
                            className={`p-2 text-xs border rounded ${
                              day.is_available 
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : 'bg-red-100 border-red-300 text-red-800'
                            }`}
                          >
                            {new Date(day.date).getDate()}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded text-center text-gray-600">
                      <p>Availability information not available</p>
                    </div>
                  )}
                </div>
              </m.div>
            </Col>

            {/* Booking Sidebar */}
            <Col lg={4} md={5}>
              <m.div className="sticky top-24" {...fadeIn}>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-serif font-semibold text-darkgray">
                      {formatKes(listing?.price_per_night)}
                    </div>
                    <div className="text-gray-600">per night</div>
                  </div>

                  <div className="flex justify-end mb-4">
                    <WishlistButton itemId={Number(id)} itemType="bnb" size="md" />
                  </div>

                  <BnbBookingModal
                    listing={listing}
                    triggerButton={
                      <Buttons
                        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full"
                        themeColor="#cee002"
                        color="#232323"
                        title="Book This Stay"
                        size="lg"
                      />
                    }
                  />

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span>Service fee</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Cleaning fee</span>
                      <span>Included</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-4">
                      You won't be charged yet. Final price shown at checkout.
                    </div>
                  </div>
                </div>

                {/* Host Info */}
                <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                  <h5 className="font-serif font-semibold text-darkgray mb-4">Contact Host</h5>
                  <p className="text-sm text-gray-600 mb-4">
                    Have questions about this listing? Get in touch with the host.
                  </p>
                  <Buttons
                    className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase w-full"
                    themeColor="#232323"
                    color="#232323"
                    title="Message Host"
                    size="md"
                    onClick={() => setIsChatOpen((v) => !v)}
                  />
                </div>
              </m.div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Details Section End */}

      {/* Live Chat */}
      <LiveChatWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen((v) => !v)} tourId={null} bookingId={null} />

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}
    </div>
  )
}

export default BnbDetail
