import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import Buttons from '../Button/Buttons'
import CustomModal from '../CustomModal'
import LoginModal from '../Auth/LoginModal'
import PaymentModal from '../Payment/PaymentModal'
import { useCreateRental, useCheckAvailability } from '../../api/useCars'
import { useAuth } from '../../api/useAuth'
import { useCreateRentalPayment } from '../../api/usePayments'
import { fadeIn } from '../../Functions/GlobalAnimations'

const CarBookingModal = ({ 
    modalBtn,
    vehicle,
    initialDates = {},
    className = '' 
}) => {
    const [bookingData, setBookingData] = useState({
        pickup_date: initialDates.pickup_date || '',
        return_date: initialDates.return_date || '',
        pickup_location: vehicle?.location || '',
        return_location: vehicle?.location || '',
        driver_name: '',
        driver_phone: '',
        driver_license: '',
        special_requests: '',
    })
    
    const [currentStep, setCurrentStep] = useState(1) // 1: dates, 2: details, 3: confirmation, 4: payment
    const [isAvailable, setIsAvailable] = useState(true)
    const [totalCost, setTotalCost] = useState(0)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [rentalId, setRentalId] = useState(null)

    const { user, isAuthenticated } = useAuth()
    const createRental = useCreateRental()
    const checkAvailability = useCheckAvailability()
    const createRentalPayment = useCreateRentalPayment()

    React.useEffect(() => {
        if (bookingData.pickup_date && bookingData.return_date && vehicle) {
            const pickup = new Date(bookingData.pickup_date)
            const returnDate = new Date(bookingData.return_date)
            const days = Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24))
            
            if (days > 0) {
                setTotalCost(days * vehicle.daily_rate)
                
                // Check availability
                checkAvailability.mutate({
                    vehicle_id: vehicle.id,
                    start_date: bookingData.pickup_date,
                    end_date: bookingData.return_date
                }, {
                    onSuccess: (data) => {
                        setIsAvailable(data.available)
                    },
                    onError: () => {
                        setIsAvailable(false)
                    }
                })
            }
        }
    }, [bookingData.pickup_date, bookingData.return_date, vehicle, checkAvailability])

    const handleInputChange = (field, value) => {
        setBookingData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleBooking = async () => {
        if (!isAuthenticated) {
            alert('Please log in to make a booking')
            return
        }

        try {
            const rental = await createRental.mutateAsync({
                id: 0, // Create new rental
                vehicle_id: vehicle.id,
                pickup_date: bookingData.pickup_date,
                return_date: bookingData.return_date,
                pickup_location: bookingData.pickup_location,
                return_location: bookingData.return_location,
                total_cost: totalCost,
                status: 'pending_payment',
                notes: bookingData.special_requests,
                driver_details: {
                    name: bookingData.driver_name,
                    phone: bookingData.driver_phone,
                    license: bookingData.driver_license
                }
            })
            
            // Store rental ID and proceed to payment
            setRentalId(rental.id)
            setShowPaymentModal(true)
        } catch (error) {
            console.error('Booking failed:', error)
            alert('Booking failed. Please try again.')
        }
    }

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false)
        alert('Booking and payment completed successfully! We will confirm your booking soon.')
        // Reset form
        setCurrentStep(1)
        setRentalId(null)
        // Close the modal by triggering the CustomModal close
        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price)
    }

    const getDaysDifference = () => {
        if (bookingData.pickup_date && bookingData.return_date) {
            const pickup = new Date(bookingData.pickup_date)
            const returnDate = new Date(bookingData.return_date)
            return Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24))
        }
        return 0
    }

    if (!vehicle) return null

    return (
        <CustomModal.Wrapper
            modalBtn={modalBtn}
            className={className}
            animation="fadeIn"
        >
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl relative">
                <CustomModal.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <i className="feather-x text-xl"></i>
                </CustomModal.Close>

                <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h3 className="font-serif font-semibold text-2xl text-darkgray mb-2">
                            Book {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-[#777]">
                            Complete your rental booking in a few simple steps
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                            currentStep >= step
                                                ? 'bg-[#ca943d] text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div
                                            className={`w-12 h-1 mx-2 ${
                                                currentStep > step ? 'bg-[#ca943d]' : 'bg-gray-200'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <m.div {...fadeIn} key={currentStep}>
                        {/* Step 1: Dates and Location */}
                        {currentStep === 1 && (
                            <div>
                                <h4 className="font-serif font-medium text-lg mb-6">
                                    Rental Details
                                </h4>
                                
                                <Row className="g-4">
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Pickup Date
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={bookingData.pickup_date}
                                                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Return Date
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={bookingData.return_date}
                                                onChange={(e) => handleInputChange('return_date', e.target.value)}
                                                min={bookingData.pickup_date || new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Pickup Location
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={bookingData.pickup_location}
                                                onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                                                placeholder="Enter pickup location"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Return Location
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={bookingData.return_location}
                                                onChange={(e) => handleInputChange('return_location', e.target.value)}
                                                placeholder="Enter return location"
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                {/* Availability Check */}
                                {bookingData.pickup_date && bookingData.return_date && (
                                    <div className={`mt-4 p-4 rounded ${isAvailable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                        <div className="flex items-center">
                                            <i className={`feather-${isAvailable ? 'check-circle' : 'x-circle'} mr-2`}></i>
                                            <span>
                                                {isAvailable 
                                                    ? 'Vehicle is available for selected dates'
                                                    : 'Vehicle is not available for selected dates'
                                                }
                                            </span>
                                        </div>
                                        {isAvailable && getDaysDifference() > 0 && (
                                            <div className="mt-2">
                                                <strong>{getDaysDifference()} days</strong> × {formatPrice(vehicle.daily_rate)} = <strong>{formatPrice(totalCost)}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Driver Details */}
                        {currentStep === 2 && (
                            <div>
                                <h4 className="font-serif font-medium text-lg mb-6">
                                    Driver Information
                                </h4>
                                
                                <Row className="g-4">
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Driver Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={bookingData.driver_name}
                                                onChange={(e) => handleInputChange('driver_name', e.target.value)}
                                                placeholder="Enter driver's full name"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={bookingData.driver_phone}
                                                onChange={(e) => handleInputChange('driver_phone', e.target.value)}
                                                placeholder="Enter phone number"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={12}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Driver's License Number
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={bookingData.driver_license}
                                                onChange={(e) => handleInputChange('driver_license', e.target.value)}
                                                placeholder="Enter driver's license number"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={12}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Special Requests (Optional)
                                            </label>
                                            <textarea
                                                className="form-control rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                rows="3"
                                                value={bookingData.special_requests}
                                                onChange={(e) => handleInputChange('special_requests', e.target.value)}
                                                placeholder="Any special requests or notes"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {currentStep === 3 && (
                            <div>
                                <h4 className="font-serif font-medium text-lg mb-6">
                                    Booking Summary
                                </h4>
                                
                                <div className="bg-gray-50 p-6 rounded">
                                    <Row>
                                        <Col md={6}>
                                            <div className="mb-4">
                                                <h5 className="font-serif font-medium mb-2">Vehicle</h5>
                                                <p className="text-darkgray">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                                                <p className="text-[#777] text-sm">{vehicle.seats} seats • {vehicle.transmission} • {vehicle.fuel_type}</p>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <h5 className="font-serif font-medium mb-2">Rental Period</h5>
                                                <p className="text-darkgray">
                                                    {new Date(bookingData.pickup_date).toLocaleDateString()} - {new Date(bookingData.return_date).toLocaleDateString()}
                                                </p>
                                                <p className="text-[#777] text-sm">{getDaysDifference()} days</p>
                                            </div>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <div className="mb-4">
                                                <h5 className="font-serif font-medium mb-2">Location</h5>
                                                <p className="text-darkgray">Pickup: {bookingData.pickup_location}</p>
                                                <p className="text-darkgray">Return: {bookingData.return_location}</p>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <h5 className="font-serif font-medium mb-2">Driver</h5>
                                                <p className="text-darkgray">{bookingData.driver_name}</p>
                                                <p className="text-[#777] text-sm">{bookingData.driver_phone}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    <hr className="my-4" />
                                    
                                    <div className="text-right">
                                        <div className="text-lg">
                                            <span className="text-[#777]">Total Cost: </span>
                                            <span className="font-serif font-semibold text-[#ca943d] text-xl">
                                                {formatPrice(totalCost)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#777] mt-1">
                                            {formatPrice(vehicle.daily_rate)}/day × {getDaysDifference()} days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </m.div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-8">
                        <div>
                            {currentStep > 1 && (
                                <Buttons
                                    onClick={handlePrevStep}
                                    className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase"
                                    themeColor="#ca943d"
                                    color="#ca943d"
                                    title="Previous"
                                />
                            )}
                        </div>
                        
                        <div className="flex gap-3">
                            <CustomModal.Close>
                                <Buttons
                                    className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase"
                                    themeColor="#777"
                                    color="#777"
                                    title="Cancel"
                                />
                            </CustomModal.Close>
                            
                            {currentStep < 3 ? (
                                <Buttons
                                    onClick={handleNextStep}
                                    disabled={
                                        (currentStep === 1 && (!bookingData.pickup_date || !bookingData.return_date || !isAvailable)) ||
                                        (currentStep === 2 && (!bookingData.driver_name || !bookingData.driver_phone || !bookingData.driver_license))
                                    }
                                    className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                    themeColor="#ca943d"
                                    color="#fff"
                                    title="Next"
                                />
                            ) : (
                                <Buttons
                                    onClick={handleBooking}
                                    disabled={createRental.isLoading || !isAuthenticated}
                                    className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                    themeColor="#ca943d"
                                    color="#fff"
                                    title={createRental.isLoading ? "Booking..." : "Confirm Booking"}
                                />
                            )}
                        </div>
                    </div>

                    {/* Authentication Check */}
                    {!isAuthenticated ? (
                        <div className="text-center mt-6 p-6 bg-gray-50 rounded-lg">
                            <div className="mb-4">
                                <i className="fas fa-lock text-3xl text-gray-400 mb-2"></i>
                                <h4 className="heading-6 font-serif text-darkgray mb-2">
                                    Sign in to Book
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Please sign in to your account to book this vehicle.
                                </p>
                            </div>
                            
                            <LoginModal onSuccess={() => {}} />
                            
                            <div className="mt-3 text-xs text-gray-500">
                                Don't have an account? 
                                <a href="/register" className="text-primary font-medium ml-1">Create one here</a>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                paymentData={{
                    amount: totalCost,
                    currency: 'KES',
                    reference: `rental-${rentalId}`,
                    description: `Car rental: ${vehicle?.make} ${vehicle?.model}`,
                    metadata: {
                        rental_id: rentalId,
                        vehicle_id: vehicle?.id,
                        pickup_date: bookingData.pickup_date,
                        return_date: bookingData.return_date
                    }
                }}
            />
        </CustomModal.Wrapper>
    )
}

export default CarBookingModal
