import React, { useEffect, useMemo, useState } from 'react'

// Libraries
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Keyboard, Navigation } from "swiper/modules";
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import BnbMenuData from '../../Components/Header/BnbMenuData'
import EnhancedBnbSearch from '../../Components/BnbSearch/EnhancedBnbSearch'
import BnbCategoriesGrid from '../../Components/BnbCategories/BnbCategoriesGrid'
import SocialIcons from '../../Components/SocialIcon/SocialIcons'
import Buttons from '../../Components/Button/Buttons'
import Clients from '../../Components/Clients/Clients'
import Overlap from '../../Components/Overlap/Overlap'
import CustomModal from '../../Components/CustomModal'
import BlogMetro from '../../Components/Blogs/BlogMetro'
import InteractiveBanners15 from '../../Components/InteractiveBanners/InteractiveBanners15'
import FooterStyle01 from '../../Components/Footers/FooterStyle01';
import { fadeIn, zoomIn } from '../../Functions/GlobalAnimations'

// Data
import { blogData } from '../../Components/Blogs/BlogData';
import { InteractiveBannersData15 } from '../../Components/InteractiveBanners/InteractiveBannersData';

// API Hooks
import { useFeaturedListings, useListings, useNearbyListings, useMyBookings, useSearchListings } from '../../api/useBnb';
import { getRefreshToken } from '../../api/axios'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '../../Components/Form/Form'
import BnbBookingModal from '../../Components/BookingModal/BnbBookingModal'

// Skeletons and States
import {
  FeaturedListingsSkeleton,
  LatestListingsSkeleton,
  NearbyListingsSkeleton,
  SearchResultsSkeleton,
  EmptyListingsState,
  ErrorState
} from '../../Components/Skeletons/BnbSkeletons'

const SwiperData = [
  {
    number: "01",
    img: "https://via.placeholder.com/1920x1080",
    title: "Mombasa",
    subtitle: "coastal villas",
    btnName: "explore bnbs",
    btnLink: "/bnb/list"
  }
]

const ClientData = [
  {
    img: 'https://via.placeholder.com/232x110',
    target: "_self",
    link: '#'
  }
]

const selecteworkData = [
  {
    title: "Cultural centre",
    subtitle: "Landscape",
    img: "https://via.placeholder.com/818x1048",
    link: "/portfolio/single-project-page-01"
  }
]

const FooterIconData = [
  {
    color: "#828282",
    link: "https://www.facebook.com/",
    icon: "fab fa-facebook-f"
  }
]

// Filter the blog data category wise
const blogMetroData = blogData.filter((item) => item.blogType === "metro").filter(item => item.category.includes("architecture"));

// Transform API data to existing component formats
const formatKes = (value) => {
  if (value == null) return '—';
  try { return `KES ${Number(value).toLocaleString('en-KE')}` } catch { return `KES ${value}` }
}

const transformListingToInteractiveBanner = (listing) => ({
  img: listing.images?.[0] || "https://via.placeholder.com/800x1113",
  title: listing.title,
  content: `${formatKes(listing.nightly_price)}/night • Max ${listing.capacity} guests`,
  btnTitle: "View Details",
  btnLink: `/bnb/${listing.id}`,
  // Add booking modal
  customButton: (
    <BnbBookingModal
      listing={listing}
      triggerButton={
        <Buttons
          className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase ml-2"
          themeColor="#232323"
          color="#fff"
          title="Book Now"
        />
      }
    />
  ),
});

const transformListingToPortfolio = (listing) => ({
  title: listing.title,
  subtitle: `${formatKes(listing.nightly_price)}/night`,
  img: listing.images?.[0] || "https://via.placeholder.com/818x1048",
  link: `/bnb/${listing.id}`
});

