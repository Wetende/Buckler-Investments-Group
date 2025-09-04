import React, { lazy, Suspense } from 'react'
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { fadeIn } from '../../Functions/GlobalAnimations'
import InteractiveBanners07 from '../../Components/InteractiveBanners/InteractiveBanners07'
import Testimonials from '../../Components/Testimonials/Testimonials'
import BlogClassic from '../../Components/Blogs/BlogClassic'
import Clients from '../../Components/Clients/Clients'
import { ClientData01 } from '../../Components/Clients/ClientsData'
import Overlap from '../../Components/Overlap/Overlap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '../../Components/Form/Form'
import MessageBox from '../../Components/MessageBox/MessageBox'

const Footer = lazy(() => import('../../Components/Footers/Footer').then(m => ({ default: m.Footer })))
const HeroWithSearch = lazy(() => import('../../Components/Home/Hero/HeroWithSearch'))
const FeaturedTours = lazy(() => import('../../Components/Home/Sections/FeaturedTours'))
const FeaturedRentals = lazy(() => import('../../Components/Home/Sections/FeaturedRentals'))
const RecentProperties = lazy(() => import('../../Components/Home/Sections/RecentProperties'))
const CarsHighlight = lazy(() => import('../../Components/Home/Sections/CarsHighlight'))
const InvestmentSpotlight = lazy(() => import('../../Components/Home/Sections/InvestmentSpotlight'))

