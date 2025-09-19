import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { m, AnimatePresence } from 'framer-motion';
import CustomModal from '../CustomModal';
import { Input } from '../Form/Form';
import Buttons from '../Button/Buttons';
import MessageBox from '../MessageBox/MessageBox';
import { useCreateBooking, useAvailability } from '../../api/useBnb';
import { AuthContext } from '../Auth/AuthProvider';
import BookingAuthFlow from '../Auth/BookingAuthFlow';

// Child component to handle availability hooks at top-level of a component
const AvailabilityStatus = ({ listingId, checkIn, checkOut, guests, onChange }) => {
  const availabilityParams = useMemo(() => ({
    check_in: checkIn,
    check_out: checkOut,
    guests,
  }), [checkIn, checkOut, guests]);

  const { data: availability, isLoading: checkingAvailability } = useAvailability(
    listingId,
    availabilityParams
  );

  useEffect(() => {
    onChange?.({ availability, checkingAvailability });
  }, [availability, checkingAvailability, onChange]);

  if (!checkIn || !checkOut) return null;

  return (
    <div className="mb-4">
      {checkingAvailability ? (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-blue-800">Checking availability...</span>
          </div>
        </div>
      ) : availability?.available === false ? (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
          <div className="flex items-center">
            <i className="feather-x-circle text-red-600 mr-2"></i>
            <span className="text-sm text-red-800">
              These dates are not available. Please select different dates.
            </span>
          </div>
        </div>
      ) : availability?.available === true ? (
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
          <div className="flex items-center">
            <i className="feather-check-circle text-green-600 mr-2"></i>
            <span className="text-sm text-green-800">
              Great! These dates are available.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const BnbBookingModal = ({ 
  listing, 
  triggerButton, 
  className = "" 
}) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const createBooking = useCreateBooking();
  const [availabilityData, setAvailabilityData] = useState({ availability: null, checkingAvailability: false });

  const bookingSchema = Yup.object().shape({
    check_in: Yup.date()
      .required('Check-in date is required')
      .min(new Date(), 'Check-in date must be in the future')
      .test('min-advance', 'Check-in must be at least 1 day in advance', function(value) {
        if (!value) return false;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return value >= tomorrow;
      }),
    check_out: Yup.date()
      .required('Check-out date is required')
      .min(Yup.ref('check_in'), 'Check-out must be after check-in')
      .test('min-nights', `Minimum ${listing?.min_nights || 1} night(s) required`, function(value) {
        const { check_in } = this.parent;
        if (!value || !check_in) return false;
        const nights = Math.ceil((new Date(value) - new Date(check_in)) / (1000 * 60 * 60 * 24));
        return nights >= (listing?.min_nights || 1);
      }),
    guests: Yup.number()
      .required('Number of guests is required')
      .min(1, 'At least 1 guest required')
      .max(listing?.capacity || 10, `Maximum ${listing?.capacity || 10} guests allowed`),
    guest_email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    guest_phone: Yup.string()
      .matches(/^(\+254|254|0)?[7][0-9]{8}$/, 'Enter valid Kenyan phone number (e.g., 0700000000)')
      .notRequired(),
    special_requests: Yup.string()
      .max(500, 'Special requests must be less than 500 characters')
      .notRequired(),
  });

  const handleBookingSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      
      const bookingData = {
        listing_id: Number(listing.id),
        check_in: values.check_in,
        check_out: values.check_out,
        guests: Number(values.guests),
        guest_email: values.guest_email,
        guest_phone: values.guest_phone || undefined,
        special_requests: values.special_requests || undefined,
      };

      const result = await createBooking.mutateAsync(bookingData);
      
      setBookingSuccess({
        booking_id: result.id,
        total_amount: result.total_amount,
        currency: result.currency || 'KES',
      });
      
      resetForm();
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setSubmitting(false);
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
      <div className="w-[600px] max-w-[95vw] bg-white rounded-lg p-8 sm:p-6 xs:p-4 max-h-[90vh] overflow-y-auto">
        {bookingSuccess ? (
          // Success State
          <div className="text-center">
            <div className="mb-6">
              <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
              <h3 className="heading-6 font-serif text-darkgray mb-4">
                Booking Confirmed!
              </h3>
              <p className="text-lg mb-4">
                Your booking has been successfully created.
              </p>
              <div className="bg-lightgray p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
                <div className="font-bold text-lg">#{bookingSuccess.booking_id}</div>
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
              title="Book Another"
            />
            <Buttons
              href="/account/bookings"
              className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
              themeColor="#232323"
              color="#232323"
              title="View Bookings"
            />
          </div>
        ) : !isAuthenticated ? (
          // Authentication Required - Inline auth flow
          <div>
            <div className="text-center mb-6">
              <i className="fas fa-lock text-5xl text-gray-400 mb-4"></i>
              <h3 className="heading-6 font-serif text-darkgray mb-2">
                Sign in to Book
              </h3>
              <p className="text-base mb-4 text-gray-600">
                Please sign in to your account to book this stay.
              </p>
            </div>

            <BookingAuthFlow 
              onSuccess={() => {
                // User is now authenticated, booking form will show
                setShowBookingForm(true);
              }}
            />

            <div className="mt-4 text-center text-sm text-gray-500">
              Secure booking with your account credentials
            </div>
          </div>
        ) : (
          // Booking Form (Authenticated Users)
          <>
            <div className="mb-6">
              <h3 className="heading-6 font-serif text-darkgray mb-2">
                Book Your Stay
              </h3>
              <div className="text-sm text-gray-600">
                {listing?.title} • {formatPrice(listing?.nightly_price)}/night
              </div>
            </div>

            <Formik
              initialValues={{
                check_in: '',
                check_out: '',
                guests: 1,
                guest_email: '',
                guest_phone: '',
                special_requests: '',
              }}
              validationSchema={bookingSchema}
              onSubmit={handleBookingSubmit}
            >
              {({ isSubmitting, values, errors, touched, isValid }) => {
                const nights = values.check_in && values.check_out 
                  ? Math.ceil((new Date(values.check_out) - new Date(values.check_in)) / (1000 * 60 * 60 * 24))
                  : 0;
                const totalAmount = nights > 0 && listing?.nightly_price 
                  ? nights * listing.nightly_price 
                  : 0;
                const isUnavailable = availabilityData.availability?.available === false;
                const checkingAvailability = availabilityData.checkingAvailability;

                return (
                  <Form className="space-y-4">
                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        name="check_in"
                        type="date"
                        label="Check-in"
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                        labelClass="!mb-[5px] font-medium"
                      />
                      <Input
                        name="check_out"
                        type="date"
                        label="Check-out"
                        min={values.check_in ? new Date(new Date(values.check_in).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 172800000).toISOString().split('T')[0]} // Day after check-in or day after tomorrow
                        labelClass="!mb-[5px] font-medium"
                      />
                    </div>

                    {/* Guests */}
                    <Input
                      name="guests"
                      type="number"
                      label="Number of Guests"
                      min="1"
                      max={listing?.capacity || 10}
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
                    <Input
                      name="special_requests"
                      type="textarea"
                      label="Special Requests (Optional)"
                      rows="3"
                      placeholder="Any special requirements or requests..."
                      labelClass="!mb-[5px] font-medium"
                    />

                    {/* Booking Info */}
                    {/* Availability Status */}
                    <AvailabilityStatus
                      listingId={listing?.id}
                      checkIn={values.check_in}
                      checkOut={values.check_out}
                      guests={values.guests}
                      onChange={setAvailabilityData}
                    />

                    {values.check_in && values.check_out && (
                      <div className="bg-lightgray p-4 rounded-lg">
                        {nights > 0 ? (
                          <>
                            <div className="flex justify-between text-sm mb-2">
                              <span>{formatPrice(listing?.nightly_price)} × {nights} night{nights !== 1 ? 's' : ''}</span>
                              <span>{formatPrice(totalAmount)}</span>
                            </div>
                            {listing?.min_nights && nights < listing.min_nights && (
                              <div className="text-sm text-red-600 mb-2">
                                ⚠️ Minimum {listing.min_nights} night{listing.min_nights !== 1 ? 's' : ''} required
                              </div>
                            )}
                            <div className="flex justify-between text-sm mb-2 text-gray-600">
                              <span>Service fee</span>
                              <span>Included</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total</span>
                              <span>{formatPrice(totalAmount)}</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-600">
                            Select dates to see pricing
                          </div>
                        )}
                      </div>
                    )}

                    {/* Error Display */}
                    <AnimatePresence>
                      {createBooking.isError && (
                        <m.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <MessageBox
                            theme="message-box01"
                            variant="error"
                            message={createBooking.error?.response?.data?.detail || 'Booking failed. Please try again.'}
                          />
                        </m.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <Buttons
                        type="submit"
                        disabled={isSubmitting || createBooking.isLoading || !isValid || (listing?.min_nights && nights < listing.min_nights) || isUnavailable || checkingAvailability}
                        className={`btn-fancy btn-fill font-medium font-serif rounded-none uppercase flex-1 ${
                          isSubmitting || createBooking.isLoading || !isValid || (listing?.min_nights && nights < listing.min_nights) || isUnavailable || checkingAvailability
                            ? 'opacity-50 cursor-not-allowed' 
                            : ''
                        }`}
                        themeColor="#232323"
                        color="#fff"
                        title={
                          isSubmitting || createBooking.isLoading 
                            ? 'Creating Booking...' 
                            : checkingAvailability
                              ? 'Checking availability...'
                              : isUnavailable
                              ? 'Dates not available'
                            : (listing?.min_nights && nights < listing.min_nights)
                              ? `Min ${listing.min_nights} night${listing.min_nights !== 1 ? 's' : ''} required`
                              : 'Confirm Booking'
                        }
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

export default BnbBookingModal;

