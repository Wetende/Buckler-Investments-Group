import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { m, AnimatePresence } from 'framer-motion';
import CustomModal from '../CustomModal';
import { Input } from '../Form/Form';
import Buttons from '../Button/Buttons';
import MessageBox from '../MessageBox/MessageBox';

const ToursBookingModal = ({ 
  tour, 
  triggerButton, 
  className = "",
  onBookingSuccess 
}) => {
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingSchema = Yup.object().shape({
    booking_date: Yup.date()
      .required('Tour date is required')
      .min(new Date(), 'Tour date must be in the future'),
    participants: Yup.number()
      .required('Number of participants is required')
      .min(1, 'At least 1 participant required')
      .max(tour?.max_participants || 20, `Maximum ${tour?.max_participants || 20} participants allowed`),
    guest_email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    guest_phone: Yup.string()
      .matches(/^(\+254|254|0)?[7][0-9]{8}$/, 'Enter valid Kenyan phone number'),
    special_requests: Yup.string()
      .max(500, 'Special requests must be less than 500 characters'),
  });

  const handleBookingSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      
      // Mock booking creation - replace with actual API call
      const bookingData = {
        tour_id: Number(tour.id),
        booking_date: values.booking_date,
        participants: Number(values.participants),
        guest_email: values.guest_email,
        guest_phone: values.guest_phone || undefined,
        special_requests: values.special_requests || undefined,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        id: Math.floor(Math.random() * 10000),
        total_amount: (tour?.price || 25000) * values.participants,
        currency: tour?.currency || 'KES',
      };
      
      setBookingSuccess(mockResult);
      resetForm();
      
      if (onBookingSuccess) {
        onBookingSuccess(mockResult);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Contact for price';
    return `KES ${Number(price).toLocaleString('en-KE')}`;
  };

  return (
    <CustomModal.Wrapper
      className={className}
      modalBtn={triggerButton}
    >
      <div className="w-[600px] max-w-[90vw] bg-white rounded-lg p-8">
        {bookingSuccess ? (
          // Success State
          <div className="text-center">
            <div className="mb-6">
              <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
              <h3 className="heading-6 font-serif text-darkgray mb-4">
                Tour Booking Confirmed!
              </h3>
              <p className="text-lg mb-4">
                Your tour booking has been successfully created.
              </p>
              <div className="bg-lightgray p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
                <div className="font-bold text-lg">#{bookingSuccess.id}</div>
                <div className="text-sm text-gray-600 mt-2">
                  Total: {formatPrice(bookingSuccess.total_amount)}
                </div>
              </div>
            </div>
            <Buttons
              onClick={() => setBookingSuccess(null)}
              className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase mr-4"
              themeColor="#232323"
              color="#fff"
              title="Book Another Tour"
            />
            <Buttons
              href="/account/bookings"
              className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
              themeColor="#232323"
              color="#232323"
              title="View Bookings"
            />
          </div>
        ) : (
          // Booking Form
          <>
            <div className="mb-6">
              <h3 className="heading-6 font-serif text-darkgray mb-2">
                Book Your Tour
              </h3>
              <div className="text-sm text-gray-600">
                {tour?.title || tour?.name} • {formatPrice(tour?.price)}/person
              </div>
              {tour?.duration && (
                <div className="text-sm text-gray-500">
                  Duration: {tour.duration}
                </div>
              )}
            </div>

            <Formik
              initialValues={{
                booking_date: '',
                participants: 1,
                guest_email: '',
                guest_phone: '',
                special_requests: '',
              }}
              validationSchema={bookingSchema}
              onSubmit={handleBookingSubmit}
            >
              {({ values }) => {
                const totalAmount = values.participants > 0 && tour?.price 
                  ? values.participants * tour.price 
                  : 0;

                return (
                  <Form className="space-y-4">
                    {/* Tour Date */}
                    <Input
                      name="booking_date"
                      type="date"
                      label="Tour Date"
                      labelClass="!mb-[5px] font-medium"
                    />

                    {/* Participants */}
                    <Input
                      name="participants"
                      type="number"
                      label="Number of Participants"
                      min="1"
                      max={tour?.max_participants || 20}
                      labelClass="!mb-[5px] font-medium"
                    />

                    {/* Contact Info */}
                    <Input
                      name="guest_email"
                      type="email"
                      label="Email Address"
                      placeholder="your@email.com"
                      labelClass="!mb-[5px] font-medium"
                    />

                    <Input
                      name="guest_phone"
                      type="tel"
                      label="Phone Number (Optional)"
                      placeholder="+254 700 000 000"
                      labelClass="!mb-[5px] font-medium"
                    />

                    {/* Special Requests */}
                    <div>
                      <label className="block font-medium mb-[5px]">Special Requests (Optional)</label>
                      <textarea
                        name="special_requests"
                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                        rows="3"
                        placeholder="Dietary requirements, accessibility needs, etc..."
                      />
                    </div>

                    {/* Price Summary */}
                    {values.participants > 0 && tour?.price && (
                      <div className="bg-lightgray p-4 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span>{formatPrice(tour.price)} × {values.participants} participants</span>
                          <span>{formatPrice(totalAmount)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatPrice(totalAmount)}</span>
                        </div>
                      </div>
                    )}

                    {/* Tour Info */}
                    <div className="bg-blue-50 p-4 rounded-lg text-sm">
                      <div className="font-medium mb-2">Tour Information:</div>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Meeting point details will be sent via email</li>
                        <li>• Bring comfortable walking shoes and sun protection</li>
                        <li>• Tour operates in all weather conditions</li>
                        <li>• Cancellation policy: 24 hours notice required</li>
                      </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <Buttons
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase flex-1"
                        themeColor="#232323"
                        color="#fff"
                        title={isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}
      </div>
    </CustomModal.Wrapper>
  );
};

export default ToursBookingModal;

