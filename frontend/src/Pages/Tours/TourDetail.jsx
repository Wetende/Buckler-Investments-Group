import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { m } from 'framer-motion';

// Components
import Header, { HeaderCart, HeaderLanguage, HeaderNav, Menu, SearchBar } from "../../Components/Header/Header";
import { fadeIn, fadeInUp, zoomIn } from "../../Functions/GlobalAnimations";
import HeaderData from "../../Components/Header/HeaderData";
import FooterStyle01 from "../../Components/Footers/FooterStyle01";
import PageTitle from "../../Components/PageTitle/PageTitle";
import ImageGallery from "../../Components/ImageGallery/ImageGallery";
import Buttons from "../../Components/Button/Buttons";
import Lists from "../../Components/Lists/Lists";
import Testimonials from "../../Components/Testimonials/Testimonials";
import InfoBannerWithBadges from "../../Components/InfoBanner/InfoBannerWithBadges";
import CustomModal from "../../Components/CustomModal";
import { Input } from "../../Components/Form/Form";
import MessageBox from "../../Components/MessageBox/MessageBox";
import ToursBookingModal from "../../Components/BookingModal/ToursBookingModal";
import MultiStepBookingModal from "../../Components/BookingModal/MultiStepBookingModal";
import AvailabilityCalendar from "../../Components/AvailabilityCalendar/AvailabilityCalendar";

// API Services
import { getTour, getTourAvailability } from '../../api/toursService';
import { getTourReviews, getTourReviewStats } from '../../api/reviewsService';
import { listBundles } from '../../api/bundleService';
import useAuth from '../../api/useAuth';

