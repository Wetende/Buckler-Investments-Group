import React, { useState } from 'react'

// Libraries
import { Row, Col, Container, Dropdown, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, EffectFade, Keyboard } from "swiper/modules";
import { Parallax } from "react-scroll-parallax";
import { m } from "framer-motion";
import { Link as ScrollTo } from "react-scroll"

// Components
import Header, { HeaderNav, Menu, Topbar } from '../../Components/Header/Header';
import HomeMenuData from '../../Components/Header/HomeMenuData';
import AuthButtons from '../../Components/Header/AuthButtons';
import SocialIcons from '../../Components/SocialIcon/SocialIcons';
import Buttons from '../../Components/Button/Buttons'
import { fadeIn, fadeInRight, zoomIn } from "../../Functions/GlobalAnimations";
import Clients from '../../Components/Clients/Clients';
import InteractiveBanners12 from '../../Components/InteractiveBanners/InteractiveBanners12'
import InteractiveBanners13 from '../../Components/InteractiveBanners/InteractiveBanners13';
import InteractiveBanners04 from '../../Components/InteractiveBanners/InteractiveBanners04';
import InteractiveBanners02 from '../../Components/InteractiveBanners/InteractiveBanners02';
import InteractiveBanners06 from '../../Components/InteractiveBanners/InteractiveBanners06';
import InfoBannerStyle05 from '../../Components/InfoBanner/InfoBannerStyle05';
import PortfolioSlider from '../../Components/Portfolio/PortfolioSlider';
import PortfolioBordered from '../../Components/Portfolio/PortfolioBordered';
import InteractiveBanners01 from '../../Components/InteractiveBanners/InteractiveBanners01';
import BlogMasonry from '../../Components/Blogs/BlogMasonry';
import Instagram from '../../Components/Instagram/Instagram';
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import MouseMove from "../../Components/MouseMove";
import UnifiedSearch from '../../Components/UnifiedSearch/UnifiedSearch';
import Testimonials from '../../Components/Testimonials/Testimonials';

// Data
import { blogData } from '../../Components/Blogs/BlogData';
import Brand from '../../Components/Header/Brand';

// API Hooks
import { useFeaturedTours } from '../../api/useTours';
import { useFeaturedListings } from '../../api/useBnb';
import { useProperties } from '../../api/useProperties';

// Partner logos data for strategic partnerships section
const partnerData = [
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Kenya+Wildlife+Service",
    target: "_blank",
    link: "https://kws.go.ke"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Tourism+Board",
    target: "_blank", 
    link: "https://magicalkenya.com"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Safari+Partners",
    target: "_blank",
    link: "#"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Hotel+Alliance",
    target: "_blank",
    link: "#"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Car+Rental+Co",
    target: "_blank",
    link: "#"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Investment+Group",
    target: "_blank",
    link: "#"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Tech+Partners",
    target: "_blank",
    link: "#"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Financial+Services",
    target: "_blank",
    link: "#"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Insurance+Provider",
    target: "_blank",
    link: "#"
  },
  {
    img: "https://via.placeholder.com/180x90/f8f9fa/6c757d?text=Local+Government",
    target: "_blank",
    link: "#"
  }
]


const InteractiveBannersData = [
  {
    subtitle: "Tours",
    title: "Safaris and guided experiences across East Africa",
    btnLink: "/tours",
    img: "https://via.placeholder.com/800x557",
    icon: "line-icon-Arrow-OutRight"
  },
  {
    subtitle: "BnB",
    title: "Verified short-stay accommodations and holiday homes",
    btnLink: "/rentals",
    img: "https://via.placeholder.com/800x557",
    icon: "line-icon-Arrow-OutRight"
  },
  {
    subtitle: "Properties",
    title: "New listings and developments in prime locations",
    btnLink: "/properties",
    img: "https://via.placeholder.com/800x557",
    icon: "line-icon-Arrow-OutRight"
  },
  {
    subtitle: "Cars",
    title: "Reliable vehicles for self-drive and chauffeur service",
    btnLink: "/cars",
    img: "https://via.placeholder.com/800x557",
    icon: "line-icon-Arrow-OutRight"
  }
]

const SocialIconsData = [
  {
    color: "#828282",
    link: "https://www.facebook.com/",
    icon: "fab fa-facebook-f"
  },
  {
    color: "#828282",
    link: "https://twitter.com/",
    icon: "fab fa-twitter"
  },
  {
    color: "#828282",
    link: "https://www.linkedin.com/",
    icon: "fab fa-linkedin-in"
  },
  {
    color: "#828282",
    link: "https://www.youtube.com/",
    icon: "fab fa-youtube"
  }
]

// Mock featured services for real platform domains
const mockFeaturedServices = [
  {
    title: 'Safari & Tours',
    img: 'https://via.placeholder.com/200x193/0EA5E9/FFFFFF?text=Tours',
    icon: 'line-icon-Compass-3',
    link: '/tours'
  },
  {
    title: 'BnB Stays',
    img: 'https://via.placeholder.com/200x193/10B981/FFFFFF?text=BnB',
    icon: 'line-icon-Green-House',
    link: '/bnb'
  },
  {
    title: 'Property Listings',
    img: 'https://via.placeholder.com/200x193/8B5CF6/FFFFFF?text=Properties',
    icon: 'line-icon-Building',
    link: '/properties'
  },
  {
    title: 'Car Rentals',
    img: 'https://via.placeholder.com/200x193/F59E0B/FFFFFF?text=Cars',
    icon: 'line-icon-Car',
    link: '/cars'
  },
  {
    title: 'Investments',
    img: 'https://via.placeholder.com/200x193/EF4444/FFFFFF?text=Invest',
    icon: 'line-icon-Coin',
    link: '/invest'
  }
]

