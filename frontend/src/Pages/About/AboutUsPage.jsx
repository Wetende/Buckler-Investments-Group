import React from 'react'

// Components
import Header, { HeaderNav, Menu, Topbar } from "../../Components/Header/Header";
import HomeMenuData from "../../Components/Header/HomeMenuData";
import AuthButtons from "../../Components/Header/AuthButtons";
import Brand from "../../Components/Header/Brand";
import { fadeIn } from '../../Functions/GlobalAnimations'
import Buttons from '../../Components/Button/Buttons'
import Clients from '../../Components/Clients/Clients'
import FancyTextBox from '../../Components/FancyTextBox/FancyTextBox'
import Team from '../../Components/Team/Team'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import IconWithText from '../../Components/IconWithText/IconWithText'
import Lists from '../../Components/Lists/Lists'
import Counter from '../../Components/Counters/Counter'
import Overlap from '../../Components/Overlap/Overlap'
import CustomModal from '../../Components/CustomModal'

// Libraries
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Col, Container, Row, Navbar } from 'react-bootstrap'
import { Parallax } from 'react-scroll-parallax'
import { Swiper, SwiperSlide } from "swiper/react";
import { m } from 'framer-motion'
import { Link as ScrollTo } from "react-scroll"

// Data
import { ClientData01 } from "../../Components/Clients/ClientsData";
import { fancyTextBox04 } from '../../Components/FancyTextBox/FancyTextBoxData';
import { TeamData04 } from '../../Components/Team/TeamData';

const TestimonialsCarouselData = [
  {
    img: "https://via.placeholder.com/800x622",
    title: "Investment Excellence",
    number: "01",
    content: "Strategic investment opportunities across East Africa's growing markets.",
  },
  {
    img: "https://via.placeholder.com/800x622",
    title: "Property Innovation",
    number: "02",
    content: "Premium real estate solutions connecting investors with prime properties.",
  },
  {
    img: "https://via.placeholder.com/800x622",
    title: "Travel & Hospitality",
    number: "03",
    content: "Comprehensive travel services from BnB stays to luxury safari experiences.",
  },
]

const ListData = [
  {
    icon: "feather-arrow-right-circle",
    content: "Comprehensive investment platform for East Africa"
  },
  {
    icon: "feather-arrow-right-circle",
    content: "Verified properties and trusted accommodation partners",
  },
  {
    icon: "feather-arrow-right-circle",
    content: "Seamless booking and investment management experience",
  },
]

