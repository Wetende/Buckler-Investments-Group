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
// Duplicate import removed: Testimonials is already imported above
import TextSlider01 from "../../Components/TextSlider/TextSlider01";
import BlogClassic from "../../Components/Blogs/BlogClassic";
import Buttons from "../../Components/Button/Buttons";
import { TiltBox } from "../../Components/FancyText/FancyText";
import { Input } from "../../Components/Form/Form";
import MessageBox from "../../Components/MessageBox/MessageBox";
import Overlap from "../../Components/Overlap/Overlap";
import FooterStyle01 from "../../Components/Footers/FooterStyle01";
import { fadeIn, fadeInLeft, zoomIn } from "../../Functions/GlobalAnimations";
import InfoBannerStyle05 from "../../Components/InfoBanner/InfoBannerStyle05";
import InfoBannerWithBadges from "../../Components/InfoBanner/InfoBannerWithBadges";
import { resetForm, sendEmail } from "../../Functions/Utilities";
import ToursBookingModal from "../../Components/BookingModal/ToursBookingModal";
import MultiStepBookingModal from "../../Components/BookingModal/MultiStepBookingModal";
import Testimonials from "../../Components/Testimonials/Testimonials";
import { SupportContactButtons } from "../../Components/WhatsApp/WhatsAppContact";