const blogMasonryData = blogData.filter((item) => item.blogType === "masonry").filter(item => item.category.includes("travelagency"));

const HomeDecorPage = (props) => {
  const [activeSlide, setActiveSlide] = useState(0)
  
  // Load featured content from all domains
  const { data: featuredTours, isLoading: toursLoading } = useFeaturedTours(4);
  const { data: featuredBnb, isLoading: bnbLoading } = useFeaturedListings(4);
  const { data: featuredProperties, isLoading: propertiesLoading } = useProperties({ limit: 4 });

  // Mock tour data for display
  const mockTourData = [
    {
      id: 1,
      image: "https://via.placeholder.com/263x216/8B4513/FFFFFF?text=Masai+Mara+Safari",
      price: 599,
      duration: "3 Days",
      title: "Masai Mara Wildlife Safari",
      reviews: 42,
      description: "Experience the Great Migration and Big Five in Kenya's premier game reserve"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/263x216/228B22/FFFFFF?text=Mount+Kenya+Trek",
      price: 899,
      duration: "5 Days",
      title: "Mount Kenya Climbing Adventure",
      reviews: 28,
      description: "Conquer Africa's second highest peak with expert guides"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/263x216/4682B4/FFFFFF?text=Diani+Beach+Tour",
      price: 399,
      duration: "2 Days",
      title: "Diani Beach & Marine Safari",
      reviews: 67,
      description: "Pristine beaches, coral reefs, and dhow sailing adventures"
    },
    {
      id: 4,
      image: "https://via.placeholder.com/263x216/CD853F/FFFFFF?text=Samburu+Safari",
      price: 749,
      duration: "4 Days",
      title: "Samburu Cultural Safari",
      reviews: 35,
      description: "Unique wildlife and authentic Samburu cultural experiences"
    },
    {
      id: 5,
      image: "https://via.placeholder.com/263x216/FF6347/FFFFFF?text=Hell's+Gate",
      price: 199,
      duration: "1 Day",
      title: "Hell's Gate National Park",
      reviews: 89,
      description: "Cycling, rock climbing, and geothermal wonders day trip"
    },
    {
      id: 6,
      image: "https://via.placeholder.com/263x216/9370DB/FFFFFF?text=Amboseli+Safari",
      price: 649,
      duration: "3 Days",
      title: "Amboseli Elephant Safari",
      reviews: 54,
      description: "Majestic elephants with Mount Kilimanjaro backdrop"
    }
  ];

  // Mock BnB data for display
  const mockBnbData = [
    {
      id: 1,
      image: "https://via.placeholder.com/440x577/FF69B4/FFFFFF?text=Luxury+Villa+Westlands",
      price: 89,
      duration: "night",
      title: "Luxury Villa in Westlands",
      reviews: 156,
      description: "Modern 3BR villa with pool and garden in prime location"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/440x577/20B2AA/FFFFFF?text=Beachfront+House+Diani",
      price: 129,
      duration: "night", 
      title: "Beachfront House Diani",
      reviews: 89,
      description: "Stunning ocean views with direct beach access"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/440x577/32CD32/FFFFFF?text=Cozy+Cottage+Karen",
      price: 65,
      duration: "night",
      title: "Cozy Cottage in Karen",
      reviews: 203,
      description: "Peaceful retreat near Giraffe Centre and Elephant Orphanage"
    },
    {
      id: 4,
      image: "https://via.placeholder.com/440x577/FF4500/FFFFFF?text=Modern+Apartment+Nyali",
      price: 75,
      duration: "night",
      title: "Modern Apartment Nyali",
      reviews: 124,
      description: "Contemporary 2BR with ocean breeze and city access"
    },
    {
      id: 5,
      image: "https://via.placeholder.com/440x577/9932CC/FFFFFF?text=Safari+Lodge+Nakuru",
      price: 95,
      duration: "night",
      title: "Safari Lodge Near Lake Nakuru",
      reviews: 67,
      description: "Authentic safari experience with wildlife viewing"
    },
    {
      id: 6,
      image: "https://via.placeholder.com/440x577/FFD700/FFFFFF?text=Coastal+Villa+Kilifi",
      price: 110,
      duration: "night",
      title: "Coastal Villa in Kilifi",
      reviews: 98,
      description: "Tropical paradise with private beach and water sports"
    }
  ];

  // Mock car rental data for display
  const mockCarData = [
    {
      id: 1,
      image: "https://via.placeholder.com/210x235/DC143C/FFFFFF?text=Toyota+RAV4",
      price: 45,
      duration: "day",
      title: "Toyota RAV4 - City Explorer",
      reviews: 234,
      description: "Perfect for city drives and short trips, automatic transmission"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/210x235/8B4513/FFFFFF?text=Land+Cruiser",
      price: 89,
      duration: "day",
      title: "Toyota Land Cruiser - Safari Beast",
      reviews: 187,
      description: "Ultimate safari vehicle with 4WD and roof hatch for game viewing"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/210x235/4169E1/FFFFFF?text=Nissan+X-Trail",
      price: 55,
      duration: "day", 
      title: "Nissan X-Trail - Adventure Ready",
      reviews: 156,
      description: "Comfortable SUV for family adventures and rough terrain"
    },
    {
      id: 4,
      image: "https://via.placeholder.com/210x235/228B22/FFFFFF?text=Subaru+Forester",
      price: 65,
      duration: "day",
      title: "Subaru Forester - All Terrain",
      reviews: 143,
      description: "Reliable AWD for mountain roads and national parks"
    },
    {
      id: 5,
      image: "https://via.placeholder.com/210x235/FF6347/FFFFFF?text=Mitsubishi+Pajero",
      price: 75,
      duration: "day",
      title: "Mitsubishi Pajero - Expedition",
      reviews: 98,
      description: "Heavy-duty 4WD for serious off-road adventures"
    },
    {
      id: 6,
      image: "https://via.placeholder.com/210x235/9370DB/FFFFFF?text=Honda+CR-V",
      price: 50,
      duration: "day",
      title: "Honda CR-V - Comfort Cruiser",
      reviews: 201,
      description: "Smooth ride for long distances with excellent fuel economy"
    }
  ];

  // Mock property data for display
  const mockPropertyData = [
    {
      id: 1,
      image: "https://via.placeholder.com/600x400/8B4513/FFFFFF?text=Luxury+Apartment+Westlands",
      price: 25000000,
      title: "Luxury Apartment in Westlands",
      subtitle: "3BR • 2BA • 150 sqm",
      description: "Modern apartment with city views and premium finishes",
      link: "/properties/1"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/600x400/228B22/FFFFFF?text=Villa+Karen+Estate",
      price: 45000000,
      title: "Executive Villa in Karen",
      subtitle: "5BR • 4BA • 300 sqm",
      description: "Spacious family home with garden and swimming pool",
      link: "/properties/2"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/600x400/4682B4/FFFFFF?text=Beachfront+Villa+Diani",
      price: 35000000,
      title: "Beachfront Villa in Diani",
      subtitle: "4BR • 3BA • 250 sqm",
      description: "Stunning ocean views with private beach access",
      link: "/properties/3"
    },
    {
      id: 4,
      image: "https://via.placeholder.com/600x400/DC143C/FFFFFF?text=Penthouse+Kilimani",
      price: 55000000,
      title: "Penthouse in Kilimani",
      subtitle: "4BR • 3BA • 200 sqm",
      description: "Top floor luxury with panoramic city views",
      link: "/properties/4"
    }
  ];


  // Transform tour data for InfoBannerStyle05
  const toursToDisplay = featuredTours && featuredTours.length > 0 ? featuredTours : mockTourData;
  const transformedTours = toursToDisplay?.map(tour => ({
    img: tour.image || "https://via.placeholder.com/263x216",
    packageprice: tour.price ? `$${tour.price}` : "From $299",
    days: tour.duration || "3 Days",
    title: tour.title || tour.name || "Safari Adventure",
    reviews: tour.reviews ? `${tour.reviews} Reviews` : "25 Reviews",
    link: `/tours/${tour.id}`
  })) || [];

  // Transform BnB data for InteractiveBanners04
  const bnbToDisplay = featuredBnb && featuredBnb.length > 0 ? featuredBnb : mockBnbData;
  const transformedBnb = bnbToDisplay?.slice(0, 4).map(bnb => ({
    img: bnb.image || bnb.images?.[0] || "https://via.placeholder.com/440x577",
    title: bnb.title || bnb.name || "Cozy Accommodation",
    content: `${bnb.description || "Premium accommodation with modern amenities"} • $${bnb.price || 65}/${bnb.duration || "night"} • ${bnb.reviews || 50} Reviews`,
    btnTitle: "Book Now",
    btnLink: `/bnb/${bnb.id}`
  })) || [];

  // Transform car data for InteractiveBanners02
  const transformedCars = mockCarData?.slice(0, 6).map(car => ({
    img: car.image || "https://via.placeholder.com/210x235",
    subtitle: `$${car.price || 45}/${car.duration || "day"}`,
    title: car.title || car.name || "Reliable Vehicle",
    btnTitle: "Rent Now",
    btnLink: `/cars/${car.id}`
  })) || [];

  // Transform property data for PortfolioSlider
  const transformedProperties = mockPropertyData?.map(property => ({
    img: property.image || "https://via.placeholder.com/600x400",
    title: property.title || "Premium Property",
    subtitle: property.subtitle || "Luxury Living",
    link: property.link || `/properties/${property.id}`
  })) || [];


  // Transform API data for InteractiveBanners - Unified Platform Experience
  const transformedBanners = [
    {
      subtitle: "DISCOVER",
      title: "Epic safaris and cultural adventures that create memories for a lifetime",
      btnLink: "/tours",
      img: featuredTours?.[0]?.image || "/assets/img/webp/safari-adventure.webp",
      icon: "line-icon-Compass-3",
      serviceIcon: "line-icon-Compass-3"
    },
    {
      subtitle: "DRIVE",
      title: "Premium vehicles that take you anywhere, from city streets to safari trails",
      btnLink: "/cars",
      img: "/assets/img/webp/luxury-vehicle.webp",
      icon: "line-icon-Car",
      serviceIcon: "line-icon-Car"
    },
    {
      subtitle: "INVEST", 
      title: "Smart wealth-building opportunities that grow your money while you travel",
      btnLink: "/invest",
      img: "/assets/img/webp/investment-growth.webp",
      icon: "line-icon-Coin",
      serviceIcon: "line-icon-Coin"
    },
    {
      subtitle: "SLEEP",
      title: "Stunning accommodations where luxury meets comfort in every destination",
      btnLink: "/rentals",
      img: featuredBnb?.[0]?.images?.[0] || "/assets/img/webp/luxury-accommodation.webp",
      icon: "line-icon-Green-House",
      serviceIcon: "line-icon-Green-House"
    },
    {
      subtitle: "OWN",
      title: "Premium properties and developments in prime locations for investment and living",
      btnLink: "/properties",
      img: "/assets/img/webp/premium-properties.webp",
      icon: "line-icon-Building",
      serviceIcon: "line-icon-Building"
    }
  ];

  return (
    <div style={props.style}>
      {/* Header start */}
      <Header className="header-with-topbar decor-header" topSpace={{ desktop: true }} type="reverse-scroll">
        <Topbar className="bg-lightgray border-b border-[#0000001a] sm:hidden md:px-[15px]">
          <Container fluid className="px-[50px]">
            <Row>
              <Col className="col-12 col-sm-auto text-center items-center flex text-sm-start me-auto ps-lg-0 !pl-[15px]">
                <SocialIcons theme="social-icon-style-01" className="decor-social-icon" size="xs" iconColor="dark" data={SocialIconsData} />
              </Col>
              <Col className="col-auto flex xs:hidden text-right">
                <div className="top-bar-contact flex">
                  <span className="border-l border-[#0000001a] py-[13px] px-[18px] text-sm flex items-center">
                    <i className="far fa-envelope mr-[10px] text-md relative text-red-600"></i>
                    <a aria-label="gmail for link" href="mailto:info@yourdomain.com" className="hover:text-darkgray">info@yourdomain.com</a>
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </Topbar>
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
      <section className="home-decor flex items-center justify-center overflow-hidden relative">
        <Swiper
          pagination={{ el: ".custom-pagination", clickable: true }}
          keyboard={true}
          effect="fade"
          loop={true}
          fadeEffect={{ crossFade: true }}
          modules={[Pagination, EffectFade, Mousewheel, Keyboard]}
          className="font-serif overflow-hidden h-[800px] lg:h-[545px] sm:h-[400px] xs:full-screen"
          onSlideChange={(swiperCore) => {
            const { realIndex } = swiperCore;
            setActiveSlide(realIndex)
          }}
        >
          <SwiperSlide className="cover-background bg-[#faf6f3] z-20 flex items-center transition-default" style={{ backgroundImage: "url('/assets/img/webp/transparent.webp')" }}>
            <m.span
              initial={{ opacity: 0, x: -40 }}
              animate={activeSlide === 0 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-0 left-[-110px] h-full flex items-center z-[1] text-[#fff] leading-none text-[310px] xl:hidden"
            >01</m.span>
            <Container fluid="md" className="relative h-full">
              <Row className="font-serif h-full xs:flex-col-reverse xs:flex-nowrap xs:gap-y-[10px]">
                <Col xl={6} lg={6} sm={6} xs={12} className="caption text-base overflow-hidden flex flex-col justify-center items-start relative lg:pl-5 xs:items-center xs:text-center xs:h-1/2">
                  <m.span
                    initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    animate={{ clipPath: activeSlide === 0 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="uppercase inline-block mb-[20px] text-left leading-[15px] text-red-600 font-medium sm:text-xs">BUCKLER INVESTMENTS GROUP
                  </m.span>
                  <m.h2 className="heading-6 text-[81px] leading-[86px] p-0 font-bold text-darkgray mb-[45px] lg:text-[60px] lg:leading-[55px] sm:text-[33px] sm:leading-[30px] sm:mb-[25px]"
                    initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    animate={{ clipPath: activeSlide === 0 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    transition={{ delay: 1.2, duration: 0.6 }}>Invest. Travel. Live East Africa.
                  </m.h2>
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={activeSlide === 0 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}>
                    <Buttons ariaLabel="Explore Buckler" href="/properties" className="font-semibold hover:text-darkgray flex items-center font-serif uppercase btn-expand rounded md:mb-[15px]" icon="line-icon-Arrow-OutRight text-[30px] inline-block" iconPosition="after" size="xl" color="#232323" themeColor="rgba(191,140,76,0.3)" to="/properties" title="Explore Buckler" />
                  </m.div>
                </Col>
                <Col sm={6} className="relative xs:h-1/2">
                  <m.div
                    className="circle w-[940px] h-[940px] bg-[#f0e6da] -z-[1] rounded-full absolute bottom-[-250px] left-[-50px] lg:w-[650px] lg:h-[650px] lg:-bottom-[30px] lg:left-[-99px] md:bottom-0 sm:w-[500px] sm:h-[500px] xs:w-[320px] xs:h-[320px] xs:top-[-50px] xs:right-[-50px] xs:left-auto"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={activeSlide === 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}>
                    <m.div className="element-one inline-block" animate={{ x: [1, -6, -9, -9, -6, 6, 9, 9, 1], y: [1, 6, 9, 9, -6, -9, -9, -6, 1] }} transition={{ times: [1, 6, 2, 2, 6, 2, 2, 6], duration: 10, repeat: Infinity, }} >
                    </m.div>
                  </m.div>
                  <MouseMove enableOnHover={true} speed={2} className="h-full w-full block absolute z-[3] bottom-[50px] lg:bottom-0 xs:left-0">
                    <div>
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 0 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.7, duration: 1 }}
                        className="absolute top-[0] left-[155px] lg:w-[130px] lg:left-[70px] sm:w-[80px] xs:-translate-x-1/2 xs:left-1/2"
                        src="https://via.placeholder.com/218x250"
                      />
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 0 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-[-55px] lg:w-[365px] lg:bottom-[-20px] lg:right-[190px] md:right-[60px] sm:w-[230px] sm:bottom-0 xs:right-auto xs:left-[calc(50%-50px)] xs:-translate-x-1/2"
                        src="https://via.placeholder.com/552x504"
                      />
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 0 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 2.2, duration: 1 }}
                        className="absolute right-[-125px] bottom-[-32px] lg:w-[120px] lg:bottom-[20px] lg:right-[100px] md:right-0 sm:w-[80px] sm:bottom-0 xs:right-auto xs:left-[calc(50%+100px)] xs:-translate-x-1/2"
                        src="https://via.placeholder.com/193x495"
                      />
                    </div>
                  </MouseMove>
                </Col>
              </Row>
            </Container>
          </SwiperSlide>
          <SwiperSlide className="cover-background bg-[#faf6f3] z-20 flex items-center transition-default" style={{ backgroundImage: "url('/assets/img/webp/transparent.webp')" }}>
            <m.span
              initial={{ opacity: 0, x: -40 }}
              animate={activeSlide === 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-0 left-[-110px] h-full flex items-center z-[1] text-[#fff] leading-none text-[310px] xl:hidden"
            >02</m.span>
            <Container fluid="md" className="relative h-full">
              <Row className="font-serif h-full xs:flex-col-reverse xs:flex-nowrap xs:gap-y-[50px]">
                <Col xl={6} lg={6} sm={6} xs={12} className="caption text-base overflow-hidden flex flex-col justify-center items-start relative lg:pl-5 xs:items-center xs:text-center xs:h-1/2">
                  <m.span
                    initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    animate={{ clipPath: activeSlide === 1 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="uppercase inline-block mb-[20px] text-left leading-[15px] text-red-600 font-medium sm:text-xs">BUCKLER TRAVEL
                  </m.span>
                  <m.h2 className="heading-6 text-[81px] leading-[86px] p-0 font-bold text-darkgray mb-[45px] lg:text-[60px] lg:leading-[55px] sm:text-[33px] sm:leading-[30px] sm:mb-[25px]"
                    initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    animate={{ clipPath: activeSlide === 1 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    transition={{ delay: 1.2, duration: 0.6 }}>Handpicked tours and BnB stays
                  </m.h2>
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={activeSlide === 1 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}>
                    <Buttons ariaLabel="View tours" href="/tours" className="font-semibold hover:text-darkgray flex items-center font-serif uppercase btn-expand rounded md:mb-[15px]" icon="line-icon-Arrow-OutRight text-[30px] inline-block" iconPosition="after" size="xl" color="#232323" themeColor="rgba(191,140,76,0.3)" to="/tours" title="View tours" />
                  </m.div>
                </Col>
                <Col sm={6} className="relative xs:h-1/2">
                  <m.div
                    className="circle w-[940px] h-[940px] bg-[#f0e6da] -z-[1] rounded-full absolute bottom-[-250px] left-[-50px] lg:w-[650px] lg:h-[650px] lg:-bottom-[30px] lg:left-[-99px] md:bottom-0 sm:w-[500px] sm:h-[500px] xs:w-[320px] xs:h-[320px] xs:top-[-50px] xs:right-[-50px] xs:left-auto"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={activeSlide === 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}>
                    <m.div className="element-one inline-block" animate={{ x: [1, -6, -9, -9, -6, 6, 9, 9, 1], y: [1, 6, 9, 9, -6, -9, -9, -6, 1] }} transition={{ times: [1, 6, 2, 2, 6, 2, 2, 6], duration: 10, repeat: Infinity, }} >
                    </m.div>
                  </m.div>
                  <MouseMove speed={2} className="h-full w-full block absolute z-[3] bottom-[50px] lg:bottom-0 xs:left-0">
                    <div>
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 1 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.7, duration: 1 }}
                        className="absolute top-[-20px] left-[415px] lg:w-[100px] lg:left-[150px] sm:w-[80px] xs:-translate-x-1/2 xs:left-1/2"
                        src="https://via.placeholder.com/134x287"
                      />
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 1 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute w-[545px] bottom-[35px] right-[20px] lg:w-[365px] lg:bottom-[-20px] lg:right-[300px] md:right-[60px] sm:w-[230px] sm:right-[170px] sm:bottom-0 xs:bottom-[-50px] xs:left-[calc(50%-25px)] xs:-translate-x-1/2"
                        src="https://via.placeholder.com/514x498"
                      />
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 1 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 2.2, duration: 1 }}
                        className="absolute w-[332px] right-[-225px] bottom-[55px] lg:w-[260px] lg:bottom-[20px] lg:right-[100px] md:right-[-120px] sm:w-[180px] sm:bottom-0 sm:right-[40px] xs:bottom-[-50px] xs:left-[calc(50%+115px)] xs:-translate-x-1/2"
                        src="https://via.placeholder.com/313x358"
                      />
                    </div>
                  </MouseMove>
                </Col>
              </Row>
            </Container>
          </SwiperSlide>
          <SwiperSlide className="cover-background bg-[#faf6f3] z-20 flex items-center transition-default" style={{ backgroundImage: "url('/assets/img/webp/transparent.webp')" }}>
            <m.span
              initial={{ opacity: 0, x: -40 }}
              animate={activeSlide === 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-0 left-[-110px] h-full flex items-center z-[1] text-[#fff] leading-none text-[310px] xl:hidden"
            >03</m.span>
            <Container fluid="md" className="relative h-full">
              <Row className="font-serif h-full xs:flex-col-reverse xs:flex-nowrap xs:gap-y-[10px]">
                <Col xl={6} lg={6} sm={6} xs={12} className="caption text-base overflow-hidden flex flex-col justify-center items-start relative lg:pl-5 xs:items-center xs:text-center xs:h-1/2">
                  <m.span
                    initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    animate={{ clipPath: activeSlide === 2 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="uppercase inline-block mb-[20px] text-left leading-[15px] text-red-600 font-medium sm:text-xs">BUCKLER INVEST
                  </m.span>
                  <m.h2 className="heading-6 text-[81px] leading-[86px] p-0 font-bold text-darkgray mb-[45px] lg:text-[60px] lg:leading-[55px] sm:text-[33px] sm:leading-[30px] sm:mb-[25px]"
                    initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    animate={{ clipPath: activeSlide === 2 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                    transition={{ delay: 1.2, duration: 0.6 }}>Accessible investment products
                  </m.h2>
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={activeSlide === 2 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}>
                    <Buttons ariaLabel="Explore investments" href="/invest" className="font-semibold hover:text-darkgray flex items-center font-serif uppercase btn-expand rounded md:mb-[15px]" icon="line-icon-Arrow-OutRight text-[30px] inline-block" iconPosition="after" size="xl" color="#232323" themeColor="rgba(191,140,76,0.3)" to="/invest" title="Explore investments" />
                  </m.div>
                </Col>
                <Col sm={6} className="relative xs:h-1/2">
                  <m.div
                    className="circle w-[940px] h-[940px] bg-[#f0e6da] -z-[1] rounded-full absolute bottom-[-250px] left-[-50px] lg:w-[650px] lg:h-[650px] lg:-bottom-[30px] lg:left-[-99px] md:bottom-0 sm:w-[500px] sm:h-[500px] xs:w-[320px] xs:h-[320px] xs:top-[-50px] xs:right-[-50px] xs:left-auto"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={activeSlide === 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}>
                    <m.div className="element-one inline-block" animate={{ x: [1, -6, -9, -9, -6, 6, 9, 9, 1], y: [1, 6, 9, 9, -6, -9, -9, -6, 1] }} transition={{ times: [1, 6, 2, 2, 6, 2, 2, 6], duration: 10, repeat: Infinity, }} >
                    </m.div>
                  </m.div>
                  <MouseMove speed={2} className="h-full w-full block absolute z-[3] bottom-[50px] lg:bottom-0 xs:left-0">
                    <div>
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 2 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.7, duration: 1 }}
                        className="absolute top-[0] left-[200px] lg:w-[130px] lg:left-[70px] sm:w-[80px] xs:-translate-x-1/2 xs:left-1/2"
                        src="https://via.placeholder.com/179x215"
                      />
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 2 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute w-[410px] left-[40px] bottom-[100px] lg:w-[365px] lg:bottom-[-20px] lg:right-[200px] lg:left-auto md:right-[80px] sm:w-[230px] sm:right-[120px] sm:bottom-0 xs:left-[calc(50%-25px)] xs:-translate-x-1/2 xs:right-auto"
                        src="https://via.placeholder.com/385x436"
                      />
                      <m.img
                        height=""
                        width=""
                        alt="..."
                        initial={{ opacity: 0 }}
                        animate={activeSlide === 2 ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 2.2, duration: 1 }}
                        className="absolute w-[565px] right-[-265px] bottom-[15px] lg:w-[350px] lg:bottom-[0] lg:right-0 md:w-[350px] md:right-[-100px] sm:w-[250px] sm:right-[-30px] sm:bottom-0 xs:right-auto xs:left-[calc(50%+100px)] xs:-translate-x-1/2"
                        src="https://via.placeholder.com/534x529"
                      />
                    </div>
                  </MouseMove>
                </Col>
              </Row>
            </Container>
          </SwiperSlide>
        </Swiper>
        <div className="custom-pagination container xs:text-center"></div>
      </section>
      {/* Section End */}

      {/* Unified Search Section Start */}
      <UnifiedSearch />
      {/* Unified Search Section End */}

      {/* Section Start */}
      <section className="py-[90px] md:py-[75px] sm:py-[50px] border-b border-mediumgray">
        <Container>
          <Row className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 justify-center gap-y-10">
            <Col>
              <m.div className="flex items-center" {...fadeIn} transition={{ delay: 0.2, duration: 1.2 }}>
                <i className="line-icon-Headset text-[35px] text-red-600 mr-[30px] lg:mr-[25px] inline-block"></i>
                <div> <div className="text-darkgray leading-none font-medium text-xmd mb-[5px]">Expert support</div> <span>Contact support team</span>
                </div>
              </m.div>
            </Col>
            <Col>
              <m.div className="flex items-center" {...fadeIn} transition={{ delay: 0.4, duration: 1.2 }}>
                <i className="line-icon-Like-2 text-[35px] text-red-600 mr-[30px] lg:mr-[25px] inline-block"></i>
                <div> <div className="text-darkgray leading-none font-medium text-xmd mb-[5px]">Perfect quality</div> <span>Perfect design quality</span> </div>
              </m.div>
            </Col>
            <Col>
              <m.div className="flex items-center" {...fadeIn} transition={{ delay: 0.6, duration: 1.2 }}>
                <i className="line-icon-Shield text-[35px] text-red-600 mr-[30px] lg:mr-[25px] inline-block"></i>
                <div> <div className="text-darkgray leading-none font-medium text-xmd mb-[5px]">Security checkout</div> <span>Safe and trustworthy</span> </div>
              </m.div>
            </Col>
            <Col>
              <m.div className="flex items-center" {...fadeIn} transition={{ delay: 0.8, duration: 1.2 }}>
                <i className="line-icon-Coin text-[35px] text-red-600 mr-[30px] lg:mr-[25px] inline-block"></i>
                <div>
                  <div className="text-darkgray leading-none font-medium text-xmd mb-[5px]">Instant discounts</div> <span>Use your coupon now</span> </div>
              </m.div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}


      {/* Featured Services Section Start */}
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="text-center mb-[77px] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
                <div className="font-serif text-xmd text-red-600 px-[10px]">featured services</div>
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-bold text-darkgray uppercase tracking-[-1px]">FEATURED SERVICES</h2>
            </Col>
          </Row>
          <InteractiveBanners13 
            data={mockFeaturedServices}
            grid="row row-cols-1 row-cols-lg-4 row-cols-sm-2 gap-y-10 items-center" 
            animation={zoomIn} 
            animationTransition="circOut" 
            animationDuration={1} 
          />
        </Container>
      </section>
      {/* Featured Services Section End */}

      {/* Tours Section Start */}
      <section id="tours" className="bg-[#f9f6f3] py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
                <div className="font-serif text-xmd text-red-600 px-[10px]">featured tours</div>
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-bold text-darkgray uppercase tracking-[-1px]">SAFARI & ADVENTURE TOURS</h2>
            </Col>
          </Row>
        </Container>
        <Container>
          <InfoBannerStyle05
            data={transformedTours}
            animation={fadeIn}
            animationDelay={0.2}
            carouselOption={{
              slidesPerView: 1,
              spaceBetween: 30,
              loop: true,
              autoplay: { delay: 3000, disableOnInteraction: false },
              breakpoints: {
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }
            }}
          />
          <Row className="justify-center mt-12">
            <Col className="text-center">
              <Buttons 
                to="/tours" 
                className="btn-fancy btn-fill font-medium font-serif uppercase rounded-none" 
                themeColor="#232323" 
                color="#fff" 
                size="lg" 
                title="View All Tours" 
              />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Tours Section End */}

      {/* BnB Section Start */}
      <section id="bnb" className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
                <div className="font-serif text-xmd text-red-600 px-[10px]">featured accommodations</div>
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-bold text-darkgray uppercase tracking-[-1px]">PREMIUM BNB STAYS</h2>
            </Col>
          </Row>
        </Container>
        <Container>
          <InteractiveBanners04
            data={transformedBnb}
            overlay={["#0039e3d9", "#4132e0d9", "#5e28ddd9", "#741bd9d9"]}
            animation={fadeIn}
            animationDelay={0.3}
            grid="row-cols-1 row-cols-lg-4 row-cols-md-2 gap-y-10"
          />
          <Row className="justify-center mt-12">
            <Col className="text-center">
              <Buttons 
                to="/bnb" 
                className="btn-fancy btn-fill font-medium font-serif uppercase rounded-none" 
                themeColor="#232323" 
                color="#fff" 
                size="lg" 
                title="View All Accommodations" 
              />
            </Col>
          </Row>
        </Container>
      </section>
      {/* BnB Section End */}

      {/* Premium Vehicle Rentals Section Start */}
      <section id="cars" className="bg-[#f9f6f3] py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
                <div className="font-serif text-xmd text-red-600 px-[10px]">premium fleet</div>
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-bold text-darkgray uppercase tracking-[-1px]">PREMIUM VEHICLE RENTALS</h2>
            </Col>
          </Row>
        </Container>
        <Container>
          <InteractiveBanners02
            data={transformedCars}
            animation={fadeIn}
            animationDelay={0.3}
            carousalOption={{
              slidesPerView: 1,
              spaceBetween: 30,
              loop: true,
              autoplay: { delay: 4000, disableOnInteraction: false },
              breakpoints: {
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }
            }}
          />
          <Row className="justify-center mt-12">
            <Col className="text-center">
              <Buttons 
                to="/cars" 
                className="btn-fancy btn-fill font-medium font-serif uppercase rounded-none" 
                themeColor="#232323" 
                color="#fff" 
                size="lg" 
                title="View All Vehicles" 
              />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Premium Vehicle Rentals Section End */}

      {/* Property Listings Section Start */}
      <section id="properties" className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
                <div className="font-serif text-xmd text-red-600 px-[10px]">premium properties</div>
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-bold text-darkgray uppercase tracking-[-1px]">LUXURY PROPERTY LISTINGS</h2>
            </Col>
          </Row>
        </Container>
        <Container>
          <PortfolioSlider
            data={transformedProperties}
            overlay={["#0039e3d9", "#4132e0d9", "#5e28ddd9", "#741bd9d9"]}
            animation={fadeIn}
            carousalOption={{
              slidesPerView: 1,
              spaceBetween: 30,
              loop: true,
              autoplay: { delay: 4500, disableOnInteraction: false },
              breakpoints: {
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }
            }}
          />
          <Row className="justify-center mt-12">
            <Col className="text-center">
              <Buttons 
                to="/properties" 
                className="btn-fancy btn-fill font-medium font-serif uppercase rounded-none" 
                themeColor="#232323" 
                color="#fff" 
                size="lg" 
                title="View All Properties" 
              />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Property Listings Section End */}





      {/* Unified Platform Section Start */}
      <section className="overflow-hidden bg-gradient-to-b from-[#fff] to-[#f8f9fa] py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={10} className="text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[15px]">
                <span className="w-[30px] h-[1px] bg-gradient-to-r from-transparent to-red-600"></span>
                <div className="font-serif text-lg text-red-600 px-[15px] font-medium">ONE PLATFORM, ENDLESS POSSIBILITIES</div>
                <span className="w-[30px] h-[1px] bg-gradient-to-l from-transparent to-red-600"></span>
              </div>
              <h2 className="heading-4 font-serif font-bold text-darkgray uppercase tracking-[-1px] mb-[25px]">
                YOUR COMPLETE JOURNEY STARTS HERE
              </h2>
              <p className="text-xl leading-[32px] lg:text-lg lg:leading-[28px] text-slate-600 max-w-4xl mx-auto">
                <span className="text-red-600 font-semibold">Discover</span> breathtaking destinations, 
                <span className="text-red-600 font-semibold">drive</span> in comfort with premium vehicles, 
                <span className="text-red-600 font-semibold">invest</span> in your future with smart opportunities, 
                <span className="text-red-600 font-semibold">sleep</span> peacefully in luxury accommodations, 
                and <span className="text-red-600 font-semibold">own</span> premium properties in prime locations — 
                all seamlessly integrated in one intelligent platform.
              </p>
            </Col>
          </Row>
        </Container>
        <Container fluid className="px-0">
          <InteractiveBanners01 grid="row-cols-1 row-cols-lg-5 row-cols-md-3 row-cols-sm-2" data={transformedBanners} animation={fadeIn} />
        </Container>
      </section>
      {/* Unified Platform Section End */}

      {/* Section Start */}
      <section className="bg-[#f9f6f3] py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col md={6} className="col-12 text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
                <div className="font-serif text-xmd text-red-600 px-[10px]">travel and investment insights</div>
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-bold text-darkgray uppercase tracking-[-1px]">LATEST ARTICLES</h2>
            </Col>
          </Row>
          <Row>
            <Col className="sm:px-0">
              <BlogMasonry filter={false} grid="grid grid-3col xl-grid-3col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col gutter-extra-large" data={blogMasonryData} />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Section End */}

      {/* Section Start */}
      <m.section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]" {...fadeIn}>
        <Container>
          <Row className="justify-center">
            <Col md={12}>
              <Instagram carousel={true}
                carouselOption={{
                  loop: true,
                  slidesPerView: 2,
                  spaceBetween: 15,
                  autoplay: { "delay": 3500, "disableOnInteraction": false },
                  keyboard: { "enabled": true, "onlyInViewport": true },
                  breakpoints: { 1200: { slidesPerView: 6 }, 992: { slidesPerView: 3 }, 768: { slidesPerView: 3 } }
                }}
                total_posts={8} title="#instagram decor" grid="" />
            </Col>
          </Row>
        </Container>
      </m.section>
      {/* Section Start */}

      {/* Partners Section Start */}
      <m.section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] bg-lightgray" {...fadeIn}>
        <Container>
          <Row className="justify-center">
            <Col md={8} className="col-12 text-center mb-[4.5rem] md:mb-12">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
                <div className="font-serif text-xmd text-red-600 px-[10px]">trusted partnerships</div>
                <span className="w-[25px] h-[1px] bg-red-600 opacity-40"></span>
              </div>
              <h2 className="heading-5 font-serif font-bold text-darkgray uppercase tracking-[-1px]">OUR STRATEGIC PARTNERS</h2>
              <p className="text-lg leading-[28px] lg:text-xmd lg:leading-[22px] text-slate-500">
                Collaborating with industry leaders to provide exceptional travel and investment experiences
              </p>
            </Col>
          </Row>
          <Row className="justify-center">
            <Col>
              <Clients 
                carousel={true}
                carouselOption={{
                  slidesPerView: 5,
                  spaceBetween: 30,
                  loop: true,
                  autoplay: { 
                    delay: 3000, 
                    disableOnInteraction: false,
                    reverseDirection: true 
                  },
                  speed: 5000,
                  breakpoints: { 
                    1200: { slidesPerView: 5 }, 
                    992: { slidesPerView: 4 }, 
                    768: { slidesPerView: 3 },
                    576: { slidesPerView: 2 }
                  }
                }}
                theme="client-logo-style-02" 
                data={partnerData} 
                animation={fadeIn} 
                animationDelay={0.1} 
              />
            </Col>
          </Row>
        </Container>
      </m.section>
      {/* Partners Section End */}

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
              data={[
                {
                  name: "Jeremy Dupont",
                  content: "Simply the great designs and best theme for WooCommerce, loading fast, customisable and easy to use.",
                  img: "https://via.placeholder.com/125x125",
                  company: "Google Marketing",
                  rating: 5,
                },
                {
                  name: "Herman Miller",
                  content: "There are design companies and then there are user experience, design, consulting, interface design.",
                  img: "https://via.placeholder.com/125x125",
                  company: "ThemeZaa Design",
                  rating: 5,
                },
                {
                  name: "Alexander Harvard",
                  content: "I wanted to hire the best and after looking at several other companies, I knew Jacob was the perfect guy.",
                  img: "https://via.placeholder.com/125x125",
                  company: "Microsoft Corporation",
                  rating: 5,
                },
              ]}
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

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" language="en" />
      {/* Footer End */}

    </div>
  )
}

export default HomeDecorPage