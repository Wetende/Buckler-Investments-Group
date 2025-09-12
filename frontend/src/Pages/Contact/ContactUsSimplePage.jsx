import React, { useRef } from 'react'

// Libraries
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import { Formik, Form } from 'formik';
import { m } from "framer-motion";

// Component
import Header, { HeaderNav, Menu, Topbar } from "../../Components/Header/Header";
import HomeMenuData from "../../Components/Header/HomeMenuData";
import AuthButtons from "../../Components/Header/AuthButtons";
import Brand from "../../Components/Header/Brand";
import { Checkbox, Input, TextArea } from '../../Components/Form/Form'
import Buttons from '../../Components/Button/Buttons'
import { ContactFormStyle03Schema } from '../../Components/Form/FormSchema';
import MessageBox from '../../Components/MessageBox/MessageBox';
import Overlap from '../../Components/Overlap/Overlap';
import SocialIcons from '../../Components/SocialIcon/SocialIcons';
import FooterStyle01 from '../../Components/Footers/FooterStyle01';
import CustomModal from '../../Components/CustomModal'
import { fadeIn } from '../../Functions/GlobalAnimations'
import { resetForm, sendEmail } from '../../Functions/Utilities';

// Data
const SocialIconsData = [
  {
    color: "#3b5998",
    link: "https://www.facebook.com/",
    icon: "fab fa-facebook-f"
  },
  {
    color: "#ea4c89",
    link: "https://dribbble.com/",
    icon: "fab fa-dribbble"
  },
  {
    color: "#00aced",
    link: "https://twitter.com/",
    icon: "fab fa-twitter"
  },
  {
    color: "#fe1f49",
    link: "https://www.instagram.com/",
    icon: "fab fa-instagram"
  }
]