const ArchitecturePage = (props) => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Initialize search criteria from URL params
  const getSearchCriteriaFromURL = () => {
    const params = {}
    if (searchParams.get('location')) params.location = searchParams.get('location')
    if (searchParams.get('check_in')) params.check_in = searchParams.get('check_in')
    if (searchParams.get('check_out')) params.check_out = searchParams.get('check_out')
    if (searchParams.get('guests')) params.guests = parseInt(searchParams.get('guests'))
    if (searchParams.get('min_price')) params.min_price = parseInt(searchParams.get('min_price'))
    if (searchParams.get('max_price')) params.max_price = parseInt(searchParams.get('max_price'))
    return Object.keys(params).length > 0 ? params : null
  }

  // Hero search state and hook
  const [searchCriteria, setSearchCriteriaState] = useState(getSearchCriteriaFromURL())
  
  // Update URL when search criteria changes
  const setSearchCriteria = (criteria) => {
    setSearchCriteriaState(criteria)
    
    if (criteria && Object.keys(criteria).length > 0) {
      const newParams = new URLSearchParams()
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          newParams.set(key, value.toString())
        }
      })
      setSearchParams(newParams)
    } else {
      setSearchParams({})
    }
  }

  // Fetch API data
  const { data: featuredListings, isLoading: featuredLoading, isError: featuredError } = useFeaturedListings(8);
  const { data: latestListings, isLoading: latestLoading, isError: latestError } = useListings({}, 6);
  const { data: searchResults, isLoading: searchLoading, isError: searchError } = useSearchListings(searchCriteria || {}, !!searchCriteria)

  // Clear search function
  const clearSearch = () => {
    setSearchCriteria(null)
  }

  // Load search criteria from URL on component mount
  useEffect(() => {
    const urlCriteria = getSearchCriteriaFromURL()
    if (urlCriteria) {
      setSearchCriteriaState(urlCriteria)
    }
  }, []) // Only run on mount

  // Nearby listings via geolocation
  const [coords, setCoords] = useState(null)
  useEffect(() => {
    if (!navigator?.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => setCoords(null),
      { enableHighAccuracy: false, timeout: 5000 }
    )
  }, [])
  const { data: nearbyListings, isLoading: nearbyLoading } = useNearbyListings({
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    radius_km: 10,
    limit: 8,
  }, !!coords)

  // Bookings panel (authenticated only)
  const hasAuth = useMemo(() => Boolean(getRefreshToken()), [])
  const { data: myBookings } = useMyBookings(hasAuth)
  
  // Transform data for existing components
  const interactiveBannersData = useMemo(() => {
    if (featuredListings?.length > 0) {
      return featuredListings.map(transformListingToInteractiveBanner)
    }
    return [] // Return empty array for proper empty state handling
  }, [featuredListings])
  
  const portfolioData = useMemo(() => {
    if (latestListings?.pages?.[0]?.length > 0) {
      return latestListings.pages[0].map(transformListingToPortfolio)
    }
    return [] // Return empty array for proper empty state handling
  }, [latestListings])

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
          <Col xs="auto" lg={2} sm={6} className="me-auto ps-lg-0 me-auto ps-lg-0">
            <Link aria-label="header logo link" className="flex items-center" to="/">
              <Navbar.Brand className="inline-block p-0 m-0">
                <span className="default-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                <span className="alt-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                <span className="mobile-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
              </Navbar.Brand>
            </Link>
          </Col>
          <Navbar.Toggle className="order-last md:ml-[25px] sm:ml-[17px]">
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
          </Navbar.Toggle>
          <Navbar.Collapse className="col-xs-auto col-lg-8 menu-order px-lg-0 justify-center">
            <Menu {...props} data={BnbMenuData} />
          </Navbar.Collapse>
          <Col xs="auto" lg={2} className="nav-bar-contact text-end xs:hidden pe-0">
            <a aria-label="link for top" href="#top" className="text-md text-[#fff] font-serif font-medium">
              <i className="feather-phone-call mr-[15px]"></i>
              0222 8899900
            </a>
          </Col>
        </HeaderNav>
      </Header>
      {/* Header End */}

      <div className="bg-white">
        <div className="relative">
          {/* Section Start */}
          <section className="overflow-hidden h-[800px] md:h-[500px] sm:h-[400px]">
            <Swiper
              className="white-move swiper-pagination-light swiper-pagination-medium h-full relative swiper-navigation-04 swiper-navigation-dark travel-agency-slider"
              slidesPerView={1}
              loop={true}
              keyboard={true}
              navigation={true}
              modules={[Autoplay, Keyboard, Navigation]}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              onSlideChange={(swiperCore) => {
                const { realIndex } = swiperCore;
                setActiveSlide(realIndex)
              }}>
              {
                SwiperData.map((item, i) => {
                  return (
                    <SwiperSlide key={i} className="overflow-hidden h-full relative bg-cover bg-no-repeat bg-center min-h-[-webkit-fill-available]" style={{ backgroundImage: `url(${item.img})` }}>
                      <div className="absolute h-full w-full top-0 left-0 opacity-[0.01] bg-black"></div>
                      <Container fluid className="relative h-full">
                        <Row className="justify-center h-full items-center">
                          <Col xs={12} xl={7} className="flex xs:justify-center xs:text-center pl-[65px] lg:pl-[120px] md:pl-[30px]">
                            <div className="w-[144px] h-[221px] lg:w-[130px] lg:h-[198px] md:w-[165px] md:h-[255px] relative sm:hidden mr-[55px]">
                              <m.div
                                animate={activeSlide === i ? { scaleX: [0, 1], originX: ["0%", "0%"] } : { scaleX: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "linear" }}
                                className="bg-basecolor absolute top-0 h-full w-full"></m.div>
                              <h2 className="heading-4 text-darkgray text-[85px] font-serif opacity-100 absolute top-[50px] -left-[7px] font-semibold lg:text-[75px] md:text-[87px] md:top-[70px]">0{i + 1}</h2>
                            </div>
                            <div className="flex flex-col items-start justify-center xs:items-center">
                              <h2 className="heading-5 text-white text-[67px] leading-none tracking-[-2px] font-serif font-semibold text-shadow-small lg:text-[60px] md:text-[34px] sm:text-[75px] relative mb-[15px] xs:text-[45px]">
                                {item.title}<br></br>{item.subtitle}
                                <m.span
                                  animate={activeSlide === i ? { scaleX: [0, 1, 1, 0], originX: ["0%", "0%", "100%", "100%"] } : { scaleX: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.6, ease: "linear" }}
                                  className="bg-white list-block absolute top-0 left-0 h-full w-full"></m.span>
                              </h2>
                              <div className="relative inline-block">
                                <m.div
                                  animate={activeSlide === i ? { scaleX: [0, 1, 1, 0], originX: ["0%", "0%", "100%", "100%"] } : { scaleX: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.6, ease: "linear" }}
                                  className="bg-white list-block absolute top-0 h-full w-full"></m.div>
                                <Buttons ariaLabel="link for btn" to={item.btnLink} className="font-medium font-serif uppercase btn-link after:h-[1px] text-base leading-[20px] md:text-md md:mb-[15px] after:bg-[#fff] hover:text-[#fff]" color="#fff" size="xlg" title={item.btnName} />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </SwiperSlide>
                  )
                })
              }
            </Swiper>
          </section>
          {/* Section End */}

          {/* Enhanced BnB Search Section Start */}
          <EnhancedBnbSearch onSearch={setSearchCriteria} />
          {/* Enhanced BnB Search Section End */}

          {/* BnB Categories Section Start */}
          <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] xs:py-[40px] bg-lightgray">
            <Container>
              <Row className="justify-center">
                <Col lg={7} className="text-center mb-16 md:mb-12 sm:mb-8 xs:mb-6">
                  <h2 className="heading-4 font-serif font-semibold text-darkgray">
                    Find your perfect stay that suits your needs
                  </h2>
                  <p className="text-lg md:text-md">
                    From entire homes to private rooms, find accommodation that fits your travel style
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <BnbCategoriesGrid filter={false} />
                </Col>
              </Row>
            </Container>
          </section>
          {/* BnB Categories Section End */}

          {/* Section Start */}
          <section className="py-[80px] md:py-[60px] sm:py-[50px] xs:pb-0">
            <Container fluid className="md:p-0">
              <Row className="justify-end">
                <Col lg={7} xl={6} md={10} className="bg-[#23262d] flex py-[49px] px-8 xl:px-8 lg:py-12 xs:flex-col xs:items-center xs:text-center">
                  <div className="pl-[49px] pr-[39px] py-[10px] border-r border-[#ffffff1a] xl:px-6 md:px-12 xs:p-0 xs:mb-[20px] xs:border-0">
                    <span className="font-serif font-medium text-white inline-block mb-[5px] mxl:block xs:mr-[10px] xs:mb-0">01</span>
                    <span className="font-serif text-md uppercase inline-block">City accommodations</span>
                  </div>
                  <div className="pl-[49px] pr-[39px] py-[10px] border-r border-[#ffffff1a] xl:px-6 md:px-12 xs:p-0 xs:mb-[30px] xs:border-r-0">
                    <span className="font-serif font-medium text-white inline-block mb-[5px] mxl:block xs:mr-[10px] xs:mb-0">02</span>
                    <span className="font-serif text-md uppercase inline-block">Coastal properties</span>
                  </div>
                  <div className="pl-14 pr-36 py-[10px] xl:px-6 sm:px-12 xs:p-0">
                    <span className="font-serif font-medium text-basecolor uppercase block mb-[5px]">Trusted since 2018</span>
                    <span className="font-serif text-md uppercase block w-full xs:w-[90%] xs:mx-auto">Verified BnB stays across Kenya</span>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
          {/* Section End */}
        </div>

        {/* Section Start */}
        <section className="py-[80px] border-b border-mediumgray bg-white md:py-[40px]">
          <Container>
            <Row className="items-center justify-center md:items-start sm:text-center">
              <Col lg={4} md={6} className="md:mb-[50px]">
                <m.div className="inline-block text-center w-[300px] py-14 px-[15px] relative xs:p-[30px] xs:w-[315px]" {...{ ...fadeIn, transition: { delay: 0.2 } }}>
                  <div className="border-r-0 border-solid	border-[10px] border-[#e5e7eb] h-full w-[67px] block absolute bottom-0 left-0 xs:left-[25px]"></div>
                  <h1 className="text-[80px] leading-[72px] mb-0 mr-[15px] font-semibold tracking-[-5px] text-darkgray font-serif inline-block align-middle">28</h1>
                  <div className="w-[40%] leading-[24px] text-darkgray text-xmd font-serif text-left relative inline-block align-middle lg:w-[50%] sm:w-[35%]">BnB nights booked</div>
                  <div className="border-l-0 border-solid	border-[10px] border-[#e5e7eb] h-full w-[67px] block absolute bottom-0 right-0 xs:right-[25px]"></div>
                </m.div>
              </Col>
              <m.div className="col-lg-3 col-md-4 text-left sm:text-center" {...{ ...fadeIn, transition: { delay: 0.4 } }}>
                <span className="mb-[20px] text-[15px] font-serif uppercase block text-darkgray">Book with confidence</span>
                <span className="w-[85%] leading-[34px] font-medium text-darkgray text-xlg font-serif block md:text-lg sm:w-full sm:mb-[15px]">Affordable, flexible BnB stays for every trip</span>
              </m.div>
              <m.div className="col-lg-5 col-md-10 text-left sm:text-center" {...{ ...fadeIn, transition: { delay: 0.5 } }}>
                <p className="w-[85%] mb-[20px] block sm:w-full">Discover curated stays from Nairobi apartments to coastal villas and safari lodges – all verified by Buckler.</p>
                <Buttons ariaLabel="link for About rentals" to="/page/about-us" className="font-medium font-serif uppercase btn-link after:h-[2px] md:text-md md:mb-[15px] sm:mb-0 after:bg-darkgray hover:text-darkgray" color="#232323" size="xlg" title="About Buckler BnB" />
              </m.div>
            </Row>
          </Container>
        </section>
        {/* Section End */}

        {/* Nearby Listings Section */}
        {coords && (
          <m.section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]" {...fadeIn}>
            {nearbyLoading ? (
              <NearbyListingsSkeleton />
            ) : nearbyListings?.length > 0 ? (
              <Container>
                <Row className="justify-center">
                  <Col className="text-center divider-full mb-[3rem] p-0">
                    <div className="divider-border divider-light flex items-center w-full">
                      <span className="font-serif font-medium text-basecolor uppercase tracking-[1px] block px-[30px]">Nearby Stays</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <InteractiveBanners15 
                      data={nearbyListings.map(transformListingToInteractiveBanner)} 
                      grid="row-cols-1 row-cols-xl-4 row-cols-md-2 gap-y-10" 
                      animation={fadeIn} 
                    />
                  </Col>
                </Row>
              </Container>
            ) : (
              <EmptyListingsState 
                title="No nearby stays found" 
                message="We couldn't find any stays in your area. Try browsing our featured listings below." 
              />
            )}
          </m.section>
        )}

        {/* Your Bookings Panel (if authenticated) */}
        {hasAuth && myBookings && myBookings.length > 0 && (
          <section className="py-[80px] lg:py-[60px] md:py-[50px] sm:py-[40px]">
            <Container>
              <Row className="justify-between items-center mb-6">
                <Col><h3 className="heading-6 font-serif text-white">Your recent bookings</h3></Col>
                <Col className="text-right"><Buttons ariaLabel="go to account" to="/account" className="font-medium font-serif uppercase btn-link after:h-[2px] after:bg-spanishgray" color="#939393" size="lg" title="Manage bookings" /></Col>
              </Row>
              <Row>
                {(myBookings || []).slice(0, 4).map((b) => (
                  <Col key={b.id} md={6} lg={3} className="mb-6">
                    <div className="bg-[rgba(255,255,255,0.06)] p-4 rounded">
                      <div className="text-white font-serif">{b.listing_title || `Booking #${b.id}`}</div>
                      <div className="text-sm">{b.check_in} → {b.check_out}</div>
                      <div className="text-sm">{formatKes(b.total_amount)}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}

        {/* Search Results Section (optional, when searching from hero) */}
        {searchCriteria && (
          <section className="py-[80px] lg:py-[60px] md:py-[50px] sm:py-[40px]">
            {searchLoading ? (
              <SearchResultsSkeleton />
            ) : searchError ? (
              <ErrorState 
                title="Search failed" 
                message="Please adjust your search criteria and try again."
                onRetry={() => setSearchCriteria({...searchCriteria})}
              />
            ) : searchResults?.length > 0 ? (
              <Container>
                <Row className="justify-center">
                  <Col className="text-center divider-full mb-[3rem] p-0">
                    <div className="divider-border divider-light flex items-center w-full">
                      <span className="font-serif font-medium text-basecolor uppercase tracking-[1px] block px-[30px]">Search Results</span>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col className="text-center">
                    <Buttons 
                      ariaLabel="clear search" 
                      onClick={clearSearch}
                      className="font-medium font-serif uppercase btn-link after:h-[2px] after:bg-red-500" 
                      color="#ef4444" 
                      size="lg" 
                      title="Clear Search" 
                    />
                  </Col>
                </Row>
                <Row>
                  <InteractiveBanners15 
                    data={searchResults.map(transformListingToInteractiveBanner)} 
                    grid="row-cols-1 row-cols-xl-4 row-cols-md-2 gap-y-10" 
                    animation={fadeIn} 
                  />
                </Row>
              </Container>
            ) : (
              <Container>
                <Row className="justify-center">
                  <Col md={6} className="text-center py-16">
                    <div className="text-6xl mb-4 opacity-20">🔍</div>
                    <h3 className="heading-6 font-serif text-darkgray mb-4">No search results found</h3>
                    <p className="text-lg text-gray-600 mb-6">Try different dates, location, or number of guests to find the perfect stay.</p>
                    <Buttons 
                      ariaLabel="clear search" 
                      onClick={clearSearch}
                      className="font-medium font-serif uppercase btn-link after:h-[2px] after:bg-red-500" 
                      color="#ef4444" 
                      size="lg" 
                      title="Clear Search" 
                    />
                  </Col>
                </Row>
              </Container>
            )}
          </section>
        )}
        {/* Featured Listings Section */}
        <m.section {...{ ...fadeIn, transition: { delay: 0.5, duration: 1.2 } }}>
          {featuredLoading ? (
            <FeaturedListingsSkeleton />
          ) : featuredError ? (
            <ErrorState 
              title="Failed to load featured stays" 
              message="We're having trouble loading our featured properties. Please try again."
            />
          ) : interactiveBannersData.length > 0 ? (
            <Container fluid className="lg:px-[30px]">
              <InteractiveBanners15 
                data={interactiveBannersData} 
                grid="row-cols-1 row-cols-xl-4 row-cols-md-2 gap-y-10" 
                animation={fadeIn} 
              />
              <div className="mt-6 text-center">
                <Buttons 
                  ariaLabel="view all stays" 
                  to="/bnb/list" 
                  className="font-medium font-serif uppercase btn-link after:h-[2px] after:bg-spanishgray" 
                  color="#939393" 
                  size="xlg" 
                  title="View all stays" 
                />
              </div>
            </Container>
          ) : (
            <EmptyListingsState 
              title="No featured stays available" 
              message="Our featured listings are currently being updated. Please check back soon."
            />
          )}
        </m.section>
        {/* Section End */}

        {/* Section Start */}
        <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <Row>
              <Col lg={5} md={9} className="md:mb-[40px] xs:mb-[30px]">
                <m.h2 className="heading-6 font-serif text-white leading-[44px] mb-0 md:leading-[34px] sm:leading-[30px] sm:w-[80%] xs:w-full" {...{ ...fadeIn, transition: { delay: 0.2 } }}>We provide exceptional BnB stays for business trips, getaways, and safaris across Kenya.</m.h2>
              </Col>
              <m.div className="col-12 col-lg-3 offset-lg-1 col-sm-6 xs:mb-[30px]" {...{ ...fadeIn, transition: { delay: 0.4 } }}>
                <span className="font-serif font-medium text-white uppercase tracking-[1px] block mb-[5px]">Verified hosts</span>
                <p className="w-[85%] lg:w-full md:w-[80%] sm:w-[90%] xs:w-full">All listings are inspected and verified by our team.</p>
              </m.div>
              <m.div className="col-12 col-lg-3 col-sm-6" {...{ ...fadeIn, transition: { delay: 0.5 } }}>
                <span className="font-serif font-medium text-white uppercase tracking-[1px] block mb-[5px]">Flexible stays</span>
                <p className="w-[85%] lg:w-full md:w-[80%] sm:w-[90%] xs:w-full">Choose nightly, weekly, or monthly options across Kenya.</p>
              </m.div>
            </Row>
          </Container>
        </section>
        {/* Section End */}

        {/* Section Start - COMMENTED OUT FOR NOW */}
        {/* <m.section className="cover-background p-0" style={{ backgroundImage: `url(https://via.placeholder.com/1920x640)` }} {...fadeIn}>
          <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-darkslateblue"></div>
          <Container>
            <Row className="justify-center">
              <Col md={6} className="h-[600px] items-center flex flex-col justify-center text-center lg:h-[500px] sm:h-[400px] xs:h-[300px]">
                <CustomModal.Wrapper
                  modalBtn={<Buttons ariaLabel="modal button" type="submit" className="btn-sonar border-0" themeColor="#fff" color="#ff7a56" size="lg" title={<i className="icon-control-play" />} />
                  } >
                  <div className="w-[1020px] max-w-full relative rounded mx-auto">
                    <div className="fit-video">
                      <iframe width="100%" height="100%" className="shadow-[0_0_8px_rgba(0,0,0,0.06)]" controls src="https://www.youtube.com/embed/g0f_BRYJLJE?autoplay=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe>
                    </div>
                  </div>
                </CustomModal.Wrapper>
              </Col>
            </Row>
          </Container>
        </m.section> */}
        {/* Section End - COMMENTED OUT FOR NOW */}

        {/* Section Start - COMMENTED OUT FOR NOW */}
        {/* <m.section className="overflow-visible pb-0 md:pt-0 sm:pt-[50px] sm:pb-0" {...{ ...fadeIn, transition: { delay: 0.8 } }}>
          <Container fluid>
            <Row className="justify-end">
              <Overlap value={80} className="col col-xl-4 col-lg-6 col-md-7 relative bg-[#23262d] md:text-start sm:text-center py-[5.5rem] px-[6.5rem] xl:px-[4.5rem] lg:p-14 sm:px-[15px] sm:py-0">
                <h2 className="heading-4 font-serif font-medium text-white mb-0 -tracking-[1px]">We lead in trusted&nbsp;
                  <span className="text-basecolor inline-block font-semibold text-decoration-line-bottom">BnB stays</span></h2>
              </Overlap>
            </Row>
          </Container>
        </m.section> */}
        {/* Section End - COMMENTED OUT FOR NOW */}

        {/* Section Start */}
        <section className="pt-[80px] pb-0 md:pt-[50px]">
          <Container>
            <Clients
              grid="row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4"
              theme="client-logo-style-02"
              data={ClientData}
              animation={fadeIn}
            />
          </Container>
        </section>
        {/* Section End */}

        {/* Section Start */}
        <m.section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-white" {...fadeIn}>
          <Container fluid>
            <Row className="justify-center">
              <Col className="text-center divider-full mb-[9.5rem] p-0 lg:mb-[5.5rem]">
                <div className="divider-border divider-light flex items-center w-full">
                  <span className="font-serif font-medium text-darkgray uppercase tracking-[1px] block px-[30px]">Latest BnBs</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                {latestLoading ? (
                  <LatestListingsSkeleton />
                ) : latestError ? (
                  <ErrorState 
                    title="Failed to load latest stays" 
                    message="We're having trouble loading our latest properties. Please try again."
                  />
                ) : portfolioData.length > 0 ? (
                  <Swiper className="work-architecture-slider"
                    spaceBetween={26}
                    slidesPerView="auto"
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={false}
                    modules={[Autoplay, Keyboard]}
                    keyboard={{ enabled: true, onlyInViewport: true }}
                    breakpoints={{
                      1200: { slidesPerView: 4 }, 992: { slidesPerView: 3 }, 768: { slidesPerView: 2 }
                    }} >
                    {
                      portfolioData.map((item, i) => {
                        return (
                          <SwiperSlide key={i} className="architecture-portfolio-slider">
                            <div className="portfolio-box">
                              <div className="portfolio-image flex relative">
                                <Link aria-label="link for img" to={item.link}>
                                  <img width={405} height={518} src={item.img} alt="slider" />
                                </Link>
                                <div className="portfolio-hover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                  <Link aria-label="link for button" className="bg-white w-[40px] h-[40px] inline-block align-middle leading-[40px] text-center mx-[3px] z-[3] relative border-white border-[2px] rounded-full" to={item.link}><i className="ti-arrow-right inline-block text-darkgray text-center"></i></Link>
                                </div>
                              </div>
                              <div className="portfolio-caption justify-center text-center py-[30px]">
                                <Link aria-label="link for title" className="text-white font-serif uppercase font-medium" to={item.link}>{item.title}</Link>
                                <span className="block uppercase text-sm">{item.subtitle}</span>
                              </div>
                            </div>
                          </SwiperSlide>
                        )
                      })
                    }
                  </Swiper>
                ) : (
                  <EmptyListingsState 
                    title="No latest stays available" 
                    message="Our latest listings are currently being updated. Please check back soon."
                  />
                )}
              </Col>
            </Row>
          </Container>
        </m.section>
        {/* Section End */}

        {/* Section Start */}
        <section className="pt-[130px] lg:pt-[90px] md:pt-[75px] sm:pt-[50px]  pb-[90px] md:pb-[75px] sm:pb-[50px] bg-white">
          <Container fluid>
            <Row className="justify-center">
              <Col className="text-center divider-full mb-32 p-0 lg:mb-[5.5rem] xs:mb-14">
                <m.div className="divider-border divider-light flex items-center w-full" {...fadeIn}>
                  <span className="font-serif font-medium text-darkgray uppercase tracking-[1px] block px-[30px]">HOMES</span>
                </m.div>
              </Col>
            </Row>
            <Row>
              <Col className="px-md-0">
                <BlogMetro pagination={false} grid="grid grid-4col xl-grid-4col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col gutter-extra-large" data={blogMetroData} />
              </Col>
            </Row>
            <Row className="mt-[80px] md:mt-[70px] sm:mt-[40px]">
              <Col className="text-center">
                <m.h2 className="heading-6 font-serif font-semibold text-white uppercase mb-0" {...fadeIn}>Are you ready to work with us? <Buttons ariaLabel="button" to="/page/contact-modern" className="font-semibold font-serif pt-0 uppercase btn-link after:h-[1px] md:text-md after:bg-[#cee002] after:!bottom-0 hover:text-white hover:!opacity-100 !text-[1.8rem] !leading-[2.5rem] hover:after:bg-white" color="#cee002" title="start a project" />
                </m.h2>
              </Col>
            </Row>
          </Container>
        </section>
        {/* Section End */}

        {/* Section Start */}
        <section className="bg-[rgba(0,0,0,0.02)] relative py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] overflow-hidden">
          <Container>
            <Row className="items-center justify-center">
              <Col lg={{ span: 5, offset: 2, order: 1 }} xs={{ order: 2 }}>
                <m.img width={458} height={258} src="https://via.placeholder.com/889x501" alt="..." {...{ ...zoomIn, transition: { duration: 0.7 } }} />
              </Col>
              <m.div className="md:mb-[50px] md:text-center col-xl-4 col-lg-5 col-md-7 offset-xl-1 order-lg-2 order-1" {...fadeIn}>
                <h2 className="heading-5 font-serif font-medium text-darkgray lg:w-[95%] md:w-full">Trusted stays across Kenya</h2>
                <p className="w-[80%] mb-[20px] md:w-full">From Nairobi apartments to Mombasa beach houses, we verify every listing for your peace of mind.</p>
                <Buttons ariaLabel="link for Get in touch" to="/page/contact-modern" className="font-medium font-serif uppercase btn-link after:h-[2px] md:text-md md:mb-[15px] after:bg-darkgray hover:text-darkgray" size="xl" color="#232323" title="Get in touch" />
              </m.div>
              <div className="top-1/2 w-auto font-serif font-semibold text-[200px] text-basecolor -tracking-[10px] -left-[50px] md:hidden md:right-0 md:-bottom-[40px] absolute opacity-20 text-start md:text-center lg:block">kenya</div>
            </Row>
          </Container>
        </section>
        {/* Section End */}

        {/* Footer Start */}
        <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
        {/* Footer End */}
      </div>
    </div>
  )
}

export default ArchitecturePage