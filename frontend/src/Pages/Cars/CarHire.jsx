import React, { useState } from 'react'

// Libraries
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Parallax } from 'react-scroll-parallax'
import { m } from "framer-motion"
import { Link as ScrollTo } from "react-scroll"

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import BucklerMenuData from '../../Components/Header/BucklerMenuData'
import Buttons from '../../Components/Button/Buttons'
import Overlap from '../../Components/Overlap/Overlap'
import Tab03 from '../../Components/Tab/Tab03'
import Testimonials from '../../Components/Testimonials/Testimonials'
import TextSlider03 from '../../Components/TextSlider/TextSlider03'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import CarSearch from '../../Components/CarSearch/CarSearch'
import VehicleListing from '../../Components/VehicleListing/VehicleListing'

// Data
import { TestimonialsData04 } from '../../Components/Testimonials/TestimonialsData'
import { TextSliderData03 } from '../../Components/TextSlider/TextSliderData'
import { TabData03 } from '../../Components/Tab/TabData'

// API Hooks
import { useFeaturedVehicles, useVehicleCategories } from '../../api/useCars'

// Animations
import { fadeIn, fadeInUp, zoomIn } from "../../Functions/GlobalAnimations"

const CarHirePage = (props) => {
  const [searchFilters, setSearchFilters] = useState({})
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Fetch featured vehicles for display
  const { data: featuredVehicles = [], isLoading: featuredLoading } = useFeaturedVehicles(6)
  const { data: categories = [] } = useVehicleCategories()

  const handleSearch = (filters) => {
    setSearchFilters(filters)
    setShowSearchResults(Object.keys(filters).length > 0)
  }

  return (
    <div>
      {/* Header Start */}
      <Header topSpace={{ md: true }} type="header-always-fixed">
        <HeaderNav fluid="fluid" theme="dark" bg="dark" expand="lg" className="px-[35px] py-[0px] md:pr-[15px] sm:pr-0 md:pl-0 md:py-[20px] bg-[#23262d]">
          <Col lg={2} sm={6} className="col-auto me-auto ps-lg-0 sm:!pl-0">
            <Link aria-label="header home link" className="flex items-center" to="/">
              <Navbar.Brand className="inline-block p-0 m-0">
                <span className="default-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                <span className="alt-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-darkgray whitespace-nowrap">Buckler Investment Group</span>
                <span className="mobile-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-darkgray whitespace-nowrap">Buckler Investment Group</span>
              </Navbar.Brand>
            </Link>
          </Col>
          <Navbar.Toggle className="order-last md:ml-[25px] sm:ml-[17px]">
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
          </Navbar.Toggle>
          <Navbar.Collapse className="col-auto justify-center menu-order px-lg-0 restaurant-header-menu">
            <Menu {...props} data={BucklerMenuData} />
          </Navbar.Collapse>
          <Col className="col-auto col-lg-2 text-right pe-0 font-size-0 sm:hidden">
            <ScrollTo href="#" to="experience" offset={0} delay={0} spy={true} smooth={true} duration={800}>
              <Buttons type="submit" className="btn-fill font-medium font-serif rounded-[2px] uppercase md:mb-0" themeColor="#ca943d" color="#fff" size="xs" title="Hire a car" />
            </ScrollTo>
          </Col>
        </HeaderNav>
      </Header>
      {/* Header End */}

      {/* Hero Section with Search Start */}
      <div id="parallax-section" className="full-screen md:flex md:items-center landscape:md:h-[700px] overflow-hidden relative">
        <Parallax className="lg-no-parallax bg-cover absolute top-[0px] left-0 md:-top-[30px] w-full h-[100vh]" translateY={[-40, 40]} style={{ backgroundImage: `url(https://via.placeholder.com/1920x1100)` }}></Parallax>
        <div className="absolute h-full w-full opacity-60 top-0 left-0 bg-darkgray"></div>
        <Container className="relative h-full">
          <Row className="justify-center items-center h-full">
            <Col xl={10} md={12} lg={10} className="flex-col flex justify-center text-center">
              <div className="mb-[80px]">
                <i className="feather-map-pin text-[70px] inline-block leading-[80px] text-[#ca943d] mb-[3.5rem]"></i>
                <h1 className="text-[100px] leading-[95px] font-serif font-semibold text-white uppercase -tracking-[4px] mb-[3.5rem] mx-auto lg:text-[90px] lg:leading-[90px] md:text-[70px] md:leading-[65px] sm:text-[45px] sm:leading-[43px] sm:-tracking-[1px]">Reliable<br></br>Car Hire</h1>
                <span className="font-serif text-md uppercase tracking-[3px] text-white opacity-70 block mb-[50px]">Self-drive and chauffeur options across Kenya</span>
              </div>
              
              {/* Search Component */}
              <div className="search-wrapper">
                <CarSearch
                  onSearch={handleSearch}
                  className="hero-search"
                />
              </div>
            </Col>
          </Row>
          
          {!showSearchResults && (
            <ScrollTo aria-label="Scrolling Link" href="#" to="about" offset={0} delay={0} spy={true} smooth={true} duration={800} className="absolute bottom-[50px] left-1/2 -translate-x-1/2 cursor-pointer">
              <span className="hidden">Link for Scrolling</span>
              <i className="ti-mouse icon-small text-white up-down-ani text-[28px] inline-block"></i>
            </ScrollTo>
          )}
        </Container>
      </div>
      {/* Hero Section with Search End */}

      {/* Search Results Section */}
      {showSearchResults && (
        <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <VehicleListing
            initialFilters={searchFilters}
            showSearch={false}
            title="Search Results"
            subtitle="Vehicles matching your criteria"
          />
        </section>
      )}

      {/* Section Start */}
      <m.section {...fadeIn} id="about" className="pt-[9%] pb-[384px] md:pb-[200px] sm:pb-[7%] xs:pt-32 xs:pb-35 restaurant-experience" style={{ background: `url(https://via.placeholder.com/1920x80) center top no-repeat, url(https://via.placeholder.com/200x319) right top 140px no-repeat` }}>
        <Container>
          <Row className="items-center xs:text-center">
            <Col lg={2} className="md:mb-[25px]">
              <m.img width={150} height={149} className="w-[auto] xs:mx-auto" {...{ ...zoomIn, transition: { duration: 0.8 } }} src="https://via.placeholder.com/150x149" alt="vegetables" />
            </Col>
            <Col xl={4} lg={5} sm={7} className="md:mb-[20px]">
              <m.h2 {...{ ...fadeIn, transition: { delay: 0.4 } }} className="heading-5 font-serif font-medium text-darkgray mb-0 -tracking-[1px]">Affordable, flexible <span className="font-bold">car hire</span> across Kenya</m.h2>
            </Col>
            <Col lg={5} md={7} sm={8} className="pl-24 lg:pl-[15px]">
              <m.div {...{ ...fadeIn, transition: { delay: 0.8 } }}>
                <p className="mb-[20px]">Hire quality vehicles for city errands, upcountry trips, and safaris. Daily, weekly, and monthly plans with insurance options.</p>
                <Buttons to="/cars" className="font-medium font-serif uppercase btn-link after:h-[2px] hover:text-black md:text-md md:mb-[15px] after:bg-darkgray" size="xl" color="#232323" title="About car hire" />
              </m.div>
            </Col>
          </Row>
        </Container>
      </m.section>
      {/* Section End */}

      {/* Overlap Section Start */}
      <section className="bg-[#f8f4f0] pb-[130px] xl:pb-[90px] lg:pb-[75px] sm:py-[50px]">
        <Container fluid className="mb-20">
          <Row className="justify-center">
            <Overlap>
              <Col xs={12} className="text-center relative">
                <m.img width={1459} height={500} {...{ ...zoomIn, transition: { duration: 0.8 } }} className="w-full m-auto" src="https://via.placeholder.com/1459x500" alt="" />
              </Col>
            </Overlap>
          </Row>
        </Container>
        <Container>
          <m.div {...fadeIn} className="justify-center row">
            <Col lg={4} md={6} className="text-center mb-[4.5rem] md:mb-16 sm:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[5px]">
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
                <div className="font-serif text-xmd text-[#ca943d] px-[10px]">popular choices</div>
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase -tracking-[1px] sm:mb-[15px]">Popular vehicles</h2>
            </Col>
          </m.div>
          <m.div className="row xs:justify-center restaurant-tab-style-03" {...fadeIn}>
            <Tab03 data={TabData03} />
          </m.div>
        </Container>
      </section>
      {/* Overlap Section End */}

      {/* Featured Vehicles Section */}
      {!showSearchResults && (
        <section className="py-[130px] overflow-hidden lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <Row className="justify-center">
              <Col lg={4} md={6} className="text-center mb-[4.5rem] md:mb-16 sm:mb-12">
                <div className="flex flex-row items-center justify-center text-center mb-[5px]">
                  <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
                  <div className="font-serif text-xmd text-[#ca943d] px-[10px]">travellers' choice</div>
                  <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
                </div>
                <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase -tracking-[1px] sm:mb-[15px]">Featured vehicles</h2>
              </Col>
            </Row>
            
            {featuredLoading ? (
              <Row className="row-cols-1 row-cols-lg-3 row-cols-md-2 justify-center">
                {[...Array(3)].map((_, index) => (
                  <Col key={index} className="text-center md:mb-[50px] sm:mb-[30px]">
                    <div className="animate-pulse">
                      <div className="bg-gray-200 rounded-[6px] h-[258px] mb-[40px]"></div>
                      <div className="bg-gray-200 h-4 w-3/4 mx-auto mb-2 rounded"></div>
                      <div className="bg-gray-200 h-3 w-1/2 mx-auto rounded"></div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row className="row-cols-1 row-cols-lg-3 row-cols-md-2 justify-center">
                {featuredVehicles.slice(0, 3).map((vehicle, index) => (
                  <m.div 
                    key={vehicle.id}
                    {...{ ...fadeIn, transition: { delay: index * 0.2 } }} 
                    className="col text-center interactive-banners-style-11 md:mb-[50px] sm:mb-[30px]"
                  >
                    <figure className="rounded-[6px] overflow-hidden relative">
                      <img 
                        width={360} 
                        height={258} 
                        className="w-full object-cover" 
                        src={vehicle.images?.[0] || "https://via.placeholder.com/720x515"} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                      />
                      <figcaption>
                        <div className="opacity-70 top-0 left-0 absolute w-full h-full bg-darkgray"></div>
                        <div className="flex flex-col items-center justify-center h-full">
                          <Link 
                            aria-label={`View ${vehicle.make} ${vehicle.model}`} 
                            to={`/cars/${vehicle.id}`} 
                            className="bg-[#ca943d] z-[1] p-6 text-xmd leading-[20px] rounded-full w-[110px] h-[110px] uppercase font-serif text-white flex flex-col justify-center hover:bg-[#b8832e] transition-colors"
                          >
                            From
                            <span className="font-semibold text-white -tracking-[.5px]">
                              KES {new Intl.NumberFormat().format(vehicle.daily_rate)}
                            </span>
                          </Link>
                        </div>
                      </figcaption>
                    </figure>
                    <div className="text-center mt-[40px] sm:mt-[20px]">
                      <Link to={`/cars/${vehicle.id}`}>
                        <span className="text-darkgray font-medium font-serif block text-golden-hover uppercase hover:text-[#ca943d] transition-colors">
                          {vehicle.make} {vehicle.model}
                        </span>
                      </Link>
                      <span className="text-spanishgray uppercase inline-block text-sm">
                        {vehicle.transmission} 
                        <span className="text-xxs inline-block mx-[10px]">◍</span> 
                        {vehicle.fuel_type} 
                        <span className="text-xxs leading-none inline-block align-middle mx-[10px]">◍</span> 
                        {vehicle.seats} SEATS
                      </span>
                    </div>
                  </m.div>
                ))}
              </Row>
            )}
          </Container>
        </section>
      )}
      {/* Featured Vehicles Section End */}

      {/* Section Start */}
      <section className="p-0 overflow-hidden">
        <Container fluid className="px-0">
          <Row className="gx-0">
            <Col xl={6} className="p-0">
              <m.div {...fadeIn} className="block flex flex-column flex-md-row h-full">
                <Col md={6} className="cover-background sm:h-[700px]" style={{ backgroundImage: `url(https://via.placeholder.com/488x778)` }}></Col>
                <Col md={6} className="bg-[#f8f4f0] flex flex-col justify-center text-start px-12 xl:px-[15px] lg:p-20 md:px-[2.5rem]">
                  <img width={57} height={40} src="/assets/img/webp/home-restaurant-img-transparent-05.webp" className="self-start mb-[20px]" alt="" />
                  <h2 className="heading-4 font-serif font-light text-darkgray -tracking-[1px] w-[85%] mb-12 xs:w-full xs:mb-[15px]">Fleet manager <span className="font-semibold">testimonial</span></h2>
                  <span className="text-[18px] text-darkgray leading-[30px] block w-[75%] mb-[20px] xs:mb-[30px] xl:w-[80%] xs:w-full">Reliable vehicles maintained to the highest standards for your peace of mind.</span>
                  <p className="w-[75%] xs:w-full">Every car in our fleet undergoes regular maintenance and safety checks. From compact city cars to rugged safari vehicles, we ensure you travel with confidence.</p>
                  <img width={146} height={44} src="/assets/img/webp/home-restaurant-img-transparent-06.webp" className="w-[auto] self-start mt-[25px] pt-[25px] xs:mt-[10px]" alt="" />
                </Col>
              </m.div>
            </Col>
            <Col xl={6} className="p-0">
              <Row className="g-0">
                <Col xs={{ order: 1 }} sm={{ span: 6, order: 1 }} className="p-0">
                  <m.div {...fadeIn} className="text-center px-24 py-32 xl:py-24 xl:px-16 lg:px-28 sm:px-24 bg-darkgray">
                    <span className="font-serif font-medium text-[#ca943d] tracking-[1px] text-md block uppercase mb-[20px]">Best for trips</span>
                    <h3 className="heading-4 font-serif text-white mb-0"><span className="font-semibold md:block">Business</span> travel solutions</h3>
                  </m.div>
                </Col>
                <m.div {...{ ...fadeIn, transition: { delay: 0.2 } }} className="col-12 col-sm-6 order-2 cover-background xs:h-[300px]" style={{ backgroundImage: `url(https://via.placeholder.com/960x777)` }}></m.div>
                <m.div {...{ ...fadeIn, transition: { delay: 0.4 } }} className="col-12 col-sm-6 order-4 order-sm-3 px-0 cover-background xs:h-[300px]" style={{ backgroundImage: `url(https://via.placeholder.com/960x777)` }}></m.div>
                <Col xs={{ order: 2 }} sm={{ span: 6, order: 4 }}>
                  <m.div {...{ ...fadeIn, transition: { delay: 0.6 } }} className="text-center px-24 py-32 xl:py-24 xl:px-16 lg:px-28 sm:px-24">
                    <span className="font-serif font-medium text-[#ca943d] tracking-[1px] text-md block uppercase mb-[20px]">Best for leisure</span>
                    <h3 className="heading-4 font-serif text-darkgray mb-0"><span className="font-semibold md:block">Weekend</span> getaway packages</h3>
                  </m.div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="py-[130px] overflow-hidden lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col lg={4} md={6} className="text-center mb-[4.5rem] md:mb-16 sm:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[5px]">
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
                <div className="font-serif text-xmd text-[#ca943d] px-[10px]">customer favorite</div>
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
              </div>
              <m.h2 {...fadeIn} className="heading-5 font-serif font-semibold text-darkgray uppercase -tracking-[1px] sm:mb-[15px]">CUSTOMER PICKS</m.h2>
            </Col>
          </Row>
          <Row className="justify-center row-cols-1 row-cols-lg-3 row-cols-md-2">
            <Col className="col text-center md:mb-[30px]">
              <m.img width={309} height={303} {...{ ...zoomIn, transition: { ease: "easeInOut", duration: 0.8 } }} className="w-[auto] m-auto" src="https://via.placeholder.com/309x303" alt="" />
              <div className="py-[40px] relative text-start flex items-center justify-center w-auto xs:py-[15px]">
                <h3 className="heading-5 text-[#ca943d] self-center border-r border-mediumgray -tracking-[.5px] mr-[30px] pr-[25px] mb-0">01</h3>
                <div className="inline-block align-top">
                  <div className="text-xmd text-darkgray font-medium">Compact city car</div>
                  <span>Fuel efficient, easy parking</span>
                </div>
              </div>
            </Col>
            <Col className="text-center md:mb-[30px]">
              <m.img width={309} height={303} {...{ ...zoomIn, transition: { delay: 0.2, ease: "easeInOut", duration: 0.8 } }} className="w-[auto] m-auto" src="https://via.placeholder.com/309x303" alt="" />
              <div className="py-[40px] relative text-start flex items-center justify-center w-auto xs:py-[15px]">
                <h3 className="heading-5 text-[#ca943d] self-center border-r border-mediumgray -tracking-[.5px] mr-[30px] pr-[25px] mb-0">02</h3>
                <div className="inline-block align-top">
                  <div className="text-xmd text-darkgray font-medium">Comfort sedan</div>
                  <span>Spacious boot, AC</span>
                </div>
              </div>
            </Col>
            <Col className="text-center" >
              <m.img width={309} height={303} {...{ ...zoomIn, transition: { delay: 0.4, ease: "easeInOut", duration: 0.8 } }} className="w-[auto] m-auto" src="https://via.placeholder.com/309x303" alt="" />
              <div className="py-[40px] relative text-start flex items-center justify-center w-auto xs:py-[15px]">
                <h3 className="heading-5 text-[#ca943d] self-center border-r border-mediumgray -tracking-[.5px] mr-[30px] pr-[25px] mb-0">03</h3>
                <div className="inline-block align-top">
                  <div className="text-xmd text-darkgray font-medium">Safari-ready 4x4</div>
                  <span>High clearance, rugged</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <m.section id="experience" {...{ ...fadeIn, transition: { duration: 1 } }} className="bg-[#f8f4f0] py-[130px] overflow-hidden lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col lg={4} md={6} className="text-center mb-[4.5rem] md:mb-16 sm:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[5px]">
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
                <div className="font-serif text-xmd text-[#ca943d] px-[10px]">rental experience</div>
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase -tracking-[1px] sm:mb-[15px]">EXQUISITE SERVICES</h2>
            </Col>
          </Row>
        </Container>
        <TextSlider03
          data={TextSliderData03}
          className="sm:px-[15px] black-move"
          carousalOption={{
            spaceBetween: 30,
            slidesPerView: 1,
            autoplay: { delay: 4500, disableOnInteraction: false },
            breakpoints: { 1199: { slidesPerView: 2 } }
          }} />
      </m.section>
      {/* Section End */}

      {/* Section Start */}
      <section className="py-[130px] overflow-hidden lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col lg={4} md={6} className="text-center mb-[4.5rem] md:mb-16 sm:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[5px]">
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
                <div className="font-serif text-xmd text-[#ca943d] px-[10px]">happy customers </div>
                <span className="w-[25px] h-[1px] bg-[#ca943d] opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase -tracking-[1px] sm:mb-[15px]">OUR GUESTBOOK</h2>
            </Col>
          </Row>
          <Row className='justify-center'>
            <Col md={12} sm={8}>
              <Testimonials
                grid="row-cols-1 row-cols-md-2 row-cols-lg-3 gap-y-[30px] justify-center"
                theme='testimonials-style-04'
                className=""
                data={TestimonialsData04}
                animation={fadeIn}
                animationDelay={0.2}
              />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="p-0">
        <Container fluid>
          <Row xl={4} sm={2} xs={1}>
            <m.div {...fadeInUp} className="col mt-[3.5rem] cover-background h-[650px] px-0 lg:m-0 md:h-[500px] xs:h-[450px]" style={{ backgroundImage: `url(https://via.placeholder.com/800x1081)` }}>
              <div className="absolute top-0 left-0 w-full h-full opacity-70 bg-darkgray"></div>
              <div className="flex flex-col h-full p-20 text-center relative z-[1] xl:px-12 lg:px-16">
                <span className="font-serif font-medium uppercase text-[#ca943d]">Weekend getaways</span>
                <h2 className="heading-4 font-serif font-semibold text-white uppercase -tracking-[.5px]">SUVs for safaris</h2>
                <div className="mt-auto">
                  <Buttons aria-label="Hire now" href="#" className="btn-fill btn-fancy mt-auto inline-block font-medium font-serif rounded uppercase md:mb-[15px]" themeColor="#ca943d" color="#fff" size="sm" title="Hire now" />
                </div>
              </div>
            </m.div>
            <m.div {...fadeInUp} className="cover-background h-[650px] px-0 md:h-[500px] xs:h-[450px]" style={{ backgroundImage: `url(https://via.placeholder.com/800x1081)` }}>
              <div className="flex flex-col h-full justify-start p-24 text-center relative z-index-1 xl:px-10 lg:px-32 md:px-20">
                <h2 className="heading-4 font-serif font-semibold text-darkgray uppercase mb-[15px] -tracking-[.5px]">Seasonal car hire offers</h2>
                <p className="mb-[25px]">Weekend specials, weekly discounts, and safari-ready 4x4 packages.</p>
                <div>
                  <Buttons aria-label="all offers link" href="#" className="btn-fill btn-fancy mt-[10px] font-medium font-serif rounded uppercase md:mb-[15px]" themeColor="#ca943d" color="#fff" size="sm" title="View all offers" />
                </div>
              </div>
            </m.div>
            <m.div {...fadeInUp} className="mt-14 cover-background h-[650px] px-0 lg:m-0 md:h-[500px] xs:h-[450px]" style={{ backgroundImage: `url(https://via.placeholder.com/800x1081)` }}>
              <div className="absolute top-0 left-0 w-full h-full opacity-70 bg-darkgray"></div>
              <div className="flex flex-col h-full p-20 text-center relative z-[1] xl:px-12 lg:px-32">
                <span className="font-serif font-medium uppercase text-[#ca943d]">Weekend trips</span>
                <h2 className="heading-4 font-serif font-semibold text-white uppercase mb-0 mt-auto -tracking-[.5px]">Family minivans</h2>
                <Link aria-label="link Barbecue festival" to="#" className="w-[40px] h-[40px] leading-[40px] bg-[#ca943d] rounded-full self-center mt-auto">
                  <i className="fas fa-arrow-right text-sm text-white"></i>
                </Link>
              </div>
            </m.div>
            <m.div {...fadeInUp} className="cover-background h-[650px] px-0 md:h-[500px] xs:h-[450px]" style={{ backgroundImage: `url(https://via.placeholder.com/800x1081)` }}>
              <div className="flex flex-col h-full justify-start py-20 px-24 text-center relative z-[1] xl:px-12 lg:px-32">
                <span className="font-serif font-medium uppercase text-darkgray block mb-[15px]">All seasons</span>
                <h2 className="heading-4 font-serif font-semibold text-white uppercase -tracking-[.5px]">Long-term rentals</h2>
                <Link aria-label="Healthy cooking night" to="#" className="w-[40px] h-[40px] leading-[40px] bg-white rounded-full self-center">
                  <i className="fas fa-arrow-right text-sm text-black"></i>
                </Link>
              </div>
            </m.div>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="py-[160px] overflow-hidden lg:py-[120px] md:py-[95px] sm:py-[80px]">
        <Container>
          <Row lg={4} sm={2} xs={1}>
            <m.div  {...{ ...fadeIn, transition: { delay: 0.2 } }} className="text-center md:mb-[40px]" >
              <i className="feather-map-pin text-[28px] text-[#ca943d] mb-[25px] sm:mb-[10px] block"></i>
              <div className="text-darkgray uppercase text-md font-semibold font-serif tracking-[1px] mb-[10px]">Contact us</div>
              <p className="w-[75%] lg:w-full md:w-[60%] sm:w-[75%] mx-auto">401 Broadway, 24th Floor New York, NY 10013.</p>
            </m.div>
            <m.div {...{ ...fadeIn, transition: { delay: 0.4 } }} className="text-center md:mb-[40px]">
              <i className="feather-phone-call text-[28px] text-[#ca943d] mb-[25px] sm:mb-[10px] block"></i>
              <div className="text-darkgray uppercase text-md font-semibold font-serif tracking-[1px] mb-[10px]">Let's Talk</div>
              <p className="w-[70%] lg:w-full mx-auto">Phone: 1-800-222-000<br />Fax: 1-800-222-002</p>
            </m.div>
            <m.div {...{ ...fadeIn, transition: { delay: 0.6 } }} className="text-center xs:mb-[40px]">
              <i className="feather-mail text-[28px] text-[#ca943d] mb-[25px] sm:mb-[10px] block"></i>
              <div className="text-darkgray uppercase text-md font-semibold font-serif tracking-[1px] mb-[10px] sm:mb-0">Tickets info</div>
              <p className="w-[70%] lg:w-full mx-auto">
                <a aria-label="gmail link" rel="noreferrer" href="mailto:info@yourdomain.com" className="hover:text-[#ca943d]">info@yourdomain.com</a><br />
                <a aria-label="gmail link" rel="noreferrer" href="mailto:hr@yourdomain.com" className="hover:text-[#ca943d]">hr@yourdomain.com</a>
              </p>
            </m.div>
            <m.div {...{ ...fadeIn, transition: { delay: 0.8 } }} className="text-center xs:mb-[40px]">
              <i className="feather-globe text-[28px] text-[#ca943d] text-pink mb-[25px] sm:mb-[10px] block"></i>
              <div className="text-darkgray uppercase text-md font-semibold font-serif tracking-[1px] mb-[10px]">Event details</div>
              <p className="w-[75%] lg:w-full md:w-[60%] sm:w-[75%] mx-auto">Lorem ipsum is simply dummy text printing</p>
            </m.div>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="overflow-visible relative py-0">
        <ScrollTo href="#" to="parallax-section" offset={0} delay={0} spy={true} smooth={true} duration={800} className="left-1/2 top-1/2 absolute -translate-x-1/2 z-[1] -translate-y-1/2 cursor-pointer">
          <m.img {...{ ...zoomIn, transition: { duration: 0.8 } }} width={198} height={197} className="w-[auto] md:w-[150px] sm:w-[100px]" src="https://via.placeholder.com/198x197" alt="restaurant" />
        </ScrollTo>
      </section>
      {/* Section Start */}

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}

    </div>
  )
}

export default CarHirePage