const ContactUsSimplePage = (props) => {

  const form = useRef(null)

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
      
      {/* Section Start */}
      <section className="bg-lightgray py-[40px] sm:py-[30px]">
        <Container>
          <Row className="xs:text-center">
            <Col xl={8} lg={6} className="flex md:justify-center md:mb-[15px] sm:block sm:text-center sm:mb-[9px]">
              <h1 className="text-lg leading-[28px] text-darkgray font-medium mb-0 font-serif inline-block">Contact Buckler</h1>
              <span className="font-serif text-md leading-[28px] relative pl-[25px] ml-[30px] block sm:p-0 before:absolute before:bg-darkgray before:content-[''] before:h-[12px] before:top-[8px] before:w-[2px] before:left-0 sm:before:hidden sm:ml-0">Let's explore opportunities together</span>
            </Col>
            <Col xl={4} lg={6} className="breadcrumb justify-end px-[15px] text-sm font-serif m-0 md:justify-center">
              <ul>
                <li className="!leading-[30px]"><Link aria-label="link for" to="/">Home</Link></li>
                <li className="!leading-[30px]"><Link aria-label="link for" to="#">Pages</Link></li>
                <li className="!leading-[30px]">Contact</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="row-cols-1 row-cols-lg-4 row-cols-sm-2 md:gap-y-[50px] sm:gap-y-[30px] text-center">
            <Col>
              <i className="line-icon-Geo2-Love text-red-600 text-[32px] mb-[30px] sm:mb-[10px] inline-block md:mb-[15px]"></i>
              <div className="text-darkgray uppercase text-sm font-medium font-serif mb-[10px]">BUCKLER HQ</div>
              <p className="w-[75%] lg:w-[90%] md:w-[60%] sm:w-[75%] xs:w-full mx-auto">Westlands, Nairobi<br />Kenya, East Africa</p>
            </Col>
            <Col>
              <i className="line-icon-Headset text-red-600 text-[32px] mb-[30px] sm:mb-[10px] inline-block md:mb-[15px]"></i>
              <div className="text-darkgray uppercase text-sm font-medium font-serif mb-[10px]">Let's Talk</div>
              <p className="w-[70%] lg:w-full mx-auto">Phone: +254 700 000 000<br />WhatsApp: +254 700 000 001</p>
            </Col>
            <Col>
              <i className="line-icon-Mail-Read text-red-600 text-[32px] mb-[30px] sm:mb-[10px] inline-block md:mb-[15px]"></i>
              <div className="text-darkgray uppercase text-sm font-medium font-serif mb-[10px]">E-MAIL US</div>
              <p className="w-[70%] lg:w-full mx-auto">
                <a aria-label="mail" href="mailto:info@buckler.co.ke" className="hover:text-red-600">info@buckler.co.ke</a><br />
                <a aria-label="mail" href="mailto:invest@buckler.co.ke" className="hover:text-red-600">invest@buckler.co.ke</a>
              </p>
            </Col>
            <Col>
              <i className="line-icon-Information text-red-600 text-[32px] mb-[30px] sm:mb-[10px] inline-block md:mb-[15px]"></i>
              <div className="text-darkgray uppercase text-sm font-medium font-serif mb-[10px]">CUSTOMER SUPPORT</div>
              <p className="w-[75%] lg:w-full md:w-[60%] sm:w-[75%] mx-auto">24/7 support for investments, bookings, and inquiries</p>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="pt-[160px] pb-[250px] lg:pt-[120px] md:pt-[95px] md:pb-[220px] sm:py-[80px] xs:py-[50px] relative bg-cover overflow-hidden bg-center bg-no-repeat bg-fixed lg:bg-local" style={{ backgroundImage: `url(https://via.placeholder.com/1920x1099)` }}>
        <div className="absolute h-full w-full opacity-80 top-0 left-0 bg-gradient-to-tr from-[#0039e3] via-[#5e28dd] to-[#8600d4]"></div>
        {/* Modal Component Start */}
        <CustomModal.Wrapper
          className="flex relative h-full w-full items-center justify-center"
          modalBtn={
            <>
              <Buttons type="submit" ariaLabel="information" className="btn-sonar border-0 my-0 mx-auto" themeColor="#fff" color="#5e28dd" size="lg" title={<i className="icon-control-play" />} />
              <span className="w-full font-serif font-medium text-xmd block uppercase text-white mt-[30px]">Be information</span>
            </>
          } >
          <div className="w-[1020px] max-w-full relative rounded mx-auto">
            <div className="fit-video">
              <iframe width="100%" height="100%" className="shadow-[0_0_8px_rgba(0,0,0,0.06)]" controls src="https://www.youtube.com/embed/g0f_BRYJLJE?autoplay=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe>
            </div>
          </div>
        </CustomModal.Wrapper>
        {/* Modal Component End */}
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="bg-lightgray pb-[130px] lg:pb-[90px] md:pb-[75px] sm:py-[50px]">
        <Container>
          <m.div  {...fadeIn} transitionDelay={0.5}>
            <Overlap value={20} className="relative p-32 lg:p-[104px] md:p-[60px] sm:p-[55px] xs:px-[22px] xs:py-[44px] shadow-[0_0_30px_rgba(0,0,0,0.1)] bg-white">
              <Row className="justify-center" >
                <Col xl={6} lg={7} className="col-12 text-center mb-[4.5rem] md:mb-12">
                  <span className="font-serif mb-[5px] -tracking-[.5px] text-xmd block">Fill out the form and we'll be in touch soon!</span>
                  <h4 className="font-serif font-semibold text-darkgray">How we can help you?</h4>
                </Col>
                <Col className="col-12">
                  <Formik
                    initialValues={{ name: '', email: '', phone: '', comment: '', terms_condition: false }}
                    validationSchema={ContactFormStyle03Schema}
                    onSubmit={async (values, actions) => {
                      actions.setSubmitting(true)
                      const response = await sendEmail(values)
                      response.status === "success" && resetForm(actions)
                    }}
                  >
                    {({ isSubmitting, status }) => (
                      <Form ref={form}>
                        <Row className="row-cols-1 row-cols-md-2">
                          <Col className="mb-16 sm:mb-[25px]">
                            <Input showErrorMsg={false} type="text" name="name" className="py-[15px] px-[20px] text-md w-full border-[1px] border-solid border-[#dfdfdf]" labelClass="mb-[25px]" placeholder="Your name" />
                            <Input showErrorMsg={false} type="email" name="email" className="py-[15px] px-[20px] w-full text-md border-[1px] border-solid border-[#dfdfdf]" labelClass="mb-[25px]" placeholder="Your email address" />
                            <Input showErrorMsg={false} type="tel" name="phone" className="py-[15px] px-[20px] w-full text-md border-[1px] border-solid border-[#dfdfdf]" placeholder="Mobile number" />
                          </Col>
                          <Col className="mb-16 sm:mb-[20px]">
                            <TextArea className="border-[1px] border-solid border-[#dfdfdf] w-full py-[15px] px-[20px] text-md h-[210px] resize-none" rows="6" name="comment" placeholder="Your message"></TextArea>
                          </Col>
                          <Col className="text-left sm:mb-[20px]">
                            <Checkbox type="checkbox" name="terms_condition" className="inline-block mt-[4px]" labelClass="flex items-start">
                              <span className="ml-[10px] text-sm inline-block w-[85%]">I accept the terms & conditions and I understand that my data will be hold securely in accordance with the<Link aria-label="checkbox" to="/privacy" target="_blank" className="text-darkgray underline hover:text-fastblue"> privacy policy</Link>.</span>
                            </Checkbox>
                          </Col>
                          <Col className="text-right sm:text-center">
                            <Buttons type="submit" className={`text-xs tracking-[1px] rounded-none py-[12px] px-[28px] uppercase${isSubmitting ? " loading" : ""}`} themeColor={["#b884fd", "#fe73a8", "b884fd"]} size="md" color="#fff" title="Send Message" />
                          </Col>
                        </Row>
                        <AnimatePresence>
                          {status && <Row><Col xs={12}><div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MessageBox className="mt-[20px] py-[10px]" theme="message-box01" variant="success" message="Your message has been sent successfully!" /></div></Col></Row>}
                        </AnimatePresence>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Overlap>
          </m.div>
          <Row className="justify-center">
            <Col lg={10} className="flex flex-row items-center justify-center text-center mt-[7.5rem]">
              <span className="col-auto w-[40px] h-[1px] bg-darkgray opacity-30"></span>
              <div className="font-serif font-medium text-lg text-darkgray px-[20px] md:text-xmd sm:leading-[22px]">We like to talk and on the strength of that you are invited for a coffee</div>
              <span className="col-auto w-[40px] h-[1px] bg-darkgray opacity-30"></span>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <section className="py-[80px] md:py-[40px]">
        <Container>
          <Row className="items-center">
            <Col lg={6} md={7} sm={6} className="xl:text-start xs:text-center sm:my-[25px] xs:mb-[30px]">
              <h6 className="font-serif text-darkgray font-medium mb-[10px]">Ready to explore opportunities with Buckler?</h6>
              <Buttons to="/invest" className="font-medium after:bg-red-600 !leading-[25px] font-serif uppercase btn-link after:h-[2px] md:text-md hover:opacity-50" color="#dc2626" size="xl" title="Start Investing" />
            </Col>
            <Col lg={6} md={5} sm={6} className="sm:my-[25px] xs:mt-0">
              <span className="font-serif text-md text-right xs:text-center block mb-[10px]">Connect with social media</span>
              <SocialIcons theme="social-icon-style-01" size="sm" iconColor="dark" className="justify-end text-end xs:justify-center xs:!text-center" data={SocialIconsData.slice(0, 4)} />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}
    </div>
  )
}

export default ContactUsSimplePage