const CounterData05 = [
  {
    number: {
      text: "500+",
      class: "text-red-600"
    },
    title: "Properties Listed",
    content: "Across East Africa",
  },
  {
    number: {
      text: "2,000+",
      class: "text-red-600"
    },
    title: "Successful Bookings",
    content: "Happy travelers",
  },
  {
    number: {
      text: "150+",
      class: "text-red-600"
    },
    title: "Investment Projects",
    content: "Growing portfolio",
  },
]
const IconWithTextData = [
  {
    icon: "line-icon-Building text-red-600",
    title: "Investment Opportunities",
    content: "Strategic investment opportunities across East Africa's most promising markets, from real estate to emerging businesses with verified growth potential.",
  },
  {
    icon: "line-icon-House-3 text-red-600",
    title: "Property Solutions",
    content: "Comprehensive property listings connecting buyers, sellers, and renters with prime real estate opportunities throughout Kenya and beyond.",
  },
  {
    icon: "line-icon-Suitcase text-red-600",
    title: "Travel & Hospitality",
    content: "From luxury safari experiences to comfortable BnB accommodations, we provide complete travel solutions for every type of East African adventure.",
  },
  {
    icon: "line-icon-Car text-red-600",
    title: "Transportation Services",
    content: "Reliable car hire services connecting you with trusted vehicle rental partners for seamless travel across Kenya and East Africa.",
  },
]
const AboutUsPage = (props) => {

  return (
    <div style={props.style}>
      {/* Header Start */}
      <Header topSpace={{ desktop: true }} type="reverse-scroll">
        {/* Header Start */}
        <HeaderNav fluid="fluid" theme="light" bg="white" expand="lg" containerClass="sm:!px-0" className="py-[0px] px-[35px] md:pr-[15px] md:pl-0">
          <Col className="col-auto mr-auto ps-lg-0">
            <Link aria-label="header logo" className="flex items-center -mr-[35px]" to="/">
              <Brand defaultClass="text-[#232323]" altClass="text-[#232323]" mobileClass="text-[#232323]" />
            </Link>
          </Col>
          <Navbar.Toggle className="order-last md:ml-[25px] sm:ml-[17px]">
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
          </Navbar.Toggle>
          <Navbar.Collapse className="col-auto justify-center">
            <Menu {...props} data={HomeMenuData} />
          </Navbar.Collapse>
          <Col className="col-auto text-right !pr-0">
            <AuthButtons />
          </Col>
        </HeaderNav>
        {/* Header End */}
      </Header>
      {/* Header End */}
      
      {/* Parallax Scrolling Start */}
      <div className="h-[660px] lg:h-[580px] md:h-[550px] sm:h-[500px] xs:h-[380px] flex items-center overflow-hidden relative">
        <Parallax className="lg-no-parallax bg-cover cover-background absolute top-[0px] left-0 w-full h-[100vh]" translateY={[-40, 40]} style={{ backgroundImage: `url(https://via.placeholder.com/1920x1100)` }}></Parallax>
        <div className="absolute h-full w-full opacity-50 top-0 left-0 bg-darkgray"></div>
        <Container>
          <Row className="items-center justify-center">
            <Col md={8} xl={6} lg={7} sm={9} className="relative text-center">
              <h1 className="inline-block text-white opacity-60 mb-[20px] text-xmd leading-[20px] -tracking-[.5px] font-serif">About Buckler Investments Group</h1>
              <h2 className="font-serif text-white -tracking-[1px] text-[3.9rem] font-medium mb-0 sm:-tracking-[1px]">East Africa's premier investment & travel platform</h2>
            </Col>
            <ScrollTo to="about" offset={0} delay={0} spy={true} smooth={true} duration={800} className="absolute bottom-[50px] left-1/2 w-auto inline-block p-0 -translate-x-1/2 sm:bottom-7 xs:bottom-[4.5rem] cursor-pointer">
              <i className="ti-arrow-down text-lg leading-[1] text-white bg-[#000000b3] p-[15px] xs:p-[10px] rounded-full flex justify-center items-center"></i>
            </ScrollTo>
          </Row>
        </Container>
      </div>
      {/* Parallax Scrolling End */}

      {/* Section Start */}
      <section id="about" className="bg-lightgray py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="font-serif">
            <Col lg={4} className="pe-lg-0 flex md:mb-[30px]">
              <div className="w-full md:h-[700px] sm:h-[550px] xs:h-[450px] cover-background" style={{ backgroundImage: "url('https://via.placeholder.com/800x1000') " }}></div>
            </Col>
            <Col lg={4} md={6} className="ps-lg-0 flex items-center sm:mb-[30px]">
              <div className="justify-center h-full w-full flex flex-col items-start bg-red-600 px-[5.5rem] lg:px-[3rem] md:p-16">
                <span className="text-xlg lg:text-lg lg:leading-[26px] font-medium text-white mb-[20px] block">We founded Buckler Investments Group to democratize access to East Africa's growth opportunities.</span>
                <p className="text-white font-sans opacity-70 mb-[20px] xs:mb-[15px]">From strategic investments to premium accommodations, we connect people with the best opportunities across Kenya and East Africa.</p>
                <Buttons href="/invest" className="font-medium font-serif uppercase btn-link after:h-[2px] md:text-md md:mb-[15px] after:bg-[#fff] hover:text-[#fff]" color="#fff" title="Explore opportunities" />
              </div>
            </Col>
            <Col lg={4} md={6} className="flex flex-col pr-0">
              <img src="https://via.placeholder.com/800x600" alt="about us" className="sm:w-full" />
              <div className="bg-white px-[3.5rem] py-[3rem] h-full lg:p-8 sm:p-16">
                <span className="text-darkgray font-medium mb-[10px] block">Our Mission</span>
                <p className="font-sans">To bridge the gap between opportunity and access, creating pathways for sustainable growth and memorable experiences across East Africa's dynamic markets.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] xs:py-[50px]">
        <Container>
          <Row className="items-center justify-center">
            <Col xl={7} lg={8} md={7} sm={10} className="text-left sm:text-center sm:mb-[30px]">
              <h5 className="font-serif text-darkgray font-medium mb-0"><strong className="text-red-600 underline underline-offset-auto font-semibold">Since 2020</strong> we have been connecting investors and travelers with East Africa's best opportunities.</h5>
            </Col>
            <Col xl={{ span: 3, offset: 2 }} lg={4} md={5} className="sm:text-center text-right">
              {/* Modal Component Start */}
              <CustomModal.Wrapper
                className="inline-block"
                modalBtn={
                  <span className="cursor-pointer font-serif inline-block py-[19px] px-[44px] text-white rounded about-us-bg-gradient">
                    <i className="fa fa-arrow-right line-icon-Video-5 text-[50px] inline-block ml-0 mr-[15px] align-middle"></i>
                    <div className="inline-block text-start text-md align-middle uppercase font-medium">
                      <span className="opacity-60 text-md block leading-[15px]">Platform overview</span>Watch</div></span>
                } >
                <div className="w-[1020px] max-w-full relative rounded mx-auto">
                  <div className="fit-video">
                    <iframe width="100%" height="100%" className="shadow-[0_0_8px_rgba(0,0,0,0.06)]" controls src="https://www.youtube.com/embed/g0f_BRYJLJE?autoplay=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe>
                  </div>
                </div>
              </CustomModal.Wrapper>
              {/* Modal Component End */}
            </Col>
            <Col className="mt-[8.5rem] sm:mt-20">
              <Clients
                grid="row-cols-1 row-cols-lg-4 row-cols-md-4 row-cols-sm-2 gap-y-10"
                theme="client-logo-style-01"
                data={ClientData01}
                animation={fadeIn}
              />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="bg-lightgray py-[130px] lg:py-[90px] md:py-[75px] xs:py-[50px]">
        <Container>
          <Row className="justify-center flex">
            <m.div className="text-center mb-20 md:mb-12 col-lg-6 col-sm-8" {...fadeIn}>
              <span className="text-xmd mb-[15px] font-serif block w-full">Explore our comprehensive platform</span>
              <h5 className="font-serif text-darkgray font-medium mb-8 sm:w-full">We offer a complete suite of investment and travel services!</h5>
            </m.div>
            <Col xs={12} md={9} lg={12}>
              <IconWithText
                grid="row-cols-1 row-cols-md-1 row-cols-lg-2 gap-y-[15px]"
                theme="icon-with-text-02 about-us-icon-with-text"
                data={IconWithTextData}
                animation={fadeIn}
                animationDelay={0.1}
              />
            </Col>
          </Row>
        </Container>
      </section >
      {/* Section End */}

      {/* Section Start */}
      <m.section className="py-[130px] lg:py-[90px] md:py-[75px] xs:py-[50px]" {...fadeIn}>
        <Container>
          <Row className="items-center">
            <Col lg={6} className="p-0 md:mb-[50px] border-white border-[12px] rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]">
              <div className="relative">
                <Swiper
                  className="white-move swiper-pagination-medium h-full swiper-navigation-01 swiper-navigation-light"
                  modules={[Navigation]}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  navigation={true}>
                  {
                    TestimonialsCarouselData.map((item, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <div className="h-full shadow-lg bg-[#fff]">
                            <img src={item.img} alt="business" className="w-full" width="531" height="413" />
                          </div>
                        </SwiperSlide>
                      )
                    })
                  }
                </Swiper>
              </div>
            </Col>
            <Col lg={{ span: 5, offset: 1 }} >
              <h5 className="font-serif text-darkgray font-medium">It is vision and execution that creates success.</h5>
              <p>With deep understanding of East Africa's markets and years of experience in investment and hospitality, Buckler Investments Group brings together the best opportunities in one platform.</p>
              <Lists theme="list-style-02" data={ListData} className="mb-12 mt-8 text-darkgray font-serif" animation={fadeIn} />
              <Buttons href="/contact-us" className="btn-fill font-medium font-serif rounded-[4px] uppercase md:mb-[15px]" themeColor="#dc2626" color="#fff" size="md" title="Get Started Now" />
            </Col>
          </Row>
        </Container>
      </m.section>
      {/* Section End */}

      {/* Section Start */}
      <section className="bg-lightgray py-[130px] lg:py-[90px] md:py-[75px] xs:py-[50px]">
        <Container>
          <FancyTextBox
            grid="row-cols-1 row-cols-lg-2 gap-y-10 justify-center"
            themeColor="col-12 col-lg-4 col-md-6 col-md-9"
            theme="fancy-text-box-04"
            data={fancyTextBox04}
            animation={fadeIn} />
        </Container>
      </section>
      {/* Section End */}


      {/* Section Start */}
      <section className="pb-[130px] lg:pb-[90px] md:pb-[75px] xs:pb-[50px]">
        <Container fluid="md" className="sm:px-0">
          <Row className="lg:mx-[15px]">
            <Overlap className="bg-white p-16 shadow-[0_0_15px_rgba(0,0,0,0.1)] mb-[130px] md:mb-[80px] sm:shadow-none sm:border-b sm:mb-[50px]">
              <Counter
                theme="counter-style-05"
                grid="row-cols-1 row-cols-md-3 text-center gap-y-10"
                className="text-black"
                duration={2}
                data={CounterData05}
              />
            </Overlap>
          </Row>
        </Container>
        <Container>
          <Row className="justify-center">
            <m.div className="col-md-6 font-serif text-center mb-[4.5rem] sm:mb-12" {...fadeIn}>
              <span className="text-xmd">Our expert team</span>
              <h5 className="text-darkgray font-medium">Investment and hospitality professionals</h5>
            </m.div>
          </Row>
          <Team
            themeColor="light"
            overlay={["#b783fffa", "#e37be0fa", "#fa7cc1fa", "#ff85a6fa", "#ff9393fa"]}
            theme='team-style-04'
            data={TeamData04}
            grid="row-cols-1 row-cols-md-3 row-cols-sm-1"
            animation={fadeIn}
            animationDelay={0.3}
            carousel={false}
            className="team-about-us"
            carouselOption={{ slidesPerView: 3, spaceBetween: 30, loop: true, navigation: true, autoplay: { delay: 3000, disableOnInteraction: true }, pagination: { dynamicBullets: true, clickable: true } }} />
          <div className="bg-[#ededed] mb-24 mt-12 w-full h-[1px]"></div>
          <Row className="items-center justify-center">
            <Col xl={7} md={8} sm={10} className="text-start md:text-center sm:mb-[30px]">
              <h6 className="font-serif text-darkgray font-medium mb-0 md:w-[90%] sm:w-full sm:text-center"><strong className="font-semibold underline underline-offset-2">Investment experts,</strong> hospitality professionals and market analysts join our growing team.</h6>
            </Col>
            <Col xl={5} md={4} className="text-center md:text-end flex justify-end sm:justify-center">
              <Buttons to="/contact-us" className="font-medium rounded-[4px] font-serif uppercase hover:text-white bg-transparent btn-slide-right" size="lg" color="#dc2626" themeColor="#dc2626" title="JOIN THE TEAM" />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Footer start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer end */}
    </div>
  )
}

export default AboutUsPage