export default function Home() {
  return (
    <>
      <Header topSpace={{ md: true }} type="reverse-scroll" className="sticky-header header-appear z-[15]">
        <HeaderNav
          theme="dark"
          bg="dark"
          menu="dark"
          fluid="fluid"
          expand="lg"
          containerClass="sm:!px-0"
          className="py-[0px] border-b border-[#ffffff1a] px-[35px] md:pr-[15px] md:pl-0 md:py-[20px]"
        >
          <Col xs="auto" lg={2} sm={6} className="me-auto ps-lg-0 me-auto ps-lg-0">
            <Link aria-label="header logo" className="flex items-center" to="/">
              <Navbar.Brand className="inline-block p-0 m-0">
                <img className="default-logo" width="111" height="36" loading="lazy" src="/assets/img/webp/logo-white.webp" data-rjs="/assets/img/webp/logo-white@2x.webp" alt="logo" />
                <img className="alt-logo" width="111" height="36" loading="lazy" src="/assets/img/webp/logo-black.webp" data-rjs="/assets/img/webp/logo-black@2x.webp" alt="logo" />
                <img className="mobile-logo" width="111" height="36" loading="lazy" src="/assets/img/webp/logo-black.webp" data-rjs="/assets/img/webp/logo-black@2x.webp" alt="logo" />
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
            <Menu />
          </Navbar.Collapse>
          <Col xs="auto" lg={2} className="nav-bar-contact text-end xs:hidden pe-0">
            <a aria-label="link for top" href="#top" className="text-md text-[#fff] font-serif font-medium">
              <i className="feather-phone-call mr-[15px]"></i>
              0222 8899900
            </a>
          </Col>
        </HeaderNav>
      </Header>

      <main style={{ paddingTop: 160 }}>
        <Suspense fallback={<div className="skeleton-loader" />}> <HeroWithSearch /> </Suspense>

        {/* Value props row */}
        <section className="py-[80px] border-b border-mediumgray bg-white md:py-[40px]">
          <Container>
            <Row className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 justify-center gap-y-10">
              {[{
                icon: 'line-icon-Headset',
                title: 'Expert support',
                subtitle: 'Contact support team'
              }, {
                icon: 'line-icon-Compass-3',
                title: 'Peaceful places',
                subtitle: 'Safe and trustworthy'
              }, {
                icon: 'line-icon-Administrator',
                title: 'Exclusive agents',
                subtitle: 'Trusted local experts'
              }, {
                icon: 'line-icon-Coin',
                title: 'Incredible price',
                subtitle: 'Best price guarantee'
              }].map((f, i) => (
                <Col key={i}>
                  <m.div className="flex justify-start text-left items-center" {...{ ...fadeIn, transition: { delay: 0.2 + i * 0.2 } }}>
                    <div className="flex items-center">
                      <i className={`${f.icon} text-[35px] text-neonorange mr-[30px]`}></i>
                    </div>
                    <div className="leading-[22px]">
                      <div className="text-[#262b35] font-serif font-medium leading-[20px] mb-[5px]">{f.title}</div>
                      <span>{f.subtitle}</span>
                    </div>
                  </m.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Top destinations */}
        <section className="py-[130px] overflow-hidden bg-lightgray lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <Row className="mb-24 md:mb-20 items-center">
              <Col lg={6} md={7} className="xs:text-center sm:mb-[10px] sm:text-center">
                <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">Top destinations</h2>
                <p className="m-0 block">Most popular in the last month</p>
              </Col>
            </Row>
            <InteractiveBanners07 grid="row-cols-1 row-cols-lg-4 row-cols-sm-2 gap-y-[30px]" className="justify-center" animation={fadeIn} animationDelay={0.1} />
          </Container>
        </section>

        <Suspense fallback={<div className="skeleton-loader" />}> <FeaturedTours /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <FeaturedRentals /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <RecentProperties /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <CarsHighlight /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <InvestmentSpotlight /> </Suspense>

        {/* Testimonials carousel */}
        <section className="py-[130px] overflow-hidden border-t border-mediumgray bg-gradient-to-b from-[#fff] via-[#fdfdfd] to-[#f7f7f7] lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <Row className="mb-20 md:mb-16 items-center">
              <Col lg={6} md={7} className="text-left sm:text-center sm:mb-[10px]">
                <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">Customer reviews</h2>
                <p className="m-0 block">Read testimonials from our happy customers</p>
              </Col>
            </Row>
            <Testimonials
              grid="row-cols-1 row-cols-md-2 row-cols-lg-3 justify-center gap-y-10"
              theme="testimonials-style-05"
              className="swiper-navigation-01 swiper-navigation-dark black-move p-[15px]"
              carousel={true}
              carouselOption={{
                slidesPerView: 1,
                loop: true,
                spaceBetween: 30,
                autoplay: { delay: 3000, disableOnInteraction: false },
                keyboard: { enabled: true, onlyInViewport: true },
                navigation: false,
                breakpoints: { 992: { slidesPerView: 3 }, 768: { slidesPerView: 2 } }
              }}
            />
          </Container>
        </section>

        {/* Overlap subscribe CTA */}
        <section className="pb-[130px] relative bg-white lg:pb-[90px] md:pb-[75px] sm:py-[50px]">
          <Container>
            <Row>
              <Overlap className="relative">
                <Col>
                  <m.div className="bg-neonorange rounded-[6px] flex flex-row items-center py-[40px] px-28 lg:px-20 xs:px-8 md:block" {...fadeIn}>
                    <h2 className="heading-6 font-serif font-medium text-darkgray -tracking-[1px] mb-[0] w-[45%] lg:mb-0 lg:w-[50%] md:w-full md:mb-[30px] md:block xs:mb-[20px] xs:text-center">Sign up for exclusive packages</h2>
                    <div className="relative w-[55%] lg:w-[50%] md:w-full">
                      <Formik
                        initialValues={{ email: '' }}
                        validationSchema={Yup.object().shape({ email: Yup.string().email('Invalid email.').required('Field is required.'), })}
                        onSubmit={async (values, actions) => {
                          actions.setSubmitting(true)
                          const utils = await import('../../Functions/Utilities')
                          const response = await utils.sendEmail(values)
                          response.status === 'success' && utils.resetForm(actions)
                        }}
                      >
                        {({ isSubmitting, status }) => (
                          <div className="relative subscribe-style-05">
                            <Form className="relative">
                              <Input showErrorMsg={false} type="email" name="email" className="rounded large-input border-[1px] xs:!pr-0" placeholder="Enter your email address" />
                              <button aria-label="Subscribe" type="submit" className={`text-xs py-[12px] px-[28px] uppercase mr-[10px] xs:!mr-0 xs:text-center${isSubmitting ? ' loading' : ''}`}>
                                <i className="far fa-envelope text-sm leading-none mr-[8px] xs:mr-0"></i>
                                Subscribe
                              </button>
                            </Form>
                            <AnimatePresence>
                              {status && (
                                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-[115%] mt-[10px] left-0 w-full">
                                  <MessageBox className="rounded-[4px] text-md py-[10px] px-[22px]" theme="message-box01" variant="success" message="You have been subscribed!" />
                                </m.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </Formik>
                    </div>
                  </m.div>
                </Col>
              </Overlap>
            </Row>
          </Container>
        </section>

        {/* Blog section */}
        <section className="pb-[130px] relative bg-white lg:pb-[90px] md:pb-[75px] sm:py-[50px]">
          <Container>
            <Row className="mt-32 mb-20 md:mb-16 items-center">
              <Col lg={6} md={7} className="text-left sm:text-center sm:mb-[10px]">
                <h3 className="heading-5 font-serif font-semibold text-darkgray -tracking-[1px] uppercase mb-[5px]">From the blog</h3>
                <p className="m-0 block">Hand picked articles and updates</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <BlogClassic grid="grid grid-4col xl-grid-4col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col gutter-extra-large" />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Clients / trust logos */}
        <section className="py-[80px] bg-white md:py-[60px] border-t border-mediumgray">
          <Container>
            <Clients grid="row row-cols-1 row-cols-md-4 row-cols-sm-2" theme="client-logo-style-01" data={ClientData01} />
          </Container>
        </section>
      </main>

      <Suspense fallback={<div />}> 
        <Footer parallax={{ desktop: true, lg: false }} /> 
      </Suspense>
    </>
  )
}