// Data
import { InteractiveBannersData08 } from "../../Components/InteractiveBanners/InteractiveBannersData";
import { TextSliderData01 } from "../../Components/TextSlider/TextSliderData";
import { blogData } from "../../Components/Blogs/BlogData";
import { useFeaturedTours, useTourCategories, useToursList, useSearchTours, useCategoryTours } from '../../api/useTours';
import { getTour, getTourAvailability, getMyTourBookings } from '../../api/toursService';
import { getSuggestions, getTrending, unifiedSearch } from '../../api/searchService';
import { listBundles } from '../../api/bundleService';
import { getTourReviewStats, getTourReviews } from '../../api/reviewsService';
import { listTours } from '../../api/toursService';
import useAuth from '../../api/useAuth';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unifiedResults, setUnifiedResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Map API data to InfoBannerStyle05 format with rating badges
  const featuredItems = Array.isArray(featuredData)
    ? featuredData.map((tour) => ({
        img: tour.image || "https://via.placeholder.com/525x431",
        packageprice: tour.price ? `From ${tour.price} ${tour.currency || "KES"}` : "From KES 25,000",
        days: tour.duration || (tour.duration_hours ? `${tour.duration_hours} hrs` : "2 Days"),
        title: tour.title || tour.name || "Kenya Adventure",
        reviews: tour.reviews_count ? `${tour.reviews_count} Reviews` : "0 Reviews",
        link: `/tours/${tour.id}`,
        rating: tour.rating || 4.5,
        isTopRated: (tour.rating || 4.5) >= 4.7,
        topRatedBadge: (tour.rating || 4.5) >= 4.7 ? "TOP RATED" : null,
        availability: tour.availability_status || "available",
        availabilityText: tour.availability_status === "high_demand" ? "High Demand" : 
                         tour.availability_status === "few_spots" ? "Few Spots Left" :
                         tour.availability_status === "fully_booked" ? "Fully Booked" : "Available",
        // Add booking modal trigger
        customButton: (
          <ToursBookingModal
            tour={tour}
            triggerButton={
              <Buttons
                className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                themeColor="#232323"
                color="#fff"
                title="Book Now"
              />
            }
          />
        ),
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
  
  // Load trending destinations for search chips
  const [trendingData, setTrendingData] = useState(null);
  
  // Load recent reviews for travelers section
  const [recentReviews, setRecentReviews] = useState([]);
  
  // Authentication and user bookings
  const { isAuthenticated, user } = useAuth();
  const [userBookings, setUserBookings] = useState([]);
  
  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        const trending = await getTrending();
        setTrendingData(trending);
      } catch (error) {
        console.error('Failed to load trending data:', error);
      }
    };
    loadTrendingData();
  }, []);

  // Load recent reviews from featured tours
  useEffect(() => {
    if (featuredData && Array.isArray(featuredData)) {
      const loadRecentReviews = async () => {
        try {
          // Get reviews from the first 3 featured tours
          const reviewPromises = featuredData.slice(0, 3).map(async (tour) => {
            try {
              const reviews = await getTourReviews(tour.id, { limit: 2 });
              return reviews.map(review => ({
                ...review,
                tourTitle: tour.title || tour.name
              }));
            } catch (error) {
              console.error(`Failed to load reviews for tour ${tour.id}:`, error);
              return [];
            }
          });

          const allReviews = await Promise.all(reviewPromises);
          const flatReviews = allReviews.flat().slice(0, 6);
          setRecentReviews(flatReviews);
        } catch (error) {
          console.error('Failed to load recent reviews:', error);
        }
      };

      loadRecentReviews();
    }
  }, [featuredData]);

  // Load user bookings for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const loadUserBookings = async () => {
        try {
          const bookings = await getMyTourBookings({ limit: 3 });
          setUserBookings(bookings);
        } catch (error) {
          console.error('Failed to load user bookings:', error);
        }
      };

      loadUserBookings();
    }
  }, [isAuthenticated]);

  // Load recommendations based on user behavior and trending data
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Get recommendations based on trending searches and user history
        const trending = await getTrending();
        
        // Load tours based on trending locations/categories
        if (trending && trending.destinations) {
          const recommendationPromises = trending.destinations.slice(0, 3).map(async (destination) => {
            try {
              const tours = await listTours({ 
                location: destination.name, 
                limit: 2,
                sort: 'rating' 
              });
              return tours;
            } catch (error) {
              return [];
            }
          });
          
          const results = await Promise.all(recommendationPromises);
          const flatResults = results.flat().slice(0, 6);
          setRecommendedTours(flatResults);
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      }
    };

    loadRecommendations();
  }, []);

  // Load weather data for featured destinations
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        // Mock weather API integration - replace with actual weather service
        const mockWeatherData = {
          nairobi: { temp: 22, condition: 'Sunny', humidity: 65 },
          mombasa: { temp: 28, condition: 'Partly Cloudy', humidity: 75 },
          masai_mara: { temp: 25, condition: 'Clear', humidity: 60 }
        };
        setWeatherData(mockWeatherData);
      } catch (error) {
        console.error('Failed to load weather data:', error);
      }
    };

    loadWeatherData();
  }, []);

  // Handle search suggestions with debouncing
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(async () => {
        try {
          const suggestions = await getSuggestions(searchQuery, 8);
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to get suggestions:', error);
          setSearchSuggestions([]);
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle unified search
  const handleUnifiedSearch = async (query, filters = {}) => {
    setIsSearching(true);
    try {
      const results = await unifiedSearch({
        query,
        categories: ['tours', 'bnb', 'cars'],
        ...filters,
        limit: 20
      });
      setUnifiedResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };
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

  // Load bundle packages for cross-selling tours + accommodation + vehicles
  const [bundleData, setBundleData] = useState([]);
  const [bundleLoading, setBundleLoading] = useState(false);
  
  // Recommendations engine state
  const [recommendedTours, setRecommendedTours] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  
  // Live chat state
  
  useEffect(() => {
    const loadBundles = async () => {
      setBundleLoading(true);
      try {
        const bundles = await listBundles({ limit: 6, offset: 0 });
        setBundleData(bundles);
      } catch (error) {
        console.error('Failed to load bundles:', error);
      } finally {
        setBundleLoading(false);
      }
    };
    loadBundles();
  }, []);

  const bundleItems = Array.isArray(bundleData) && bundleData.length > 0
    ? bundleData.slice(0, 6).map((bundle) => ({
        img: bundle.image || 'https://via.placeholder.com/398x309',
        title: bundle.name || 'Adventure Package',
        country: bundle.location || 'Kenya',
        subtitle: `${bundle.duration_days} days`,
        btnTitle: 'View Package',
        btnLink: `/bundles/${bundle.id}`,
      }))
    : [
        { 
          img: 'https://via.placeholder.com/398x309', 
          title: 'Safari & Beach Package', 
          country: 'Kenya',
          subtitle: '5 days',
          btnTitle: 'View Package',
          btnLink: '/bundles/1'
        },
        { 
          img: 'https://via.placeholder.com/398x309', 
          title: 'City & Culture Bundle', 
          country: 'Kenya',
          subtitle: '3 days',
          btnTitle: 'View Package',
          btnLink: '/bundles/2'
        },
      ];

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
        {/* Hero Slider Section Start */}
        <section className="overflow-hidden h-[500px] md:h-[450px] sm:h-[400px]">
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

        {/* Smart Search Section Start */}
        <section className="py-[60px] border-b border-mediumgray bg-white md:py-[40px]">
          <Container>
            <Row className="justify-center">
              <Col lg={10}>
                <Formik
                  initialValues={{ query: '', location: '', start_date: '', max_price: '' }}
                  validationSchema={Yup.object().shape({
                    query: Yup.string(),
                    location: Yup.string(),
                    start_date: Yup.string(),
                    max_price: Yup.number().typeError('Must be a number').min(0, 'Must be >= 0'),
                  })}
                  onSubmit={async (values) => {
                    const filters = {};
                    if (values.location) filters.location = values.location;
                    if (values.start_date) filters.check_in = values.start_date;
                    if (values.max_price) filters.max_price = Number(values.max_price);
                    
                    await handleUnifiedSearch(values.query || values.location || 'tours', filters);
                  }}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="space-y-4">
                      <div className="relative">
                        <Input 
                          name="query" 
                          type="text" 
                          labelClass="!mb-[10px]" 
                          label="Search destinations, tours, activities..." 
                          placeholder="e.g., Maasai Mara Safari, Diani Beach"
                          onChange={(e) => {
                            setFieldValue('query', e.target.value);
                            setSearchQuery(e.target.value);
                          }}
                        />
                        
                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-10 max-h-48 overflow-y-auto">
                            {searchSuggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                onClick={() => {
                                  setFieldValue('query', suggestion);
                                  setSearchQuery(suggestion);
                                  setShowSuggestions(false);
                                  handleUnifiedSearch(suggestion);
                                }}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Trending Chips */}
                      {trendingData?.trending_destinations && (
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-sm text-gray-600">Trending:</span>
                          {trendingData.trending_destinations.slice(0, 5).map((dest, index) => (
                            <button
                              key={index}
                              type="button"
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                              onClick={() => {
                                setFieldValue('query', dest.name);
                                handleUnifiedSearch(dest.name);
                              }}
                            >
                              {dest.name}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <Input name="location" type="text" labelClass="!mb-[10px]" label="Location" placeholder="e.g., Nairobi" />
                      <Input name="start_date" type="date" labelClass="!mb-[10px]" label="Start date" />
                      <Input name="max_price" type="number" labelClass="!mb-[10px]" label="Max price (KES)" />
                        <Buttons 
                          ariaLabel="Search tours" 
                          type="submit" 
                          className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase" 
                          themeColor="#232323" 
                          color="#fff" 
                          title={isSubmitting || isSearching ? 'Searching...' : 'Search'} 
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </Container>
        </section>
        {/* Smart Search Section End */}

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

        {/* Live Search Results Start */}
        {unifiedResults && (
          <section className="py-[80px] border-b border-mediumgray bg-white md:py-[40px]">
            <Container>
              <Row>
                <Col>
                  <m.div className="mb-8" {...fadeIn}>
                    <h3 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">
                      Search Results for "{unifiedResults.query}"
                    </h3>
                    <p className="m-0 block">Found {unifiedResults.total_results} results across tours, accommodations, and vehicles</p>
                  </m.div>

                  {/* Tours Results */}
                  {unifiedResults.results.tours?.length > 0 && (
                    <div className="mb-12">
                      <h4 className="text-lg font-semibold mb-4">Tours ({unifiedResults.results.tours.length})</h4>
                      <InfoBannerStyle05
                        className="swiper-navigation-04 swiper-navigation-light black-move p-0"
                        carouselOption={{
                          slidesPerView: 1,
                          spaceBetween: 30,
                          loop: false,
                          autoplay: false,
                          breakpoints: {
                            1200: { slidesPerView: 3 },
                            992: { slidesPerView: 2 },
                            768: { slidesPerView: 1 },
                          },
                        }}
                        data={unifiedResults.results.tours.map((tour) => ({
                          img: tour.image || "https://via.placeholder.com/525x431",
                          packageprice: `From ${tour.price} ${tour.currency}`,
                          days: tour.duration_hours ? `${tour.duration_hours} hrs` : "Full Day",
                          title: tour.title,
                          reviews: `${tour.rating} stars`,
                          link: `/tours/${tour.id}`,
                          rating: tour.rating,
                        }))}
                      />
                    </div>
                  )}

                  {/* BnB Results */}
                  {unifiedResults.results.bnb?.length > 0 && (
                    <div className="mb-12">
                      <h4 className="text-lg font-semibold mb-4">Accommodations ({unifiedResults.results.bnb.length})</h4>
                      <InfoBannerStyle05
                        className="swiper-navigation-04 swiper-navigation-light black-move p-0"
                        carouselOption={{
                          slidesPerView: 1,
                          spaceBetween: 30,
                          loop: false,
                          autoplay: false,
                          breakpoints: {
                            1200: { slidesPerView: 3 },
                            992: { slidesPerView: 2 },
                            768: { slidesPerView: 1 },
                          },
                        }}
                        data={unifiedResults.results.bnb.map((listing) => ({
                          img: listing.image || "https://via.placeholder.com/525x431",
                          packageprice: `From ${listing.price} ${listing.currency}/night`,
                          days: `Up to ${listing.capacity} guests`,
                          title: listing.title,
                          reviews: `${listing.rating} stars`,
                          link: `/rentals/${listing.id}`,
                          rating: listing.rating,
                        }))}
                      />
                    </div>
                  )}

                  {/* Cars Results */}
                  {unifiedResults.results.cars?.length > 0 && (
                    <div className="mb-12">
                      <h4 className="text-lg font-semibold mb-4">Vehicles ({unifiedResults.results.cars.length})</h4>
                      <InfoBannerStyle05
                        className="swiper-navigation-04 swiper-navigation-light black-move p-0"
                        carouselOption={{
                          slidesPerView: 1,
                          spaceBetween: 30,
                          loop: false,
                          autoplay: false,
                          breakpoints: {
                            1200: { slidesPerView: 3 },
                            992: { slidesPerView: 2 },
                            768: { slidesPerView: 1 },
                          },
                        }}
                        data={unifiedResults.results.cars.map((car) => ({
                          img: car.image || "https://via.placeholder.com/525x431",
                          packageprice: `From ${car.price} ${car.currency}/day`,
                          days: `${car.seats} seats`,
                          title: car.title,
                          reviews: `${car.rating} stars`,
                          link: `/cars/${car.id}`,
                          rating: car.rating,
                        }))}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Container>
          </section>
        )}
        {/* Live Search Results End */}

        {/* About section Start */}
        <section className="py-[80px] bg-lightgray lg:py-[60px] md:py-[50px] sm:py-[40px]">
          <Container>
            <Row className="justify-center items-center">
              <Col lg={8} className="text-center">
                <m.h2
                  className="heading-5 font-serif font-medium text-darkgray mb-[25px] -tracking-[.5px]"
                  {...{
                    ...fadeInLeft,
                    transition: { ease: "circOut", duration: 1.2 },
                  }}
                >
                  Buckler curates authentic{" "}
                  <span className="font-bold">Kenyan tours</span>
                </m.h2>
                <Lists
                  className="travel-agency-list-style justify-center"
                  theme="list-style-07"
                  data={ListData}
                  animation={fadeInLeft}
                  animationDelay={0.3}
                />
                <m.div
                  className="mt-8 flex justify-center gap-4"
                  {...{
                    ...fadeInLeft,
                    transition: {
                      delay: 0.5,
                      ease: "circOut",
                      duration: 1,
                    },
                  }}
                >
                  <Buttons
                    ariaLabel="View all tours"
                    href="/tours"
                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                    themeColor="#232323"
                    color="#fff"
                    size="sm"
                    title="View tours"
                  />
                </m.div>
              </Col>
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

        {/* Trending Destinations Section Start */}
        <m.section
          className="pb-0 py-[130px] overflow-hidden bg-white lg:py-[90px] md:py-[75px] sm:py-[50px]"
          {...fadeIn}
        >
          <Container fluid className="px-0">
            {trendingData?.trending_destinations ? (
            <TextSlider01
                data={trendingData.trending_destinations.map((dest, index) => ({
                  title: dest.name,
                  content: `${dest.searches} searches this month`,
                  link: `/tours?category=${encodeURIComponent(dest.category)}`,
                  category: dest.category,
                }))}
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
            ) : (
              <TextSlider01
                data={[
                  { title: "Maasai Mara", content: "1,250 searches this month", link: "/tours?category=safari" },
                  { title: "Diani Beach", content: "980 searches this month", link: "/tours?category=beach" },
                  { title: "Nairobi City", content: "875 searches this month", link: "/tours?category=urban" },
                ]}
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
            )}
          </Container>
        </m.section>
        {/* Trending Destinations Section End */}

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
                <InfoBannerWithBadges
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

        {/* From Travelers Reviews Section Start */}
        {recentReviews.length > 0 && (
          <section className="py-[130px] bg-[#f7f8fc] lg:py-[90px] md:py-[75px] sm:py-[50px]">
            <Container>
              <Row className="justify-center">
                <Col lg={6} md={8} sm={10} className="text-center mb-16">
                  <h2 className="heading-4 font-serif font-semibold text-darkgray uppercase mb-[15px] -tracking-[1px]">
                    From Our Travelers
                  </h2>
                  <p className="text-lg leading-[28px] text-darkgray w-[85%] mx-auto lg:w-full">
                    Real experiences from adventurers who have explored Kenya with us
                  </p>
                </Col>
              </Row>
              <Testimonials
                data={recentReviews.map(review => ({
                  img: review.user_avatar || "https://via.placeholder.com/125x125",
                  title: review.user_name || "Traveler",
                  designation: review.tourTitle,
                  content: review.content || review.comment,
                  stars: review.rating || 5
                }))}
                carouselOption={{
                  slidesPerView: 1,
                  spaceBetween: 30,
                  loop: true,
                  autoplay: { delay: 4000, disableOnInteraction: false },
                  breakpoints: {
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 3 }
                  }
                }}
                animation={fadeIn}
                className="swiper-navigation-04 swiper-navigation-light"
              />
            </Container>
          </section>
        )}
        {/* From Travelers Reviews Section End */}

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

        {/* Bundle Packages Section Start */}
        <section className="relative overflow-hidden py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px] px-28 bg-white lg:p-[90px] lg:px-8 xl:px-8 xs:px-0">
          <Container fluid>
            <Row className="items-center justify-center">
              <m.div
                className="relative lg:mb-20 lg:text-center col-xl-3 col-lg-9 col-md-8"
                {...{ ...fadeIn, transition: { delay: 0.2 } }}
              >
                <h2 className="heading-5 font-serif uppercase text-darkgray font-semibold mb-[25px] lg:mx-auto -tracking-[1px] w-[75%] xl:w-full lg:w-1/2 mx:xl-0 lg:mb-[15px] md:w-full">
                  Bundle Packages
                </h2>
                <p className="w-[75%] lg:mx-auto lg:text-center mb-[35px] xl:w-full lg:w-[65%] mx:xl-0 md:w-full sm:mb-[30px]">
                  Complete travel experiences combining tours, accommodation, and transport. 
                  Save money with our carefully curated packages.
                </p>
                <Buttons
                  ariaLabel="link for bundles"
                  href="/bundles"
                  className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase md:mb-[15px]"
                  themeColor="#232323"
                  color="#fff"
                  size="sm"
                  title="explore packages"
                />
              </m.div>
              <Col xl={9} lg={12}>
                {bundleLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neonorange"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading bundle packages...</p>
                  </div>
                ) : (
                <InteractiveBanners08
                  className=""
                  grid="row-cols-1 row-cols-md-2 row-cols-lg-3 gap-y-10 justify-center"
                    data={bundleItems}
                  animation={fadeInLeft}
                />
                )}
              </Col>
            </Row>
          </Container>
        </section>
        {/* Bundle Packages Section End */}

        {/* My Bookings Teaser (Auth-only) Start */}
        {isAuthenticated && userBookings.length > 0 && (
          <section className="py-[80px] bg-[#f7f8fc] lg:py-[60px] md:py-[50px] sm:py-[40px]">
            <Container>
              <Row className="items-center">
                <Col lg={6} md={8}>
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="heading-6 font-serif font-semibold text-darkgray mb-4 -tracking-[1px]">
                      Continue Your Adventure
                    </h3>
                    <p className="text-lg text-darkgray mb-6">
                      You have {userBookings.length} upcoming tour{userBookings.length > 1 ? 's' : ''} with us
                    </p>
                    <div className="space-y-3 mb-6">
                      {userBookings.slice(0, 2).map((booking, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <p className="font-medium text-darkgray">{booking.tour_title}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.start_date).toLocaleDateString()} - {booking.status}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link to="/tours/my-bookings">
                      <Buttons
                        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                        themeColor="#232323"
                        color="#fff"
                        title="View All Bookings"
                        size="sm"
                      />
                    </Link>
                  </div>
                </Col>
                <Col lg={6} md={4} className="text-center md:mt-8">
                  <m.div {...fadeIn}>
                    <img
                      src="https://via.placeholder.com/400x300"
                      alt="Your next adventure awaits"
                      className="w-full rounded-lg"
                    />
                  </m.div>
                </Col>
              </Row>
            </Container>
          </section>
        )}
        {/* My Bookings Teaser (Auth-only) End */}

        {/* Recommended Tours Section Start */}
        {recommendedTours.length > 0 && (
          <section className="py-[130px] bg-white lg:py-[90px] md:py-[75px] sm:py-[50px]">
            <Container>
              <Row className="justify-center">
                <Col lg={6} md={8} sm={10} className="text-center mb-16">
                  <h2 className="heading-4 font-serif font-semibold text-darkgray uppercase mb-[15px] -tracking-[1px]">
                    Recommended For You
                  </h2>
                  <p className="text-lg leading-[28px] text-darkgray w-[85%] mx-auto lg:w-full">
                    Discover amazing tours based on trending destinations and your interests
                  </p>
                </Col>
              </Row>
              <InfoBannerWithBadges
                data={recommendedTours.map(tour => ({
                  img: tour.image || "https://via.placeholder.com/525x431",
                  packageprice: tour.price ? `From ${tour.price} ${tour.currency || "KES"}` : "From KES 25,000",
                  days: tour.duration || (tour.duration_hours ? `${tour.duration_hours} hrs` : "2 Days"),
                  title: tour.title || tour.name || "Kenya Adventure",
                  reviews: tour.reviews_count ? `${tour.reviews_count} Reviews` : "0 Reviews",
                  link: `/tours/${tour.id}`,
                  rating: tour.rating || 4.5,
                  isTopRated: (tour.rating || 4.5) >= 4.7,
                  topRatedBadge: (tour.rating || 4.5) >= 4.7 ? "RECOMMENDED" : null,
                  availability: tour.availability_status || "available",
                  availabilityText: tour.availability_status === "high_demand" ? "High Demand" : 
                                   tour.availability_status === "few_spots" ? "Few Spots Left" :
                                   tour.availability_status === "fully_booked" ? "Fully Booked" : "Available",
                  customButton: (
                    <MultiStepBookingModal
                      tour={tour}
                      triggerButton={
                        <Buttons
                          className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase mt-4"
                          themeColor="#232323"
                          color="#fff"
                          title="Book Now"
                        />
                      }
                    />
                  )
                }))}
                carouselOption={{
                  slidesPerView: 1,
                  spaceBetween: 30,
                  loop: true,
                  autoplay: { delay: 3000, disableOnInteraction: false },
                  breakpoints: {
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 3 }
                  }
                }}
                animation={fadeIn}
                className="swiper-navigation-04 swiper-navigation-light black-move p-0"
              />
            </Container>
          </section>
        )}
        {/* Recommended Tours Section End */}

        {/* Weather Widget Section Start */}
        {weatherData && (
          <section className="py-[80px] bg-[#f7f8fc] lg:py-[60px] md:py-[50px] sm:py-[40px]">
            <Container>
              <Row className="justify-center">
                <Col lg={8}>
                  <m.div {...fadeIn}>
                    <h3 className="heading-5 font-serif font-semibold text-center mb-8">
                      Weather in Popular Destinations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(weatherData).map(([location, weather]) => (
                        <div key={location} className="bg-white p-6 rounded-lg shadow-sm text-center">
                          <h4 className="font-semibold capitalize mb-2">
                            {location.replace('_', ' ')}
                          </h4>
                          <div className="text-3xl font-bold text-neonorange mb-2">
                            {weather.temp}°C
                          </div>
                          <div className="text-gray-600 mb-2">{weather.condition}</div>
                          <div className="text-sm text-gray-500">
                            Humidity: {weather.humidity}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-600">
                        Perfect weather for outdoor adventures! Plan your tour today.
                      </p>
                    </div>
                  </m.div>
                </Col>
              </Row>
            </Container>
          </section>
        )}
        {/* Weather Widget Section End */}

        {/* Section Start */}
        <section
          className="py-[130px] pb-[200px] overflow-hidden cover-background lg:py-[90px] md:py-[75px] md:pb-[150px] sm:py-[50px] xs:h-auto"
          style={{
            backgroundImage: `url(https://via.placeholder.com/1920x600)`,
          }}
        >
          <div className="bg-red-600 top-0 left-0 absolute w-full h-full opacity-50"></div>
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
                    className="bg-red-600 rounded-[6px] flex flex-row items-center py-[40px] px-28 lg:px-20 xs:px-8 md:block"
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
          </Container>
        </section>
        {/* Blog Section End */}
      </div>

        {/* Footer Start */}
        <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
        {/* Footer End */}
        
        {/* WhatsApp Support - Fixed Position */}
        <div className="fixed bottom-6 right-6 z-50">
          <SupportContactButtons />
        </div>
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
