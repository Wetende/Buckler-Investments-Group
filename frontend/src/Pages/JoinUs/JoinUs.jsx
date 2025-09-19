import React from 'react'

// Libraries
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import getBnbMenuData from '../../Components/Header/BnbMenuData'
import PageTitle from '../../Components/PageTitle/PageTitle'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import BecomeHostForm from '../../Components/HostApplication/BecomeHostForm'
import { fadeIn } from '../../Functions/GlobalAnimations'

const BecomeHostPage = (props) => {
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
          <Container fluid className="px-0">
            <div className="flex items-center justify-between w-full">
              {/* Logo */}
              <div className="col-auto">
                <a href="/" className="flex items-center">
                  <span className="font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">
                    Buckler Investment Group
                  </span>
                </a>
              </div>

              {/* Navigation */}
              <div className="col-auto">
                <div className="collapse navbar-collapse justify-center">
                  <Menu {...props} data={getBnbMenuData()} />
                </div>
              </div>

              {/* Contact */}
              <div className="col-auto text-end xs:hidden">
                <a href="#top" className="text-md text-[#fff] font-serif font-medium">
                  <i className="feather-phone-call mr-[15px]"></i>
                  0222 8899900
                </a>
              </div>
            </div>
          </Container>
        </HeaderNav>
      </Header>
      {/* Header End */}

      {/* Page Title */}
      <PageTitle
        title="Become a Host"
        subtitle="Share your space and start earning"
        page="Become a Host"
      />

      {/* Hero Section */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-lightgray">
        <Container>
          <Row className="justify-center">
            <Col md={8} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-basecolor opacity-40"></span>
                <div className="font-serif text-xmd text-basecolor px-[10px]">hosting platform</div>
                <span className="w-[25px] h-[1px] bg-basecolor opacity-40"></span>
              </div>
              <h1 className="heading-3 font-serif font-semibold text-darkgray uppercase tracking-[-1px] mb-6">
                Start Your Hosting Journey
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Join thousands of hosts who are earning extra income by sharing their unique spaces. 
                Our platform makes it easy to list your property, connect with guests, and manage bookings.
              </p>
            </Col>
          </Row>
          
          <Row className="row-cols-1 row-cols-lg-3 row-cols-md-2">
            <m.div className="col text-center mb-12 md:mb-16" {...{ ...fadeIn, transition: { delay: 0.2 } }}>
              <div className="bg-white w-[100px] h-[100px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-8">
                <i className="feather-home text-4xl text-basecolor"></i>
              </div>
              <h3 className="heading-6 font-serif font-semibold text-darkgray mb-4">List Your Space</h3>
              <p className="text-gray-600 leading-[26px]">
                Create an attractive listing with photos and detailed descriptions to showcase your property
              </p>
            </m.div>
            
            <m.div className="col text-center mb-12 md:mb-16" {...{ ...fadeIn, transition: { delay: 0.4 } }}>
              <div className="bg-white w-[100px] h-[100px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-8">
                <i className="feather-users text-4xl text-basecolor"></i>
              </div>
              <h3 className="heading-6 font-serif font-semibold text-darkgray mb-4">Welcome Guests</h3>
              <p className="text-gray-600 leading-[26px]">
                Connect with travelers and provide memorable experiences that keep guests coming back
              </p>
            </m.div>
            
            <m.div className="col text-center mb-12 md:mb-16" {...{ ...fadeIn, transition: { delay: 0.6 } }}>
              <div className="bg-white w-[100px] h-[100px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-8">
                <i className="feather-trending-up text-4xl text-basecolor"></i>
              </div>
              <h3 className="heading-6 font-serif font-semibold text-darkgray mb-4">Earn Income</h3>
              <p className="text-gray-600 leading-[26px]">
                Start earning from your property with flexible pricing and professional support
              </p>
            </m.div>
          </Row>
        </Container>
      </section>

      {/* Application Form Section */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <BecomeHostForm />
      </section>

      {/* Benefits Section */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-lightgray">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-basecolor opacity-40"></span>
                <div className="font-serif text-xmd text-basecolor px-[10px]">hosting benefits</div>
                <span className="w-[25px] h-[1px] bg-basecolor opacity-40"></span>
              </div>
              <h2 className="heading-4 font-serif font-semibold text-darkgray uppercase tracking-[-1px]">
                Why Host With Us?
              </h2>
            </Col>
          </Row>
          
          <Row className="row-cols-1 row-cols-lg-4 row-cols-md-2">
            <m.div className="col text-center mb-12 md:mb-16" {...{ ...fadeIn, transition: { delay: 0.2 } }}>
              <div className="bg-white w-[80px] h-[80px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-6">
                <i className="feather-shield text-3xl text-basecolor"></i>
              </div>
              <h4 className="heading-6 font-serif font-semibold text-darkgray mb-3">Secure Platform</h4>
              <p className="text-gray-600 text-sm leading-[22px]">
                Safe and secure platform with verified guests and comprehensive host protection
              </p>
            </m.div>
            
            <m.div className="col text-center mb-12 md:mb-16" {...{ ...fadeIn, transition: { delay: 0.4 } }}>
              <div className="bg-white w-[80px] h-[80px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-6">
                <i className="feather-dollar-sign text-3xl text-basecolor"></i>
              </div>
              <h4 className="heading-6 font-serif font-semibold text-darkgray mb-3">Competitive Rates</h4>
              <p className="text-gray-600 text-sm leading-[22px]">
                Low commission fees and fast payments directly to your account
              </p>
            </m.div>
            
            <m.div className="col text-center mb-12 md:mb-16" {...{ ...fadeIn, transition: { delay: 0.6 } }}>
              <div className="bg-white w-[80px] h-[80px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-6">
                <i className="feather-smartphone text-3xl text-basecolor"></i>
              </div>
              <h4 className="heading-6 font-serif font-semibold text-darkgray mb-3">Easy Management</h4>
              <p className="text-gray-600 text-sm leading-[22px]">
                User-friendly dashboard to manage bookings and communicate with guests
              </p>
            </m.div>
            
            <m.div className="col text-center mb-12 md:mb-16" {...{ ...fadeIn, transition: { delay: 0.8 } }}>
              <div className="bg-white w-[80px] h-[80px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-6">
                <i className="feather-camera text-3xl text-basecolor"></i>
              </div>
              <h4 className="heading-6 font-serif font-semibold text-darkgray mb-3">Marketing Support</h4>
              <p className="text-gray-600 text-sm leading-[22px]">
                Professional photography and marketing to maximize your bookings
              </p>
            </m.div>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-basecolor opacity-40"></span>
                <div className="font-serif text-xmd text-basecolor px-[10px]">common questions</div>
                <span className="w-[25px] h-[1px] bg-basecolor opacity-40"></span>
              </div>
              <h2 className="heading-4 font-serif font-semibold text-darkgray uppercase tracking-[-1px]">
                Frequently Asked Questions
              </h2>
            </Col>
          </Row>
          
          <Row className="justify-center">
            <Col lg={8}>
              <m.div {...fadeIn}>
                <div className="space-y-8">
                  <div className="border-b border-[#ededed] pb-8">
                    <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">
                      How much can I earn as a host?
                    </h4>
                    <p className="text-gray-700 leading-[26px]">
                      Earnings vary based on location, property type, and demand. Most hosts in Nairobi 
                      earn between KES 3,000 - KES 15,000 per night depending on their property type and amenities.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#ededed] pb-8">
                    <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">
                      What are the requirements to become a host?
                    </h4>
                    <p className="text-gray-700 leading-[26px]">
                      You need a valid ID, proof of property ownership or lease agreement, and your 
                      property must meet our safety and quality standards. We also verify your identity and property details.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#ededed] pb-8">
                    <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">
                      How long does the application process take?
                    </h4>
                    <p className="text-gray-700 leading-[26px]">
                      The application review typically takes 2-3 business days. Once approved, 
                      you can start listing your property immediately and receive bookings.
                    </p>
                  </div>
                  
                  <div className="pb-8">
                    <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">
                      What support do you provide to hosts?
                    </h4>
                    <p className="text-gray-700 leading-[26px]">
                      We provide 24/7 support, professional photography services, marketing assistance, 
                      guest screening, and comprehensive host protection to ensure a smooth hosting experience.
                    </p>
                  </div>
                </div>
              </m.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
    </div>
  )
}

export default BecomeHostPage
