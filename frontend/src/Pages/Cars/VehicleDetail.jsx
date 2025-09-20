import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'

// Components
import Header, { HeaderNav, Menu } from '../../Components/Header/Header'
import BucklerMenuData from '../../Components/Header/BucklerMenuData'
import Buttons from '../../Components/Button/Buttons'
import FooterStyle01 from '../../Components/Footers/FooterStyle01'
import CarBookingModal from '../../Components/BookingModal/CarBookingModal'
import PageTitle from '../../Components/PageTitle/PageTitle'
import VehicleReviews from '../../Components/Reviews/VehicleReviews'

// API Hooks
import { useVehicle, useVehicleReviews, useFeaturedVehicles } from '../../api/useCars'
import { useToggleFavorite } from '../../api/useFavorites'

// Animations
import { fadeIn, fadeInUp } from '../../Functions/GlobalAnimations'

const VehicleDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    // Fetch vehicle data
    const { data: vehicle, isLoading, error } = useVehicle(id)
    const { data: reviews = [] } = useVehicleReviews(id)
    const { data: relatedVehicles = [] } = useFeaturedVehicles(3)
    const toggleFavorite = useToggleFavorite()

    const handleFavorite = async () => {
        try {
            await toggleFavorite.mutateAsync({
                item_type: 'vehicle',
                item_id: parseInt(id),
                action: vehicle?.is_favorite ? 'remove' : 'add'
            })
        } catch (error) {
            console.error('Failed to toggle favorite:', error)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price)
    }

    const getAverageRating = () => {
        if (reviews.length === 0) return 0
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
        return (sum / reviews.length).toFixed(1)
    }

    if (isLoading) {
        return (
            <div>
                <Header topSpace={{ md: true }} type="header-always-fixed">
                    <HeaderNav fluid="fluid" theme="dark" bg="dark" expand="lg" className="px-[35px] py-[0px] md:pr-[15px] sm:pr-0 md:pl-0 md:py-[20px] bg-[#23262d]">
                        {/* Header content */}
                    </HeaderNav>
                </Header>
                
                <PageTitle
                    title="Loading Vehicle..."
                    breadcrumb={[
                        { title: "Home", to: "/" },
                        { title: "Car Hire", to: "/cars" },
                        { title: "Loading..." }
                    ]}
                />
                
                <section className="py-[130px]">
                    <Container>
                        <div className="text-center">
                            <div className="spinner-border text-[#ca943d]" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-4 text-[#777]">Loading vehicle details...</p>
                        </div>
                    </Container>
                </section>
            </div>
        )
    }

    if (error || !vehicle) {
        return (
            <div>
                <Header topSpace={{ md: true }} type="header-always-fixed">
                    <HeaderNav fluid="fluid" theme="dark" bg="dark" expand="lg" className="px-[35px] py-[0px] md:pr-[15px] sm:pr-0 md:pl-0 md:py-[20px] bg-[#23262d]">
                        {/* Header content */}
                    </HeaderNav>
                </Header>
                
                <PageTitle
                    title="Vehicle Not Found"
                    breadcrumb={[
                        { title: "Home", to: "/" },
                        { title: "Car Hire", to: "/cars" },
                        { title: "Not Found" }
                    ]}
                />
                
                <section className="py-[130px]">
                    <Container>
                        <div className="text-center">
                            <i className="feather-search text-[#ca943d] text-[60px] mb-6"></i>
                            <h3 className="font-serif font-semibold text-darkgray mb-4">
                                Vehicle Not Found
                            </h3>
                            <p className="text-[#777] mb-6">
                                The vehicle you're looking for doesn't exist or has been removed.
                            </p>
                            <Buttons
                                onClick={() => navigate('/cars')}
                                className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#ca943d"
                                color="#fff"
                                title="Browse All Vehicles"
                            />
                        </div>
                    </Container>
                </section>
            </div>
        )
    }

    const images = vehicle.images && vehicle.images.length > 0 
        ? vehicle.images 
        : ['https://via.placeholder.com/800x600?text=No+Image']

    return (
        <div>
            {/* Header */}
            <Header topSpace={{ md: true }} type="header-always-fixed">
                <HeaderNav fluid="fluid" theme="dark" bg="dark" expand="lg" className="px-[35px] py-[0px] md:pr-[15px] sm:pr-0 md:pl-0 md:py-[20px] bg-[#23262d]">
                    <Col lg={2} sm={6} className="col-auto me-auto ps-lg-0 sm:!pl-0">
                        <span className="default-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">
                            Buckler Investment Group
                        </span>
                    </Col>
                    <Menu data={BucklerMenuData} />
                </HeaderNav>
            </Header>

            {/* Page Title */}
            <PageTitle
                title={`${vehicle.make} ${vehicle.model}`}
                breadcrumb={[
                    { title: "Home", to: "/" },
                    { title: "Car Hire", to: "/cars" },
                    { title: `${vehicle.make} ${vehicle.model}` }
                ]}
            />

            {/* Vehicle Details Section */}
            <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
                <Container>
                    <Row>
                        {/* Vehicle Images */}
                        <Col lg={8} className="mb-[50px] lg:mb-0">
                            <m.div {...fadeIn}>
                                {/* Main Image */}
                                <div className="main-image mb-4">
                                    <img
                                        src={images[selectedImageIndex]}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="w-full h-[500px] object-cover rounded-[6px]"
                                    />
                                </div>

                                {/* Thumbnail Images */}
                                {images.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto">
                                        {images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                                                className={`w-20 h-20 object-cover rounded cursor-pointer transition-opacity ${
                                                    selectedImageIndex === index ? 'opacity-100 ring-2 ring-[#ca943d]' : 'opacity-70 hover:opacity-100'
                                                }`}
                                                onClick={() => setSelectedImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </m.div>
                        </Col>

                        {/* Vehicle Info */}
                        <Col lg={4}>
                            <m.div {...fadeInUp}>
                                <div className="sticky top-[120px]">
                                    {/* Vehicle Header */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h1 className="font-serif font-semibold text-2xl text-darkgray mb-2">
                                                    {vehicle.make} {vehicle.model}
                                                </h1>
                                                <p className="text-[#777] capitalize">{vehicle.year} • {vehicle.category}</p>
                                            </div>
                                            <button
                                                onClick={handleFavorite}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                                    vehicle.is_favorite 
                                                        ? 'bg-red-500 text-white' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                                                }`}
                                            >
                                                <i className={`${vehicle.is_favorite ? 'fas' : 'far'} fa-heart`}></i>
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="price-section mb-4">
                                            <div className="text-3xl font-serif font-semibold text-[#ca943d] mb-1">
                                                {formatPrice(vehicle.daily_rate)}
                                                <span className="text-lg text-[#777] font-normal"> /day</span>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="status-section mb-6">
                                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                                                vehicle.status === 'available' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {vehicle.status === 'available' ? 'Available' : 'Not Available'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Vehicle Specs */}
                                    <div className="specs-section mb-6">
                                        <h3 className="font-serif font-medium text-lg mb-4">Vehicle Specifications</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="spec-item">
                                                <div className="flex items-center gap-2 text-[#777]">
                                                    <i className="feather-users text-[#ca943d]"></i>
                                                    <span>{vehicle.seats} Seats</span>
                                                </div>
                                            </div>
                                            <div className="spec-item">
                                                <div className="flex items-center gap-2 text-[#777]">
                                                    <i className="feather-settings text-[#ca943d]"></i>
                                                    <span>{vehicle.transmission}</span>
                                                </div>
                                            </div>
                                            <div className="spec-item">
                                                <div className="flex items-center gap-2 text-[#777]">
                                                    <i className="feather-zap text-[#ca943d]"></i>
                                                    <span>{vehicle.fuel_type}</span>
                                                </div>
                                            </div>
                                            <div className="spec-item">
                                                <div className="flex items-center gap-2 text-[#777]">
                                                    <i className="feather-map-pin text-[#ca943d]"></i>
                                                    <span>{vehicle.location || 'Nairobi'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    {vehicle.features && vehicle.features.length > 0 && (
                                        <div className="features-section mb-6">
                                            <h3 className="font-serif font-medium text-lg mb-4">Features</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {vehicle.features.map((feature, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reviews Summary */}
                                    {reviews.length > 0 && (
                                        <div className="reviews-summary mb-6">
                                            <h3 className="font-serif font-medium text-lg mb-2">Customer Reviews</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i 
                                                            key={i}
                                                            className={`fas fa-star text-sm ${
                                                                i < Math.floor(getAverageRating()) 
                                                                    ? 'text-yellow-400' 
                                                                    : 'text-gray-300'
                                                            }`}
                                                        ></i>
                                                    ))}
                                                </div>
                                                <span className="text-[#777]">
                                                    {getAverageRating()} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="action-buttons">
                                        <Buttons
                                            onClick={() => setShowBookingModal(true)}
                                            disabled={vehicle.status !== 'available'}
                                            className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase w-full mb-3"
                                            themeColor="#ca943d"
                                            color="#fff"
                                            size="lg"
                                            title={vehicle.status === 'available' ? 'Book Now' : 'Not Available'}
                                        />
                                        
                                        <Buttons
                                            onClick={() => navigate('/cars')}
                                            className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase w-full"
                                            themeColor="#ca943d"
                                            color="#ca943d"
                                            size="lg"
                                            title="Browse More Vehicles"
                                        />
                                    </div>
                                </div>
                            </m.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Description Section */}
            {vehicle.description && (
                <section className="py-[80px] bg-[#f8f9fa]">
                    <Container>
                        <Row className="justify-center">
                            <Col lg={8}>
                                <m.div {...fadeIn}>
                                    <h2 className="font-serif font-semibold text-2xl text-darkgray mb-6 text-center">
                                        About This Vehicle
                                    </h2>
                                    <div className="text-[#777] leading-relaxed text-center">
                                        <p>{vehicle.description}</p>
                                    </div>
                                </m.div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            )}

            {/* Reviews Section */}
            <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
                <Container>
                    <VehicleReviews vehicleId={id} />
                </Container>
            </section>

            {/* Related Vehicles */}
            {relatedVehicles.length > 0 && (
                <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
                    <Container>
                        <Row className="justify-center">
                            <Col lg={6} className="text-center mb-[60px]">
                                <h2 className="font-serif font-semibold text-2xl text-darkgray mb-4">
                                    You Might Also Like
                                </h2>
                                <p className="text-[#777]">
                                    Explore other vehicles in our fleet
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            {relatedVehicles.slice(0, 3).map((relatedVehicle, index) => (
                                <Col key={relatedVehicle.id} lg={4} md={6} className="mb-[30px]">
                                    <m.div
                                        {...fadeInUp}
                                        transition={{ delay: index * 0.1 }}
                                        className="vehicle-card bg-white rounded-[6px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <div className="relative">
                                            <img
                                                src={relatedVehicle.images?.[0] || 'https://via.placeholder.com/400x300'}
                                                alt={`${relatedVehicle.make} ${relatedVehicle.model}`}
                                                className="w-full h-[200px] object-cover"
                                            />
                                            <div className="absolute top-3 right-3 bg-[#ca943d] text-white px-2 py-1 rounded">
                                                {formatPrice(relatedVehicle.daily_rate)}/day
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-serif font-medium text-lg mb-2">
                                                {relatedVehicle.make} {relatedVehicle.model}
                                            </h3>
                                            <p className="text-[#777] text-sm mb-4">
                                                {relatedVehicle.seats} seats • {relatedVehicle.transmission} • {relatedVehicle.fuel_type}
                                            </p>
                                            <Buttons
                                                onClick={() => navigate(`/cars/${relatedVehicle.id}`)}
                                                className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase w-full"
                                                themeColor="#ca943d"
                                                color="#ca943d"
                                                size="sm"
                                                title="View Details"
                                            />
                                        </div>
                                    </m.div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>
            )}

            {/* Booking Modal */}
            <CarBookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                vehicle={vehicle}
            />

            {/* Footer */}
            <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
        </div>
    )
}

export default VehicleDetail
