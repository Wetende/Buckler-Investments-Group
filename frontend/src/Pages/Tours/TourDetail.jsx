import React from "react";
import { useParams } from "react-router-dom";

// Libraries
import { Col, Container, Row } from "react-bootstrap";
import { m } from "framer-motion";

// Components
import Header, { HeaderNav, Menu } from "../../Components/Header/Header";
import FooterStyle10 from "../../Components/Footers/FooterStyle10";
import Buttons from "../../Components/Button/Buttons";
import { fadeIn, fadeInLeft } from "../../Functions/GlobalAnimations";

// API hooks
import { useTour, useTourAvailability } from "../../api/useTours";

const TourDetail = (props) => {
  const { id } = useParams();
  
  // Load tour details
  const { data: tour, isLoading, isError } = useTour(id);
  
  // Load availability for next 30 days
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { data: availability } = useTourAvailability(id, { start_date: startDate, end_date: endDate });

  // Get next available date
  const nextAvailable = availability && availability.length > 0 
    ? availability.find(slot => slot.available_spots > 0)
    : null;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neonorange"></div>
          <p className="mt-4 text-lg">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Tour not found or error loading details.</p>
          <Buttons
            ariaLabel="back to tours"
            href="/tours"
            className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase mt-4"
            themeColor="#232323"
            color="#fff"
            title="Back to Tours"
          />
        </div>
      </div>
    );
  }

  return (
    <div style={props.style}>
      
      {/* Header Start */}
      <Header topSpace={{ md: true }} type="reverse-scroll">
        <HeaderNav
          theme="dark"
          fluid="fluid"
          expand="lg"
          containerClass="sm:!px-0"
          className="py-[0px] border-b border-[#ffffff1a] px-[35px] md:pr-[15px] md:pl-0 md:py-[20px]"
        >
          <Col xs="auto" lg={2} sm={6} className="me-auto ps-lg-0">
            <a aria-label="header logo" className="flex items-center" href="/">
              <span className="default-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">
                Buckler Investment Group
              </span>
            </a>
          </Col>
          <div className="navbar-collapse col-xs-auto col-lg-8 menu-order px-lg-0 justify-center">
            <Menu {...props} />
          </div>
        </HeaderNav>
      </Header>
      {/* Header End */}

      <div className="bg-white">
        {/* Hero Section */}
        <section 
          className="py-[200px] lg:py-[150px] md:py-[120px] sm:py-[100px] cover-background"
          style={{
            backgroundImage: `url(${tour.image || 'https://via.placeholder.com/1920x1080'})`,
          }}
        >
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <Container className="relative z-10">
            <Row className="justify-center">
              <Col lg={8} className="text-center text-white">
                <m.h1 
                  className="heading-2 font-serif font-semibold mb-[20px] -tracking-[1px]"
                  {...fadeIn}
                >
                  {tour.title || tour.name}
                </m.h1>
                <m.p 
                  className="text-lg leading-[28px] lg:text-xmd mb-[30px]"
                  {...{...fadeIn, transition: { delay: 0.2 }}}
                >
                  {tour.description || "Experience an amazing adventure"}
                </m.p>
                <m.div 
                  className="flex items-center justify-center gap-6 text-sm"
                  {...{...fadeIn, transition: { delay: 0.4 }}}
                >
                  {tour.duration && (
                    <span className="flex items-center">
                      <i className="feather-clock mr-2"></i>
                      {tour.duration}
                    </span>
                  )}
                  {tour.max_participants && (
                    <span className="flex items-center">
                      <i className="feather-users mr-2"></i>
                      Max {tour.max_participants} guests
                    </span>
                  )}
                  {nextAvailable && (
                    <span className="flex items-center">
                      <i className="feather-calendar mr-2"></i>
                      Next: {new Date(nextAvailable.date).toLocaleDateString()}
                    </span>
                  )}
                </m.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Tour Details Section */}
        <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <Row>
              <Col lg={8} className="pr-[50px] lg:pr-[30px] md:pr-0 md:mb-[50px]">
                <m.div {...fadeInLeft}>
                  <h2 className="heading-5 font-serif font-semibold text-darkgray mb-[30px] -tracking-[1px]">
                    Tour Overview
                  </h2>
                  <p className="mb-[25px] leading-[28px]">
                    {tour.description || "Discover the beauty and adventure of Kenya with this amazing tour experience."}
                  </p>
                  
                  {tour.included_services && (
                    <div className="mb-[30px]">
                      <h3 className="text-lg font-serif font-semibold mb-[15px]">What's Included</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {tour.included_services.split(',').map((service, index) => (
                          <li key={index}>{service.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {availability && availability.length > 0 && (
                    <div className="mb-[30px]">
                      <h3 className="text-lg font-serif font-semibold mb-[15px]">Upcoming Dates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availability.slice(0, 6).map((slot, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="font-medium">{new Date(slot.date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-600">
                              {slot.available_spots} spots available
                              {slot.price_override && (
                                <span className="ml-2 text-neonorange font-medium">
                                  Special Price: {slot.price_override} {tour.currency || 'KES'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </m.div>
              </Col>

              <Col lg={4}>
                <m.div 
                  className="bg-lightgray p-[40px] rounded-lg"
                  {...{...fadeIn, transition: { delay: 0.3 }}}
                >
                  <div className="mb-[30px]">
                    <div className="text-[28px] font-serif font-semibold text-darkgray mb-[10px]">
                      {tour.price ? `${tour.price} ${tour.currency || 'KES'}` : 'From KES 25,000'}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>

                  <div className="space-y-4 mb-[30px]">
                    {tour.duration && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{tour.duration}</span>
                      </div>
                    )}
                    {tour.max_participants && (
                      <div className="flex justify-between">
                        <span>Max Guests:</span>
                        <span className="font-medium">{tour.max_participants}</span>
                      </div>
                    )}
                    {nextAvailable && (
                      <div className="flex justify-between">
                        <span>Next Available:</span>
                        <span className="font-medium">{new Date(nextAvailable.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <Buttons
                    ariaLabel="book tour"
                    href="#"
                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full mb-[15px]"
                    themeColor="#232323"
                    color="#fff"
                    size="lg"
                    title="Book This Tour"
                  />

                  <Buttons
                    ariaLabel="back to all tours"
                    href="/tours"
                    className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase w-full"
                    themeColor="#232323"
                    color="#232323"
                    size="lg"
                    title="View All Tours"
                  />
                </m.div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      {/* Footer Start */}
      <FooterStyle10
        className="text-slateblue"
        logo="/assets/img/webp/logo-neon-orange-white.webp"
      />
      {/* Footer End */}
    </div>
  );
};

export default TourDetail;