// Utilities
import { resetForm, sendEmail } from "../../Functions/Utilities";

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Tour data state
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Related data state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bundleSuggestions, setBundleSuggestions] = useState([]);
  
  // UI state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(null);

  // Load tour data
  useEffect(() => {
    if (!id) return;

    const loadTourData = async () => {
      try {
        setLoading(true);
        
        // Load tour details
        const tourData = await getTour(Number(id));
        setTour(tourData);
        
        // Load parallel data
        const [reviewsData, statsData, availabilityData, bundlesData] = await Promise.allSettled([
          getTourReviews(Number(id), { limit: 6 }),
          getTourReviewStats(Number(id)),
          getTourAvailability(Number(id), {
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }),
          listBundles({ tour_id: Number(id), limit: 4 })
        ]);

        if (reviewsData.status === 'fulfilled') setReviews(reviewsData.value);
        if (statsData.status === 'fulfilled') setReviewStats(statsData.value);
        if (availabilityData.status === 'fulfilled') setAvailability(availabilityData.value);
        if (bundlesData.status === 'fulfilled') setBundleSuggestions(bundlesData.value);
        
      } catch (err) {
        console.error('Failed to load tour:', err);
        setError('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };

    loadTourData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neonorange mb-4"></div>
          <p className="text-lg text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MessageBox
          theme="message-box01"
          variant="error"
          message={error || "Tour not found"}
        />
      </div>
    );
  }

  const galleryImages = tour.images || [
    { img: tour.image || "https://via.placeholder.com/800x600", title: tour.title }
  ];

  const itineraryData = tour.itinerary || [
    { title: "Day 1: Arrival", description: "Check-in and welcome briefing" },
    { title: "Day 2: Main Activities", description: "Full day tour activities" },
    { title: "Day 3: Departure", description: "Check-out and departure" }
  ];

  const inclusionsData = tour.inclusions || [
    "Professional tour guide",
    "Transportation",
    "Entry fees",
    "Lunch"
  ];

  const exclusionsData = tour.exclusions || [
    "Personal expenses",
    "Tips and gratuities",
    "Travel insurance",
    "Alcoholic beverages"
  ];

  return (
    <div className="bg-white">
      {/* Header Start */}
      <Header topSpace={{ desktop: true }} type="reverse-scroll">
        <HeaderNav
          fluid="fluid"
          theme="light"
          expand="lg"
          className="py-[0px] px-[35px] md:px-[15px] md:py-[20px] sm:px-0"
        >
          <Col className="col-auto col-sm-6 col-lg-2 me-auto ps-lg-0">
            <HeaderLanguage className="xs:display-none" />
            <HeaderCart
              style={{ "--base-color": "#0038e3" }}
              className="xs:display-none"
            />
          </Col>
          <Col className="col-auto col-lg-8">
            <SearchBar className="xs:display-none" />
          </Col>
          <Col className="col-auto col-lg-2 text-end pe-lg-0">
            <Menu {...HeaderData} />
          </Col>
        </HeaderNav>
      </Header>
      {/* Header End */}

      {/* Page Title Start */}
      <PageTitle
        title={tour.title}
        subtitle={tour.location}
        breadcrumb={[
          { title: "Home", to: "/" },
          { title: "Tours", to: "/tours" },
          { title: tour.title }
        ]}
      />
      {/* Page Title End */}

      <div className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          {/* Tour Header Info */}
          <Row className="mb-16">
            <Col lg={8}>
              <m.div {...fadeIn}>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {/* Rating */}
                  {reviewStats && (
                    <div className="flex items-center">
                      <div className="flex text-[#ff9c00] mr-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i
                            key={i}
                            className={`${
                              i < Math.floor(reviewStats.average_rating)
                                ? 'fas fa-star'
                                : 'far fa-star'
                            } mr-1`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">
                        {reviewStats.average_rating} ({reviewStats.total_reviews} reviews)
                      </span>
                    </div>
                  )}
                  
                  {/* Duration */}
                  <div className="flex items-center text-gray-600">
                    <i className="far fa-clock mr-2"></i>
                    <span>{tour.duration || '3 days'}</span>
                  </div>
                  
                  {/* Group Size */}
                  <div className="flex items-center text-gray-600">
                    <i className="far fa-user mr-2"></i>
                    <span>Max {tour.max_participants || 12} people</span>
                  </div>
                  
                  {/* Difficulty */}
                  {tour.difficulty && (
                    <div className="flex items-center text-gray-600">
                      <i className="far fa-chart-bar mr-2"></i>
                      <span className="capitalize">{tour.difficulty} level</span>
                    </div>
                  )}
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-darkgray">
                    {tour.currency || 'KES'} {tour.price || '25,000'}
                  </span>
                  <span className="text-lg text-gray-600 ml-2">per person</span>
                </div>
                
                {/* Quick Description */}
                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  {tour.short_description || tour.description?.substring(0, 200) + '...'}
                </p>
              </m.div>
            </Col>
            
            {/* Booking Card */}
            <Col lg={4}>
              <m.div {...fadeInUp} className="bg-[#f7f8fc] p-8 rounded-lg sticky top-4">
                <div className="text-center mb-6">
                  <h4 className="heading-6 font-serif font-semibold mb-4">Book This Tour</h4>
                  
                  {/* Availability Status */}
                  {tour.availability_status && (
                    <div className={`inline-block px-3 py-1 rounded text-sm font-medium mb-4 ${
                      tour.availability_status === 'available' ? 'bg-green-100 text-green-800' :
                      tour.availability_status === 'high_demand' ? 'bg-orange-100 text-orange-800' :
                      tour.availability_status === 'few_spots' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tour.availability_status === 'available' ? 'Available' :
                       tour.availability_status === 'high_demand' ? 'High Demand' :
                       tour.availability_status === 'few_spots' ? 'Few Spots Left' :
                       'Fully Booked'}
                    </div>
                  )}
                </div>
                
                <MultiStepBookingModal
                  tour={tour}
                  triggerButton={
                    <Buttons
                      className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full mb-4"
                      themeColor="#232323"
                      color="#fff"
                      title="Book Now"
                      size="lg"
                    />
                  }
                  onBookingSuccess={(booking) => {
                    console.log('Booking successful:', booking);
                    // Navigate to booking confirmation or success page
                  }}
                />
                
                <div className="text-center text-sm text-gray-600">
                  <p>✓ Free cancellation up to 24 hours</p>
                  <p>✓ Instant confirmation</p>
                  <p>✓ Mobile voucher accepted</p>
                </div>
              </m.div>
            </Col>
          </Row>

          {/* Image Gallery */}
          <Row className="mb-16">
            <Col>
              <m.div {...fadeIn}>
                <ImageGallery
                  data={galleryImages}
                  thumb={true}
                  className="rounded-lg overflow-hidden"
                />
              </m.div>
            </Col>
          </Row>

          {/* Tab Navigation */}
          <Row className="mb-12">
            <Col>
              <div className="flex flex-wrap border-b border-gray-200 mb-8">
                {['overview', 'itinerary', 'inclusions', 'availability', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-neonorange text-neonorange'
                        : 'border-transparent text-gray-600 hover:text-darkgray'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </Col>
          </Row>

          {/* Tab Content */}
          <Row className="mb-16">
            <Col>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <m.div {...fadeIn}>
                  <Row>
                    <Col lg={8}>
                      <h3 className="heading-5 font-serif font-semibold mb-6">About This Tour</h3>
                      <div className="text-lg leading-relaxed text-gray-700 prose max-w-none">
                        {tour.description ? (
                          <div dangerouslySetInnerHTML={{ __html: tour.description }} />
                        ) : (
                          <p>Experience the best of Kenya with this amazing tour package...</p>
                        )}
                      </div>
                      
                      {/* Tour Guide Profile */}
                      {tour.guide && (
                        <div className="bg-[#f7f8fc] p-6 rounded-lg mt-8">
                          <h4 className="heading-6 font-serif font-semibold mb-4">Your Tour Guide</h4>
                          <div className="flex items-center">
                            <img
                              src={tour.guide.avatar || "https://via.placeholder.com/80x80"}
                              alt={tour.guide.name}
                              className="w-16 h-16 rounded-full mr-4"
                            />
                            <div>
                              <h5 className="font-semibold text-lg">{tour.guide.name}</h5>
                              <p className="text-gray-600">{tour.guide.title}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {tour.guide.experience} years experience • {tour.guide.languages} languages
                              </p>
                            </div>
                          </div>
                          <p className="mt-4 text-gray-700">{tour.guide.bio}</p>
                        </div>
                      )}
                    </Col>
                    
                    <Col lg={4}>
                      {/* Quick Facts */}
                      <div className="bg-white border border-gray-200 p-6 rounded-lg">
                        <h4 className="heading-6 font-serif font-semibold mb-4">Quick Facts</h4>
                        <Lists
                          data={[
                            { content: `Duration: ${tour.duration || '3 days'}` },
                            { content: `Max Group: ${tour.max_participants || 12} people` },
                            { content: `Difficulty: ${tour.difficulty || 'Easy'}` },
                            { content: `Languages: ${tour.languages || 'English, Swahili'}` },
                            { content: `Start Time: ${tour.start_time || '8:00 AM'}` },
                            { content: `Meeting Point: ${tour.meeting_point || 'Hotel pickup'}` }
                          ]}
                          theme="list-style-02"
                        />
                      </div>
                    </Col>
                  </Row>
                </m.div>
              )}

              {/* Itinerary Tab */}
              {activeTab === 'itinerary' && (
                <m.div {...fadeIn}>
                  <h3 className="heading-5 font-serif font-semibold mb-8">Tour Itinerary</h3>
                  <div className="space-y-6">
                    {itineraryData.map((day, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 w-12 h-12 bg-neonorange text-white rounded-full flex items-center justify-center font-semibold mr-6">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xl font-semibold mb-2">{day.title}</h4>
                          <p className="text-gray-700 leading-relaxed">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </m.div>
              )}

              {/* Inclusions Tab */}
              {activeTab === 'inclusions' && (
                <m.div {...fadeIn}>
                  <Row>
                    <Col lg={6}>
                      <h3 className="heading-5 font-serif font-semibold mb-6 text-green-700">
                        <i className="fas fa-check-circle mr-2"></i>What's Included
                      </h3>
                      <Lists
                        data={inclusionsData.map(item => ({ content: item }))}
                        theme="list-style-02"
                        className="text-green-700"
                      />
                    </Col>
                    <Col lg={6}>
                      <h3 className="heading-5 font-serif font-semibold mb-6 text-red-700">
                        <i className="fas fa-times-circle mr-2"></i>What's Not Included
                      </h3>
                      <Lists
                        data={exclusionsData.map(item => ({ content: item }))}
                        theme="list-style-02"
                        className="text-red-700"
                      />
                    </Col>
                  </Row>
                </m.div>
              )}

              {/* Availability Tab */}
              {activeTab === 'availability' && (
                <m.div {...fadeIn}>
                  <Row>
                    <Col lg={8}>
                      <h3 className="heading-5 font-serif font-semibold mb-6">Select Your Date</h3>
                      <AvailabilityCalendar
                        tourId={id}
                        availabilityData={availability}
                        onDateSelect={(date, availabilityInfo) => {
                          console.log('Selected date:', date, availabilityInfo);
                          // You can handle date selection here
                        }}
                        className="shadow-lg"
                        animation={fadeIn}
                      />
                    </Col>
                    <Col lg={4}>
                      <div className="bg-[#f7f8fc] p-6 rounded-lg sticky top-4">
                        <h4 className="heading-6 font-serif font-semibold mb-4">Booking Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Tour Duration:</span>
                            <span className="font-medium">{tour.duration || '3 days'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Group Size:</span>
                            <span className="font-medium">Max {tour.max_participants || 12}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price per person:</span>
                            <span className="font-medium">{tour.currency || 'KES'} {tour.price || '25,000'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Meeting Point:</span>
                            <span className="font-medium">{tour.meeting_point || 'Hotel pickup'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t">
                          <p className="text-xs text-gray-600 mb-4">
                            Select a date from the calendar to proceed with booking
                          </p>
                          
                          <MultiStepBookingModal
                            tour={tour}
                            preSelectedDate={selectedDate}
                            triggerButton={
                              <Buttons
                                className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full"
                                themeColor="#232323"
                                color="#fff"
                                title="Book Selected Date"
                              />
                            }
                            onBookingSuccess={(booking) => {
                              console.log('Booking successful:', booking);
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </m.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <m.div {...fadeIn}>
                  <Row>
                    <Col lg={8}>
                      <h3 className="heading-5 font-serif font-semibold mb-6">
                        Customer Reviews ({reviewStats?.total_reviews || 0})
                      </h3>
                      
                      {reviews.length > 0 ? (
                        <Testimonials
                          data={reviews.map(review => ({
                            img: review.user_avatar || "https://via.placeholder.com/80x80",
                            title: review.user_name || "Anonymous",
                            designation: review.user_location || "Traveler",
                            content: review.content || review.comment,
                            stars: review.rating || 5
                          }))}
                          carouselOption={{
                            slidesPerView: 1,
                            spaceBetween: 30,
                            pagination: { clickable: true }
                          }}
                          animation={fadeIn}
                        />
                      ) : (
                        <p className="text-gray-600">No reviews yet. Be the first to review this tour!</p>
                      )}
                    </Col>
                    
                    {reviewStats && (
                      <Col lg={4}>
                        <div className="bg-[#f7f8fc] p-6 rounded-lg">
                          <h4 className="heading-6 font-serif font-semibold mb-4">Overall Rating</h4>
                          <div className="text-center mb-4">
                            <div className="text-4xl font-bold text-neonorange mb-2">
                              {reviewStats.average_rating}
                            </div>
                            <div className="flex justify-center text-[#ff9c00] mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                  key={i}
                                  className={`${
                                    i < Math.floor(reviewStats.average_rating)
                                      ? 'fas fa-star'
                                      : 'far fa-star'
                                  } mr-1`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600">{reviewStats.total_reviews} reviews</p>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </m.div>
              )}
            </Col>
          </Row>

          {/* Bundle Suggestions */}
          {bundleSuggestions.length > 0 && (
            <Row className="mb-16">
              <Col>
                <m.div {...fadeIn}>
                  <h3 className="heading-5 font-serif font-semibold text-center mb-12">
                    Complete Your Experience
                  </h3>
                  <p className="text-center text-lg text-gray-600 mb-12">
                    Add accommodation and transport for a complete package
                  </p>
                  <InfoBannerWithBadges
                    data={bundleSuggestions.map(bundle => ({
                      img: bundle.image || "https://via.placeholder.com/400x300",
                      title: bundle.title,
                      packageprice: `${bundle.currency || 'KES'} ${bundle.price}`,
                      days: `${bundle.duration || 3} Days Package`,
                      link: `/bundles/${bundle.id}`,
                      rating: bundle.rating || 4.5,
                      reviews: `${bundle.reviews_count || 0} reviews`,
                      customButton: (
                        <Buttons
                          ariaLabel="View Bundle"
                          href={`/bundles/${bundle.id}`}
                          className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase mt-4"
                          themeColor="#232323"
                          color="#fff"
                          title="View Package"
                        />
                      )
                    }))}
                    carouselOption={{
                      slidesPerView: 1,
                      spaceBetween: 30,
                      breakpoints: {
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 3 }
                      }
                    }}
                    animation={fadeIn}
                    className="swiper-navigation-04 swiper-navigation-light"
                  />
                </m.div>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}
    </div>
  );
};

export default TourDetailPage;