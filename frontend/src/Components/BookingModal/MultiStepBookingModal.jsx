import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { m, AnimatePresence } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';

// Components
import CustomModal from '../CustomModal';
import { Input } from '../Form/Form';
import Buttons from '../Button/Buttons';
import MessageBox from '../MessageBox/MessageBox';
import AvailabilityCalendar from '../AvailabilityCalendar/AvailabilityCalendar';

// API Services
import { getTourAvailability, createTourBooking } from '../../api/toursService';
import { createPayment } from '../../api/paymentService';

// Animation variants
const slideIn = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { duration: 0.3 }
};

const MultiStepBookingModal = ({ 
  tour, 
  triggerButton, 
  className = "",
  onBookingSuccess,
  preSelectedDate = null 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({});
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(preSelectedDate);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [pricingBreakdown, setPricingBreakdown] = useState(null);

  // Load availability when modal opens
  useEffect(() => {
    if (tour?.id) {
      loadAvailability();
    }
  }, [tour]);

  const loadAvailability = async () => {
    try {
      const data = await getTourAvailability(tour.id, {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      setAvailability(data);
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  };

  // Validation schemas for each step
  const step1Schema = Yup.object().shape({
    booking_date: Yup.string().required('Please select a tour date'),
  });

  const step2Schema = Yup.object().shape({
    participants: Yup.number()
      .required('Number of participants is required')
      .min(1, 'At least 1 participant required')
      .max(tour?.max_participants || 20, `Maximum ${tour?.max_participants || 20} participants allowed`),
    participant_ages: Yup.array().of(
      Yup.number().min(1, 'Age must be at least 1').max(120, 'Invalid age')
    ),
  });

  const step3Schema = Yup.object().shape({
    guest_name: Yup.string().required('Full name is required'),
    guest_email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    guest_phone: Yup.string()
      .matches(/^(\+254|254|0)?[7][0-9]{8}$/, 'Enter valid Kenyan phone number')
      .required('Phone number is required'),
    emergency_contact_name: Yup.string(),
    emergency_contact_phone: Yup.string()
      .matches(/^(\+254|254|0)?[7][0-9]{8}$/, 'Enter valid phone number'),
    special_requests: Yup.string().max(500, 'Special requests must be less than 500 characters'),
  });

  const step4Schema = Yup.object().shape({
    payment_method: Yup.string().required('Please select a payment method'),
    agree_terms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
  });

  // Calculate pricing based on participants
  const calculatePricing = (participants, ages = []) => {
    const basePrice = Number(tour.price || 25000);
    let totalPrice = 0;
    let breakdown = [];

    // Adult vs child pricing
    ages.forEach((age, index) => {
      const isChild = age < 12;
      const isInfant = age < 2;
      const price = isInfant ? 0 : isChild ? basePrice * 0.7 : basePrice;
      
      totalPrice += price;
      breakdown.push({
        participant: index + 1,
        age,
        category: isInfant ? 'Infant' : isChild ? 'Child' : 'Adult',
        price
      });
    });

    // Apply group discounts
    let discount = 0;
    if (participants >= 8) {
      discount = totalPrice * 0.15; // 15% for groups of 8+
    } else if (participants >= 4) {
      discount = totalPrice * 0.1; // 10% for groups of 4+
    }

    const discountedTotal = totalPrice - discount;
    const taxes = discountedTotal * 0.16; // 16% VAT
    const finalTotal = discountedTotal + taxes;

    return {
      breakdown,
      subtotal: totalPrice,
      discount,
      discountedTotal,
      taxes,
      finalTotal,
      currency: tour.currency || 'KES'
    };
  };

  // Handle date selection
  const handleDateSelect = (date, availabilityInfo) => {
    setSelectedDate(date);
    setSelectedAvailability(availabilityInfo);
    setBookingData(prev => ({ ...prev, booking_date: date }));
  };

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle final booking submission
  const handleFinalSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      // Create booking
      const bookingPayload = {
        ...bookingData,
        ...values,
        tour_id: Number(tour.id),
        participants: Number(values.participants),
        total_amount: pricingBreakdown.finalTotal,
        currency: tour.currency || 'KES',
        id: 0 // Create new booking
      };

      const booking = await createTourBooking(bookingPayload);

      // Process payment
      if (values.payment_method === 'mpesa') {
        const paymentPayload = {
          booking_id: booking.id,
          amount: pricingBreakdown.finalTotal,
          phone_number: values.guest_phone,
          payment_method: 'mpesa'
        };
        
        await createPayment(paymentPayload);
      }

      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }

      // Reset form and close modal
      setCurrentStep(1);
      setBookingData({});
      setSelectedDate(null);
      
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      default: return step1Schema;
    }
  };

  const initialValues = {
    booking_date: selectedDate || '',
    participants: 2,
    participant_ages: [25, 30],
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    special_requests: '',
    payment_method: 'mpesa',
    agree_terms: false,
    ...bookingData
  };

  return (
    <CustomModal.Wrapper
      modalBtn={triggerButton}
      className={`booking-modal ${className}`}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-semibold">Book Your Tour</h2>
            <span className="text-lg text-gray-600">Step {currentStep} of 4</span>
          </div>
          
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep ? 'bg-neonorange' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Select Date</span>
            <span>Group Size</span>
            <span>Details</span>
            <span>Payment</span>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={getStepSchema()}
          onSubmit={(values, actions) => {
            if (currentStep === 4) {
              handleFinalSubmit(values);
            } else {
              setBookingData(prev => ({ ...prev, ...values }));
              
              // Calculate pricing when participants change
              if (currentStep === 2) {
                const pricing = calculatePricing(values.participants, values.participant_ages);
                setPricingBreakdown(pricing);
              }
              
              nextStep();
              actions.setSubmitting(false);
            }
          }}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, isValid }) => (
            <Form>
              <AnimatePresence mode="wait">
                {/* Step 1: Date Selection */}
                {currentStep === 1 && (
                  <m.div key="step1" {...slideIn}>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Select Your Tour Date</h3>
                      <Row>
                        <Col lg={8}>
                          <AvailabilityCalendar
                            tourId={tour.id}
                            availabilityData={availability}
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            className="shadow-lg"
                          />
                        </Col>
                        <Col lg={4}>
                          <div className="bg-[#f7f8fc] p-6 rounded-lg">
                            <h4 className="font-semibold mb-4">Tour Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Duration:</span>
                                <span>{tour.duration || '3 days'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Price per person:</span>
                                <span>{tour.currency || 'KES'} {tour.price || '25,000'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Max group size:</span>
                                <span>{tour.max_participants || 12} people</span>
                              </div>
                            </div>
                            
                            {selectedDate && selectedAvailability && (
                              <div className="mt-4 pt-4 border-t">
                                <p className="font-medium text-green-700">
                                  ✓ {selectedDate} - {selectedAvailability.available_spots} spots available
                                </p>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      
                      <Input
                        type="hidden"
                        name="booking_date"
                        value={selectedDate || ''}
                      />
                      
                      {touched.booking_date && errors.booking_date && (
                        <MessageBox
                          theme="message-box01"
                          variant="error"
                          message={errors.booking_date}
                          className="mt-4"
                        />
                      )}
                    </div>
                  </m.div>
                )}

                {/* Step 2: Group Size & Participants */}
                {currentStep === 2 && (
                  <m.div key="step2" {...slideIn}>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Group Details</h3>
                      <Row>
                        <Col lg={6}>
                          <div className="mb-6">
                            <Input
                              type="number"
                              name="participants"
                              label="Number of Participants"
                              min={1}
                              max={tour?.max_participants || 20}
                              onChange={(e) => {
                                const count = Number(e.target.value);
                                setFieldValue('participants', count);
                                
                                // Update participant ages array
                                const newAges = Array.from({ length: count }, (_, i) => 
                                  values.participant_ages[i] || 25
                                );
                                setFieldValue('participant_ages', newAges);
                              }}
                            />
                          </div>

                          {/* Participant Ages */}
                          <div className="space-y-3">
                            <h4 className="font-medium">Participant Ages</h4>
                            {Array.from({ length: values.participants || 2 }).map((_, index) => (
                              <Input
                                key={index}
                                type="number"
                                name={`participant_ages.${index}`}
                                label={`Participant ${index + 1} Age`}
                                min={1}
                                max={120}
                                placeholder="25"
                              />
                            ))}
                          </div>
                        </Col>
                        
                        <Col lg={6}>
                          {/* Pricing Breakdown */}
                          {values.participants && (
                            <div className="bg-[#f7f8fc] p-6 rounded-lg">
                              <h4 className="font-semibold mb-4">Pricing Breakdown</h4>
                              {calculatePricing(values.participants, values.participant_ages).breakdown.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm mb-2">
                                  <span>{item.category} (Age {item.age})</span>
                                  <span>{tour.currency || 'KES'} {item.price.toLocaleString()}</span>
                                </div>
                              ))}
                              
                              {(() => {
                                const pricing = calculatePricing(values.participants, values.participant_ages);
                                return (
                                  <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between mb-2">
                                      <span>Subtotal:</span>
                                      <span>{pricing.currency} {pricing.subtotal.toLocaleString()}</span>
                                    </div>
                                    {pricing.discount > 0 && (
                                      <div className="flex justify-between mb-2 text-green-600">
                                        <span>Group Discount:</span>
                                        <span>-{pricing.currency} {pricing.discount.toLocaleString()}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between mb-2">
                                      <span>VAT (16%):</span>
                                      <span>{pricing.currency} {pricing.taxes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                      <span>Total:</span>
                                      <span>{pricing.currency} {pricing.finalTotal.toLocaleString()}</span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </m.div>
                )}

                {/* Step 3: Contact Details */}
                {currentStep === 3 && (
                  <m.div key="step3" {...slideIn}>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                      <Row>
                        <Col lg={6}>
                          <div className="space-y-4">
                            <Input
                              type="text"
                              name="guest_name"
                              label="Full Name"
                              placeholder="John Doe"
                            />
                            
                            <Input
                              type="email"
                              name="guest_email"
                              label="Email Address"
                              placeholder="john@example.com"
                            />
                            
                            <Input
                              type="tel"
                              name="guest_phone"
                              label="Phone Number"
                              placeholder="+254712345678"
                            />
                          </div>
                        </Col>
                        
                        <Col lg={6}>
                          <div className="space-y-4">
                            <Input
                              type="text"
                              name="emergency_contact_name"
                              label="Emergency Contact Name (Optional)"
                              placeholder="Jane Doe"
                            />
                            
                            <Input
                              type="tel"
                              name="emergency_contact_phone"
                              label="Emergency Contact Phone (Optional)"
                              placeholder="+254787654321"
                            />
                            
                            <Input
                              as="textarea"
                              rows={4}
                              name="special_requests"
                              label="Special Requests (Optional)"
                              placeholder="Dietary restrictions, accessibility needs, etc."
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </m.div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <m.div key="step4" {...slideIn}>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Payment & Confirmation</h3>
                      <Row>
                        <Col lg={6}>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Payment Method</label>
                              <div className="space-y-2">
                                {['mpesa', 'card', 'bank'].map((method) => (
                                  <label key={method} className="flex items-center">
                                    <input
                                      type="radio"
                                      name="payment_method"
                                      value={method}
                                      checked={values.payment_method === method}
                                      onChange={(e) => setFieldValue('payment_method', e.target.value)}
                                      className="mr-2"
                                    />
                                    <span className="capitalize">
                                      {method === 'mpesa' ? 'M-Pesa' : 
                                       method === 'card' ? 'Credit/Debit Card' : 
                                       'Bank Transfer'}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                name="agree_terms"
                                checked={values.agree_terms}
                                onChange={(e) => setFieldValue('agree_terms', e.target.checked)}
                                className="mr-2 mt-1"
                              />
                              <label className="text-sm">
                                I agree to the <a href="/terms" className="text-neonorange underline">terms and conditions</a> and <a href="/privacy" className="text-neonorange underline">privacy policy</a>
                              </label>
                            </div>
                            
                            {touched.agree_terms && errors.agree_terms && (
                              <p className="text-red-500 text-sm">{errors.agree_terms}</p>
                            )}
                          </div>
                        </Col>
                        
                        <Col lg={6}>
                          {/* Final Summary */}
                          <div className="bg-[#f7f8fc] p-6 rounded-lg">
                            <h4 className="font-semibold mb-4">Booking Summary</h4>
                            <div className="space-y-2 text-sm mb-4">
                              <div className="flex justify-between">
                                <span>Tour:</span>
                                <span className="font-medium">{tour.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Date:</span>
                                <span>{selectedDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Participants:</span>
                                <span>{values.participants}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Contact:</span>
                                <span>{values.guest_name}</span>
                              </div>
                            </div>
                            
                            {pricingBreakdown && (
                              <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total Amount:</span>
                                  <span>{pricingBreakdown.currency} {pricingBreakdown.finalTotal.toLocaleString()}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {currentStep > 1 ? (
                  <Buttons
                    type="button"
                    onClick={prevStep}
                    className="btn-fancy btn-outline"
                    title="Previous"
                  />
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <Buttons
                    type="submit"
                    className="btn-fancy btn-fill"
                    themeColor="#232323"
                    color="#fff"
                    title="Next"
                    disabled={!isValid || (currentStep === 1 && !selectedDate)}
                  />
                ) : (
                  <Buttons
                    type="submit"
                    className="btn-fancy btn-fill"
                    themeColor="#232323"
                    color="#fff"
                    title={isSubmitting ? "Processing..." : "Complete Booking"}
                    disabled={isSubmitting || !isValid}
                  />
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </CustomModal.Wrapper>
  );
};

export default MultiStepBookingModal;
