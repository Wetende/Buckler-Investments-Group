import React, { useEffect, useMemo, useState } from "react";

// Libraries
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { Autoplay, Pagination, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";

// Components
import Header, { HeaderNav, Menu } from "../../Components/Header/Header";
import BucklerMenuData from '../../Components/Header/BucklerMenuData';
import CustomModal from "../../Components/CustomModal";
import InteractiveBanners07 from "../../Components/InteractiveBanners/InteractiveBanners07";
import InteractiveBanners08 from "../../Components/InteractiveBanners/InteractiveBanners08";
import InteractiveBanners09 from "../../Components/InteractiveBanners/InteractiveBanners09";
import Lists from "../../Components/Lists/Lists";
import Testimonials from "../../Components/Testimonials/Testimonials";
import TextSlider01 from "../../Components/TextSlider/TextSlider01";
import BlogClassic from "../../Components/Blogs/BlogClassic";
import Buttons from "../../Components/Button/Buttons";
import { TiltBox } from "../../Components/FancyText/FancyText";
import { Input } from "../../Components/Form/Form";
import MessageBox from "../../Components/MessageBox/MessageBox";
import Overlap from "../../Components/Overlap/Overlap";
import FooterStyle10 from "../../Components/Footers/FooterStyle10";
import { fadeIn, fadeInLeft, zoomIn } from "../../Functions/GlobalAnimations";
import InfoBannerStyle05 from "../../Components/InfoBanner/InfoBannerStyle05";
import { resetForm, sendEmail } from "../../Functions/Utilities";
import SideButtons from "../../Components/SideButtons";

// Data
import { InteractiveBannersData08 } from "../../Components/InteractiveBanners/InteractiveBannersData";
import { TextSliderData01 } from "../../Components/TextSlider/TextSliderData";
import { blogData } from "../../Components/Blogs/BlogData";
import { useFeaturedTours, useTourCategories, useToursList, useSearchTours, useCategoryTours } from '../../api/useTours';
import { getTour, getTourAvailability } from '../../api/toursService';

const SwiperSlideData = [
  {
    img: "https://via.placeholder.com/1920x1080",
    title: "Deserts discovery",
  },
  {
    img: "https://via.placeholder.com/1920x1080",
    title: "Beaches discover",
  },
  {
    img: "https://via.placeholder.com/1920x1080",
    title: "Summer season",
  },
];

const ListData = [
  {
    icon: "fas fa-check",
    title: "Authentic local experiences",
    content:
      "Small group tours led by knowledgeable local guides across Kenya.",
  },
  {
    icon: "fas fa-check",
    title: "Flexible packages for all budgets",
    content:
      "Choose from day trips to week-long safaris with accommodation options.",
  },
];

const reviewsData = [
  {
    name: "Herman Miller",
    content:
      "There are design companies and then there are user experience, design, consulting, interface design.",
    img: "https://via.placeholder.com/125x125",
    company: "ThemeZaa Design",
    rating: 5,
  },
  {
    name: "Alexander Harvard",
    content:
      "I wanted to hire the best and after looking at several other companies, I knew Jacob was the perfect guy.",
    img: "https://via.placeholder.com/125x125",
    company: "Microsoft Corporation",
    rating: 5,
  },
  {
    name: "Lindsay Swanson",
    content:
      "Absolutely amazing theme, flexible and awesome design with possibilities. It s so easy to use and to customize.",
    img: "https://via.placeholder.com/125x125",
    company: "Envato Market",
    rating: 5,
  },
  {
    name: "Jeremy Dupont",
    content:
      "Simply the great designs and best theme for WooCommerce, loading fast, customisable and easy to use.",
    img: "https://via.placeholder.com/125x125",
    company: "Google Marketing",
    rating: 5,
  },
];

const popularpackagedata = [
  {
    img: "https://via.placeholder.com/525x431",
    packageprice: "From $350",
    days: "08 Days",
    title: "Golden triangle of incredible india",
    reviews: "20 Reviews",
    link: "#",
    rating: 5,
  },
];

// Filter the blog data category wise — keep a single fallback item until blog API exists
const blogClassicData = blogData
  .filter((item) => item.blogType === "classic")
  .filter((item) => item.category.includes("travelagency"))
  .slice(0, 1); // single-item fallback

const TravelAgencyPage = (props) => {
  // Load featured tours for Popular Packages (public endpoint)
  const { data: featuredData, isLoading: featuredLoading, isError: featuredError } = useFeaturedTours(8);
  const queryClient = useQueryClient();
  const [searchCriteria, setSearchCriteria] = useState({});
  
  // Map API data to InfoBannerStyle05 format
  const featuredItems = Array.isArray(featuredData)
    ? featuredData.map((tour) => ({
        img: tour.image || "https://via.placeholder.com/525x431",
        packageprice: tour.price ? `From ${tour.price} ${tour.currency || "KES"}` : "From KES 25,000",
        days: tour.duration || (tour.duration_hours ? `${tour.duration_hours} hrs` : "2 Days"),
        title: tour.title || tour.name || "Kenya Adventure",
        reviews: tour.reviews_count ? `${tour.reviews_count} Reviews` : "0 Reviews",
        link: `/tours/${tour.id}`,
        rating: tour.rating || 4.5,
      }))
    : [];
  
  // Use API data when available, fallback to mock only when loading or error
  const infoBannerItems = featuredItems.length > 0 ? featuredItems : popularpackagedata;

  // Hero slides derived from featured tours (limit 3)
  const heroSlides = useMemo(() => {
    if (Array.isArray(featuredData) && featuredData.length > 0) {
      return featuredData.slice(0, 3).map((t) => ({
        img: t.image || "https://via.placeholder.com/1920x1080",
        title: t.title || t.name || "Kenya Adventure",
        id: t.id,
      }));
    }
    return SwiperSlideData;
  }, [featuredData]);

  // Prefetch detail and availability for featured items
  useEffect(() => {
    if (!Array.isArray(featuredData) || featuredData.length === 0) return;
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 14);
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const params = { start_date: fmt(start), end_date: fmt(end) };

    featuredData.forEach((t) => {
      const id = Number(t?.id);
      if (!id) return;
      queryClient.prefetchQuery({ queryKey: ['tours', 'detail', id], queryFn: () => getTour(id), staleTime: 300000 });
      queryClient.prefetchQuery({ queryKey: ['tours', id, 'availability', params], queryFn: () => getTourAvailability(id, params), staleTime: 120000 });
    });
  }, [featuredData, queryClient]);

  // Load tour categories for destinations and interests
  const { data: categories, isError: categoriesError } = useTourCategories();
  const categoryItems07 = Array.isArray(categories) && categories.length > 0
    ? categories.slice(0, 4).map((c) => ({
        country: c.name || c.title || 'Kenya',
        img: c.image || 'https://via.placeholder.com/263x263',
        btnLink: `/tours?category=${encodeURIComponent(c.slug || c.name || '')}`,
        btnTitle: 'Explore tours',
      }))
    : [{ country: 'Kenya', img: 'https://via.placeholder.com/263x263', btnLink: '/tours', btnTitle: 'Explore tours' }];

  const categoryItems09 = Array.isArray(categories) && categories.length > 0
    ? categories.slice(0, 4).map((c) => ({
        title: c.name || c.title || 'Safari',
        subtitle: c.subtitle || 'Wildlife & Nature',
        img: c.image || 'https://via.placeholder.com/132x132',
        btnTitle: 'View',
        btnLink: `/tours?category=${encodeURIComponent(c.slug || c.name || '')}`,
      }))
    : [{ title: 'Safari', subtitle: 'Wildlife & Nature', img: 'https://via.placeholder.com/132x132', btnTitle: 'View', btnLink: '/tours' }];

  // Load a different tours slice for the "Special hotels" section (reuse tours list)
  const { data: toursList } = useToursList({ limit: 6, offset: 0 });
  const hotelsLikeItems = Array.isArray(toursList) && toursList.length > 0
    ? toursList.slice(0, 6).map((t) => ({
        img: t.image || 'https://via.placeholder.com/398x309',
        title: t.title || t.name || 'Kenya Experience',
        country: t.location || 'Kenya',
      }))
    : [
        { img: 'https://via.placeholder.com/398x309', title: 'Masai Mara Safari', country: 'Kenya' },
      ];

  return (
    <div style={props.style}>
      <SideButtons />
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
          <Col
            xs="auto"
            lg={2}
            sm={6}
            className="me-auto ps-lg-0 me-auto ps-lg-0"
          >
            <Link aria-label="header logo" className="flex items-center" to="/">
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
            <Menu {...props} data={BucklerMenuData} />
          </Navbar.Collapse>
          <Col
            xs="auto"
            lg={2}
            className="nav-bar-contact text-end xs:hidden pe-0"
          >
            <a
              aria-label="link for top"
              href="#top"
              className="text-md text-[#fff] font-serif font-medium"
            >
              <i className="feather-phone-call mr-[15px]"></i>
              0222 8899900
            </a>
          </Col>
        </HeaderNav>
      </Header>
      {/* Header End */}

      <div className="bg-white">
        {/* Simple Search Section Start */}
        <section className="py-[60px] border-b border-mediumgray bg-white md:py-[40px]">
          <Container>
            <Row className="justify-center">
              <Col lg={10}>
                <Formik
                  initialValues={{ location: '', start_date: '', max_price: '' }}
                  validationSchema={Yup.object().shape({
                    location: Yup.string(),
                    start_date: Yup.string(),
                    max_price: Yup.number().typeError('Must be a number').min(0, 'Must be >= 0'),
                  })}
                  onSubmit={(values) => {
                    const criteria = {};
                    if (values.location) criteria.location = values.location;
                    if (values.start_date) criteria.start_date = values.start_date;
                    if (values.max_price) criteria.max_price = Number(values.max_price);
                    setSearchCriteria(criteria);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <Input name="location" type="text" labelClass="!mb-[10px]" label="Location" placeholder="e.g., Nairobi" />
                      <Input name="start_date" type="date" labelClass="!mb-[10px]" label="Start date" />
                      <Input name="max_price" type="number" labelClass="!mb-[10px]" label="Max price (KES)" />
                      <Buttons ariaLabel="Search tours" type="submit" className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase" themeColor="#232323" color="#fff" title={isSubmitting ? 'Searching...' : 'Search'} />
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </Container>
        </section>
        {/* Simple Search Section End */}
        {/* Hero Slider Section Start */}
        <section className="overflow-hidden full-screen md:h-[650px] sm:h-[500px]">
          <Swiper
            className="white-move swiper-pagination-light swiper-pagination-medium h-full relative swiper-navigation-04 swiper-navigation-dark travel-agency-slider"
            slidesPerView={1}
            loop={true}
            keyboard={true}
            navigation={true}
            modules={[Pagination, Autoplay, Keyboard, Navigation]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            breakpoints={{
              575: {
                pagination: true,
              },
            }}
          >
            {heroSlides.map((item, i) => {
              return (
                <SwiperSlide
                  key={i}
                  style={{ backgroundImage: `url(${item.img})` }}
                  className="bg-no-repeat	bg-cover	overflow-hidden bg-center"
                >
                  <Container className="h-full  text-center justify-center xs:p-0">
                    <Row className="h-full w-[70%] my-0 mx-auto">
                      <Col className="h-full justify-center flex-col relative flex xs:p-0">
                        <span className="mb-[35px] font-medium tracking-[2px] text-white text-xmd font-serif uppercase block sm:text-[16px] sm:mb-[15px] xs:w-full">Packages from KES 25,000</span>
                        <h1 className="mb-[45px] text-shadow-large font-extrabold text-white text-[100px] tracking-[-4px] leading-[95px] font-serif uppercase mx-auto text-shadow lg:text-[90px] md:text-[70px] md:leading-[65px] sm:text-[45px] sm:mb-[30px] sm:tracking-[-1px] sm:leading-[43px] xs:tracking-[-1px] xs:w-full xs:leading-none">
                          {" "}
                          {item.title}{" "}
                        </h1>
                        <div className="inline-block">
                          <Buttons
                            ariaLabel="link for swiper img"
                            href={item.id ? `/tours/${item.id}` : '#'}
                            className="btn-fill font-medium font-serif uppercase rounded-none btn-shadow"
                            size="lg"
                            themeColor="#232323"
                            color="#fff"
                            title="Explore tours"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
        {/* Hero Slider Section End */}

        {/* Section Start  */}
        <section className="py-[80px] border-b border-mediumgray bg-white md:py-[40px]">
          <Container>
            <Row className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 justify-center gap-y-10">
              <Col>
                <m.div
                  className="flex justify-start text-left items-center"
                  {...{ ...fadeIn, transition: { delay: 0.2 } }}
                >
                  <div className="feature-box-icon flex items-center">
                    <i className="line-icon-Headset text-[35px] text-neonorange mr-[30px]"></i>
                  </div>
                  <div className="leading-[22px]">
                    <div className="text-[#262b35] font-serif font-medium leading-[20px] mb-[5px]">
                      Expert support
                    </div>
                    <span>Contact support team</span>
                  </div>
                </m.div>
              </Col>
              <Col>
                <m.div
                  className="flex justify-start text-left items-center"
                  {...{ ...fadeIn, transition: { delay: 0.4 } }}
                >
                  <div className="feature-box-icon flex items-center">
                    <i className="line-icon-Compass-3 text-[35px] text-neonorange mr-[30px]"></i>
                  </div>
                  <div className="leading-[22px]">
                    <div className="text-[#262b35] font-serif font-medium leading-[20px] mb-[5px]">
                      Peaceful places
                    </div>
                    <span>Safe and trustworthy </span>
                  </div>
                </m.div>
              </Col>
              <Col>
                <m.div
                  className="flex justify-start text-left items-center"
                  {...{ ...fadeIn, transition: { delay: 0.6 } }}
                >
                  <div className="feature-box-icon flex items-center">
                    <i className="line-icon-Administrator text-[35px] text-neonorange mr-[30px]"></i>
                  </div>
                  <div className="leading-[22px]">
                    <div className="text-[#262b35] font-serif font-medium leading-[20px] mb-[5px]">
                      Exclusive agent
                    </div>
                    <span>Leading travel agency </span>
                  </div>
                </m.div>
              </Col>
              <Col>
                <m.div
                  className="flex justify-start text-left items-center"
                  {...{ ...fadeIn, transition: { delay: 0.8 } }}
                >
                  <div className="feature-box-icon flex items-center">
                    <i className="line-icon-Coin text-[35px] text-neonorange mr-[30px]"></i>
                  </div>
                  <div className="leading-[22px]">
                    <div className="text-[#262b35] font-serif font-medium leading-[20px] mb-[5px]">
                      Incredible price
                    </div>
                    <span>Best price guarantee </span>
                  </div>
                </m.div>
              </Col>
            </Row>
          </Container>
        </section>
        {/* Section End  */}

        {/* Search Results (below hero) Start */}
        {Object.keys(searchCriteria || {}).length > 0 && (
          <section className="py-[80px] border-b border-mediumgray bg-white md:py-[40px]">
            <Container>
              <Row>
                <Col>
                  {/* Inline loader and error handled through MessageBox if needed later */}
                </Col>
              </Row>
            </Container>
          </section>
        )}
        {/* Search Results End */}

        {/* About section Start */}
        <section
          className="overflow-hidden py-[130px] bg-no-repeat bg-left-bottom lg:py-[90px] md:py-[75px] sm:py-[50px]"
          style={{
            backgroundImage: `url(https://via.placeholder.com/1075x517)`,
          }}
        >
          <Container>
            <Row className="justify-center items-center z-index-0 relative">
              <Col lg={6} className="relative z-[1] md:mb-[50px] sm:mb-[35px]">
                <TiltBox className="relative p-0">
                  <img
                    width={555}
                    height={426}
                    src="https://via.placeholder.com/850x653"
                    alt="vacation"
                  />
                </TiltBox>
                <div className="absolute top-1/2 left-1/2 flex justify-center items-center">
                  {/* Modal Component Start */}
                  <CustomModal.Wrapper
                    className="absolute flex items-center md:right-0 md:justify-center md:w-full"
                    modalBtn={
                      <Buttons
                        ariaLabel="modal link"
                        type="submit"
                        className="btn-sonar border-0"
                        themeColor="#fff"
                        color="#ff7a56"
                        size="lg"
                        title={<i className="icon-control-play" />}
                      />
                    }
                  >
                    <div className="w-[1020px] max-w-full relative rounded mx-auto">
                      <div className="fit-video">
                        <iframe
                          width="100%"
                          height="100%"
                          className="shadow-[0_0_8px_rgba(0,0,0,0.06)]"
                          controls
                          src="https://www.youtube.com/embed/g0f_BRYJLJE?autoplay=1"
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </CustomModal.Wrapper>
                  {/* Modal Component End */}
                </div>
              </Col>
              <div className="col-lg-5 offset-lg-1">
                <m.h2
                  className="heading-5 font-serif font-medium text-darkgray w-[80%] mb-[45px] -tracking-[.5px] lg:w-[90%] md:mb-[35px]"
                  {...{
                    ...fadeInLeft,
                    transition: { ease: "circOut", duration: 1.2 },
                  }}
                >
                  Buckler curates authentic{" "}
                  <span className="font-bold">Kenyan tours</span>
                </m.h2>
                <Lists
                  className="travel-agency-list-style"
                  theme="list-style-07"
                  data={ListData}
                  animation={fadeInLeft}
                  animationDelay={0.3}
                />
                <m.div
                  className="items-center flex"
                  {...{
                    ...fadeInLeft,
                    transition: {
                      initial: { opacity: 0, x: "100%" },
                      delay: 0.7,
                      ease: "circOut",
                      duration: 1,
                    },
                  }}
                >
                  <Buttons
                    ariaLabel="link for about"
                    href="#"
                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase mr-[35px] md:mb-0 tracking-[.5px] py-[10px] px-[24px]"
                    themeColor="#232323"
                    color="#fff"
                    size="sm"
                    title="About tours"
                  />
                  <Buttons
                    ariaLabel="link for about"
                    href="#"
                    className="font-medium font-serif uppercase btn-link after:h-[2px] top-[-5px] text-md after:bg-darkgray md:pt-0 hover:text-darkgray"
                    size="xl"
                    color="#232323"
                    title="View tours"
                  />
                </m.div>
              </div>
            </Row>
          </Container>
        </section>
        {/* About section End */}

        {/* Section Start */}
        <m.section
          className="py-[130px] overflow-hidden bg-lightgray lg:py-[90px] md:py-[75px] sm:py-[50px]"
          {...fadeIn}
        >
          <Container>
            <Row className="mb-24 md:mb-20 items-center">
              <Col
                lg={6}
                md={7}
                className="xs:text-center sm:mb-[10px] sm:text-center"
              >
                <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">Top destinations in Kenya</h2>
                <p className="m-0 block">
                  This is the most popular destination in the last month
                </p>
              </Col>
              <Col lg={6} md={5} className="text-right sm:text-center">
                <Buttons
                  ariaLabel="link for destinations"
                  href="#"
                  className="font-medium font-serif uppercase btn-link after:h-[2px] md:text-md after:bg-darkgray hover:text-darkgray"
                  size="xl"
                  color="#232323"
                  title="all destinations"
                />
              </Col>
            </Row>
            {/* Top destinations (categories) - API-backed with single fallback */}
            <InteractiveBanners07
              animation={fadeIn}
              animationDelay={0.1}
              grid="row-cols-1 row-cols-lg-4 row-cols-sm-2 gap-y-[30px]"
              className="justify-center"
              data={categoryItems07}
            />
            {categoriesError && (
              <div className="mt-6">
                <MessageBox theme="message-box01" variant="error" message="Failed to load categories." />
              </div>
            )}
          </Container>
        </m.section>
        {/* Section End */}

        {/* Text Slider Section Start */}
        <m.section
          className="pb-0 py-[130px] overflow-hidden bg-white lg:py-[90px] md:py-[75px] sm:py-[50px]"
          {...fadeIn}
        >
          <Container fluid className="px-0">
            <TextSlider01
              data={TextSliderData01}
              carousalOption={{
                slidesPerView: "auto",
                loop: true,
                centeredSlides: true,
                navigation: false,
                spaceBetween: 60,
                autoplay: { delay: 4500, disableOnInteraction: false },
                breakpoints: {
                  991: { slidesPerView: 2 },
                  767: { slidesPerView: 1 },
                },
              }}
            />
          </Container>
        </m.section>
        {/* Text Slider Section End */}

        {/* Interactive Banner Section Start*/}
        <m.section
          className="py-[130px] overflow-hidden cover-background lg:py-[90px] md:py-[75px] sm:py-[50px]"
          style={{
            backgroundImage: `url(https://via.placeholder.com/1920x826)`,
          }}
          {...fadeIn}
        >
          <Container>
            <Row className="justify-center">
              <Col lg={7} sm={8} xl={6} className="text-center mb-24 md:mb-20">
                <h2 className="heading-5 font-serif font-semibold text-darkgray -tracking-[1px] uppercase mb-0">
                  Choose the perfect trip with your incredible interests
                </h2>
              </Col>
            </Row>
            {/* Interests (categories) - API-backed with single fallback */}
            <InteractiveBanners09
              grid="row-cols-1 row-cols-sm-2 row-cols-lg-4 gap-y-10"
              animation={zoomIn}
              animationDelay={0.1}
              animationDuration={0.6}
              data={categoryItems09}
            />
            <Row className="mt-24 xs:mt-16">
              <Col lg={12} className="text-center">
                <Buttons
                  ariaLabel="Explore your interests"
                  href="#"
                  className="font-medium font-serif uppercase btn-link after:h-[2px] lg:text-md after:bg-darkgray hover:text-darkgray"
                  color="#232323"
                  title="Explore your interests"
                  size="xl"
                />
              </Col>
            </Row>
          </Container>
        </m.section>
        {/* Interactive Banner Section End*/}

        {/* Info Banner Section Start */}
        <section className="py-[130px] overflow-hidden border-mediumgray border-t bg-lightgray relative lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container className="relative">
            <Row className="mb-24 md:mb-20 items-center">
              <m.div
                className="text-left sm:text-center sm:mb-[10px] col-lg-6 col-md-7"
                {...{ ...fadeIn, transition: { delay: 0.2 } }}
              >
                <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">
                  FEATURED TOURS
                </h2>
                <p className="m-0 block">
                  Amazing tours and fun adventures waiting for you
                </p>
              </m.div>
              <m.div
                className="text-right sm:text-center col-lg-6 col-md-5"
                {...{ ...fadeIn, transition: { delay: 0.4 } }}
              >
                <Buttons
                  ariaLabel="link for tours"
                  href="/tours"
                  className="font-medium font-serif uppercase btn-link after:h-[2px] lg:text-md after:bg-darkgray hover:text-darkgray"
                  size="xl"
                  color="#232323"
                  title="All tours"
                />
              </m.div>
            </Row>
            <m.div className="row" {...fadeIn}>
              {featuredLoading ? (
                <div className="col-12 text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neonorange"></div>
                  <p className="mt-4 text-sm text-gray-600">Loading featured tours...</p>
                </div>
              ) : featuredError && featuredItems.length === 0 ? (
                <MessageBox theme="message-box01" variant="error" message="Failed to load featured tours." />
              ) : (
                <InfoBannerStyle05
                  className="swiper-navigation-04 swiper-navigation-light black-move p-0"
                  carouselOption={{
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    breakpoints: {
                      1200: { slidesPerView: 4 },
                      992: { slidesPerView: 3 },
                      768: { slidesPerView: 2 },
                    },
                  }}
                  data={infoBannerItems}
                />
              )}
            </m.div>
          </Container>
        </section>
        {/* Info Banner Section End */}

        {/* Category Tours Section Start */}
        {(() => {
          const selectedCategory = Array.isArray(categories) && categories.length > 0 ? categories[0] : null;
          const selectedCategoryKey = selectedCategory?.slug || selectedCategory?.name;
          const hasCategory = !!selectedCategoryKey;
          if (!hasCategory) return null;
          return (
            <CategoryToursBlock selectedCategory={selectedCategory} />
          );
        })()}
        {/* Category Tours Section End */}

        {/* Interactive Banner Section Start */}
        <section className="relative overflow-hidden py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] px-28 bg-white lg:p-[90px] lg:px-8 xl:px-8 xs:px-0">
          <Container fluid>
            <Row className="items-center justify-center">
              <m.div
                className="relative lg:mb-20 lg:text-center col-xl-3 col-lg-9 col-md-8"
                {...{ ...fadeIn, transition: { delay: 0.2 } }}
              >
                <h2 className="heading-5 font-serif uppercase text-darkgray font-semibold mb-[25px] lg:mx-auto -tracking-[1px] w-[75%] xl:w-full lg:w-1/2 mx:xl-0 lg:mb-[15px] md:w-full">
                  Special hotels for your trip
                </h2>
                <p className="w-[75%] lg:mx-auto lg:text-center mb-[35px] xl:w-full lg:w-[65%] mx:xl-0 md:w-full sm:mb-[30px]">
                  Discover Kenya's wildlife, culture, and landscapes with our
                  expert guides and carefully planned itineraries.
                </p>
                <Buttons
                  ariaLabel="link for hotels"
                  href="#"
                  className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase md:mb-[15px]"
                  themeColor="#232323"
                  color="#fff"
                  size="sm"
                  title="explore hotels"
                />
              </m.div>
              <Col xl={9} lg={12}>
                <InteractiveBanners08
                  className=""
                  grid="row-cols-1 row-cols-md-2 row-cols-lg-3 gap-y-10 justify-center"
                  data={hotelsLikeItems}
                  animation={fadeInLeft}
                />
              </Col>
            </Row>
          </Container>
        </section>
        {/* Interactive Banner Section End */}

        {/* Review Section Start */}
        <m.section
          className="py-[130px] overflow-hidden border-t border-mediumgray bg-gradient-to-b from-[#fff] via-[#fdfdfd] to-[#f7f7f7] lg:py-[90px] md:py-[75px] sm:py-[50px]"
          {...fadeIn}
        >
          <Container>
            <m.div
              className="row mb-20 md:mb-16 items-center"
              {...{ ...fadeIn, transition: { delay: 0.2 } }}
            >
              <Col
                lg={6}
                md={7}
                className="text-left sm:text-center sm:mb-[10px]"
              >
                <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">
                  CUSTOMER REVIEWS
                </h2>
                <p className="m-0 block">
                  Read testimonials from our happy customers
                </p>
              </Col>
              <Col lg={6} md={5} className="text-right sm:text-center">
                <Buttons
                  ariaLabel=" link for reviews"
                  href="#"
                  className="font-medium font-serif uppercase btn-link after:h-[2px] md:text-md md:mb-[15px] after:bg-darkgray hover:text-darkgray"
                  color="#232323"
                  title="See all reviews"
                  size="xl"
                />
              </Col>
            </m.div>
            <m.div
              className="row"
              {...{ ...fadeIn, transition: { delay: 0.4 } }}
            >
              <Testimonials
                grid="row-cols-1 row-cols-md-2 row-cols-lg-3 justify-center gap-y-10"
                theme="testimonials-style-05"
                className="swiper-navigation-01 swiper-navigation-dark black-move p-[15px] mb-24 xs:mb-10"
                data={reviewsData}
                carousel={true}
                carouselOption={{
                  slidesPerView: 1,
                  loop: true,
                  spaceBetween: 30,
                  autoplay: { delay: 3000, disableOnInteraction: false },
                  keyboard: { enabled: true, onlyInViewport: true },
                  navigation: false,
                  breakpoints: {
                    992: { slidesPerView: 3 },
                    768: { slidesPerView: 2 },
                  },
                }}
              />
            </m.div>
            <m.div
              className="row justify-center"
              {...{ ...fadeIn, transition: { delay: 0.6 } }}
            >
              <Col lg={6} md={8} className="text-center">
                <m.img
                  width={555}
                  height={43}
                  src="/assets/img/webp/home-travel-agency-trustpilot.webp"
                  alt="trustpilot"
                  {...{ ...zoomIn, transition: { duration: 0.7 } }}
                />
              </Col>
            </m.div>
          </Container>
        </m.section>
        {/* Review Section End */}

        {/* Section Start */}
        <section
          className="py-[130px] pb-[200px] overflow-hidden cover-background lg:py-[90px] md:py-[75px] md:pb-[150px] sm:py-[50px] xs:h-auto"
          style={{
            backgroundImage: `url(https://via.placeholder.com/1920x600)`,
          }}
        >
          <div className="bg-darkslateblue top-0 left-0 absolute w-full h-full opacity-50"></div>
          <Container>
            <Row className="justify-center">
              <m.div
                className="text-center z-[1] col-xl-6 col-lg-7 col-sm-8"
                {...fadeIn}
              >
                <span className="line-icon-Summer text-[60px] text-white mb-[30px] inline-block"></span>
                <h2 className="heading-4 font-serif font-medium text-white -tracking-[1px] mb-[35px] xs:mb-[25px] xs:mx-auto xs:w-[90%]">
                  Our tour packages are the{" "}
                  <span className="font-semibold">
                    easiest and{" "}
                    <span className="underline">most efficient</span>
                  </span>
                </h2>
                <span className="font-serif font-medium text-white uppercase tracking-[2px]">
                  Subscribe to have the journey!
                </span>
              </m.div>
            </Row>
          </Container>
        </section>
        {/* Section End */}

        {/* Blog Section Start */}
        <section className="pb-[130px] relative bg-white lg:pb-[90px] md:pb-[75px] sm:py-[50px]">
          <Container>
            <Row>
              <Overlap className="relative">
                <Col>
                  <m.div
                    className="bg-neonorange rounded-[6px] flex flex-row items-center py-[40px] px-28 lg:px-20 xs:px-8 md:block"
                    {...fadeIn}
                  >
                    <h2 className="heading-6 font-serif font-medium text-darkgray -tracking-[1px] mb-[0] w-[45%] lg:mb-0 lg:w-[50%] md:w-full md:mb-[30px] md:block xs:mb-[20px] xs:text-center">
                      Sign up for exclusive packages
                    </h2>
                    <div className="relative w-[55%] lg:w-[50%] md:w-full">
                      <Formik
                        initialValues={{ email: "" }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string()
                            .email("Invalid email.")
                            .required("Field is required."),
                        })}
                        onSubmit={async (values, actions) => {
                          actions.setSubmitting(true);
                          const response = await sendEmail(values);
                          response.status === "success" && resetForm(actions);
                        }}
                      >
                        {({ isSubmitting, status }) => (
                          <div className="relative subscribe-style-05">
                            <Form className="relative">
                              <Input
                                showErrorMsg={false}
                                type="email"
                                name="email"
                                className="rounded large-input border-[1px] xs:!pr-0"
                                placeholder="Enter your email address"
                              />
                              <button
                                aria-label="link for Subscribe"
                                type="submit"
                                className={`text-xs py-[12px] px-[28px] uppercase mr-[10px] xs:!mr-0 xs:text-center${
                                  isSubmitting ? " loading" : ""
                                }`}
                              >
                                <i className="far fa-envelope text-sm leading-none mr-[8px] xs:mr-0"></i>
                                Subscribe
                              </button>
                            </Form>
                            <AnimatePresence>
                              {status && (
                                <m.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute top-[115%] mt-[10px] left-0 w-full"
                                >
                                  <MessageBox
                                    className="rounded-[4px] text-md py-[10px] px-[22px]"
                                    theme="message-box01"
                                    variant="success"
                                    message="Your message has been sent successfully subscribed to our email list!"
                                  />
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
            <m.div
              className="row mt-32 mb-20 md:mb-16 items-center"
              {...fadeIn}
            >
              <Col
                lg={6}
                md={7}
                className="text-left sm:text-center sm:mb-[10px]"
              >
                <h3 className="heading-5 font-serif font-semibold text-darkgray -tracking-[1px] uppercase mb-[5px]">
                  Blogs on travelling
                </h3>
                <p className="m-0 block">
                  The hand picked posts for travelling enthusiasts
                </p>
              </Col>
              <Col lg={6} md={5} className="text-right sm:text-center">
                <Buttons
                  ariaLabel="link for Read all blogs"
                  href="/blogs/blog-classic"
                  className="font-medium font-serif uppercase btn-link after:h-[2px] lg:text-md after:bg-darkgray hover:text-darkgray"
                  color="#232323"
                  size="xl"
                  title="Read all blogs"
                />
              </Col>
            </m.div>
            <Row>
              <Col>
                <BlogClassic
                  grid="grid grid-4col xl-grid-4col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col gutter-extra-large"
                  data={blogClassicData}
                />
              </Col>
            </Row>
          </Container>
        </section>
        {/* Blog Section End */}
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

export default TravelAgencyPage;

// Local block component to render category tours using GET /tours/categories/{category}/tours
const CategoryToursBlock = ({ selectedCategory }) => {
  const key = selectedCategory?.slug || selectedCategory?.name;
  const { data, isLoading, isError } = useCategoryTours(key, { limit: 8, offset: 0 });
  const items = Array.isArray(data)
    ? data.map((tour) => ({
        img: tour.image || 'https://via.placeholder.com/525x431',
        packageprice: tour.price ? `From ${tour.price} ${tour.currency || 'KES'}` : 'From KES 25,000',
        days: tour.duration || (tour.duration_hours ? `${tour.duration_hours} hrs` : '2 Days'),
        title: tour.title || tour.name || 'Kenya Adventure',
        reviews: tour.reviews_count ? `${tour.reviews_count} Reviews` : '0 Reviews',
        link: `/tours/${tour.id}`,
        rating: tour.rating || 4.5,
      }))
    : [];

  return (
    <section className="py-[130px] overflow-hidden border-t border-mediumgray bg-white relative lg:py-[90px] md:py-[75px] sm:py-[50px]">
      <Container>
        <Row className="mb-24 md:mb-20 items-center">
          <m.div className="text-left sm:text-center sm:mb-[10px] col-lg-6 col-md-7" {...{ ...fadeIn, transition: { delay: 0.2 } }}>
            <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">
              Explore: {selectedCategory?.name || key}
            </h2>
            <p className="m-0 block">Popular tours in this category</p>
          </m.div>
          <m.div className="text-right sm:text-center col-lg-6 col-md-5" {...{ ...fadeIn, transition: { delay: 0.4 } }}>
            <Buttons
              ariaLabel="link for category tours"
              href={`/tours?category=${encodeURIComponent(key || '')}`}
              className="font-medium font-serif uppercase btn-link after:h-[2px] lg:text-md after:bg-darkgray hover:text-darkgray"
              size="xl"
              color="#232323"
              title="View all"
            />
          </m.div>
        </Row>
        <m.div className="row" {...fadeIn}>
          {isLoading ? (
            <div className="col-12 text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neonorange"></div>
              <p className="mt-4 text-sm text-gray-600">Loading category tours...</p>
            </div>
          ) : isError ? (
            <MessageBox theme="message-box01" variant="error" message="Failed to load category tours." />
          ) : (
            <InfoBannerStyle05
              className="swiper-navigation-04 swiper-navigation-light black-move p-0"
              carouselOption={{
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false },
                breakpoints: { 1200: { slidesPerView: 4 }, 992: { slidesPerView: 3 }, 768: { slidesPerView: 2 } },
              }}
              data={items}
            />
          )}
        </m.div>
      </Container>
    </section>
  );
};
