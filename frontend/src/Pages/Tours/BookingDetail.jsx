import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { m } from 'framer-motion';

// Components
import Header, { HeaderCart, HeaderLanguage, HeaderNav, Menu, SearchBar } from "../../Components/Header/Header";
import { fadeIn, fadeInUp } from "../../Functions/GlobalAnimations";
import HeaderData from "../../Components/Header/HeaderData";
import FooterStyle01 from "../../Components/Footers/FooterStyle01";
import PageTitle from "../../Components/PageTitle/PageTitle";
import Buttons from "../../Components/Button/Buttons";
import MessageBox from "../../Components/MessageBox/MessageBox";
import CustomModal from "../../Components/CustomModal";
import Lists from "../../Components/Lists/Lists";

// API Services
import { getTourBooking, cancelTourBooking, modifyTourBooking } from '../../api/toursService';
import { getBookingPayments } from '../../api/paymentService';
import useAuth from '../../api/useAuth';

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Booking data
  const [booking, setBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load booking data
  useEffect(() => {
    if (bookingId && isAuthenticated) {
      loadBookingData();
    }
  }, [bookingId, isAuthenticated]);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      
      // Load booking and payments in parallel
      const [bookingData, paymentsData] = await Promise.allSettled([
        getTourBooking(Number(bookingId)),
        getBookingPayments(Number(bookingId))
      ]);

      if (bookingData.status === 'fulfilled') {
        setBooking(bookingData.value);
      } else {
        setError('Booking not found');
      }

      if (paymentsData.status === 'fulfilled') {
        setPayments(paymentsData.value);
      }
      
    } catch (err) {
      console.error('Failed to load booking:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!booking) return;
    
    try {
      setIsProcessing(true);
      await cancelTourBooking(booking.id);
      await loadBookingData(); // Refresh data
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neonorange mb-4"></div>
          <p className="text-lg text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MessageBox
          theme="message-box01"
          variant="error"
          message={error || "Booking not found"}
        />
      </div>
    );
  }

  const startDate = new Date(booking.start_date);
  const now = new Date();
  const daysUntilTour = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
  const canCancel = booking.status !== 'cancelled' && daysUntilTour > 1;
  const canModify = booking.status === 'confirmed' && daysUntilTour > 1;

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
        title={`Booking #${booking.id}`}
        subtitle={booking.tour_title}
        breadcrumb={[
          { title: "Home", to: "/" },
          { title: "My Bookings", to: "/tours/my-bookings" },
          { title: `Booking #${booking.id}` }
        ]}
      />
      {/* Page Title End */}

      <div className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          {/* Booking Status Banner */}
          <Row className="mb-12">
            <Col>
              <m.div {...fadeIn}>
                <div className={`p-6 rounded-lg border-l-4 ${
                  booking.status === 'confirmed' ? 'bg-green-50 border-green-500' :
                  booking.status === 'pending' ? 'bg-yellow-50 border-yellow-500' :
                  booking.status === 'cancelled' ? 'bg-red-50 border-red-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Booking Status: 
                        <span className={`ml-2 px-3 py-1 rounded text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </h2>
                      
                      {booking.status === 'confirmed' && daysUntilTour > 0 && (
                        <p className="text-green-700">
                          ✓ Your tour is confirmed! {daysUntilTour} days to go.
                        </p>
                      )}
                      
                      {booking.status === 'pending' && (
                        <p className="text-yellow-700">
                          ⏳ Your booking is pending confirmation. We'll notify you once confirmed.
                        </p>
                      )}
                      
                      {booking.status === 'cancelled' && (
                        <p className="text-red-700">
                          ❌ This booking has been cancelled. Refund processing may take 5-7 business days.
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {canModify && (
                        <Buttons
                          className="btn-fancy btn-outline"
                          title="Modify Booking"
                          onClick={() => {
                            // Navigate to modification flow
                            navigate(`/tours/bookings/${booking.id}/modify`);
                          }}
                        />
                      )}
                      
                      {canCancel && (
                        <Buttons
                          className="btn-fancy btn-outline text-red-600 border-red-600"
                          title="Cancel Booking"
                          onClick={() => setShowCancelModal(true)}
                        />
                      )}
                      
                      {booking.status === 'cancelled' && (
                        <Link to={`/tours/${booking.tour_id}`}>
                          <Buttons
                            className="btn-fancy btn-fill"
                            themeColor="#232323"
                            color="#fff"
                            title="Rebook Tour"
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </m.div>
            </Col>
          </Row>

          {/* Booking Details */}
          <Row className="mb-12">
            <Col lg={8}>
              <m.div {...fadeInUp}>
                <div className="bg-white border rounded-lg p-8 shadow-sm">
                  <h3 className="text-xl font-semibold mb-6">Tour Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tour Information</h4>
                      <Lists
                        data={[
                          { content: `Tour: ${booking.tour_title}` },
                          { content: `Location: ${booking.tour_location || 'Kenya'}` },
                          { content: `Duration: ${booking.tour_duration || '3 days'}` },
                          { content: `Tour Date: ${new Date(booking.start_date).toLocaleDateString()}` },
                          { content: `Participants: ${booking.participants} people` }
                        ]}
                        theme="list-style-02"
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                      <Lists
                        data={[
                          { content: `Name: ${booking.guest_name}` },
                          { content: `Email: ${booking.guest_email}` },
                          { content: `Phone: ${booking.guest_phone}` },
                          ...(booking.emergency_contact_name ? [{ content: `Emergency Contact: ${booking.emergency_contact_name}` }] : []),
                          ...(booking.emergency_contact_phone ? [{ content: `Emergency Phone: ${booking.emergency_contact_phone}` }] : [])
                        ]}
                        theme="list-style-02"
                      />
                    </div>
                  </div>

                  {booking.special_requests && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{booking.special_requests}</p>
                      </div>
                    </div>
                  )}

                  {booking.participant_details && booking.participant_details.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Participant Details</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Participant</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Age</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {booking.participant_details.map((participant, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm">Participant {index + 1}</td>
                                <td className="px-4 py-3 text-sm">{participant.age}</td>
                                <td className="px-4 py-3 text-sm">
                                  {participant.age < 2 ? 'Infant' : 
                                   participant.age < 12 ? 'Child' : 'Adult'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </m.div>
            </Col>
            
            {/* Pricing & Payment Sidebar */}
            <Col lg={4}>
              <m.div {...fadeInUp}>
                {/* Pricing Breakdown */}
                <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
                  <h4 className="font-semibold mb-4">Pricing Breakdown</h4>
                  
                  {booking.pricing_breakdown ? (
                    <div className="space-y-2 text-sm">
                      {booking.pricing_breakdown.breakdown?.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.category} (Age {item.age})</span>
                          <span>{booking.currency} {item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{booking.currency} {booking.pricing_breakdown.subtotal.toLocaleString()}</span>
                        </div>
                        
                        {booking.pricing_breakdown.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-{booking.currency} {booking.pricing_breakdown.discount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span>VAT (16%):</span>
                          <span>{booking.currency} {booking.pricing_breakdown.taxes.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{booking.currency} {booking.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-darkgray">
                        {booking.currency} {booking.total_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold mb-4">Payment Information</h4>
                  
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.map((payment, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{payment.payment_method?.toUpperCase()}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                              {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <div>Amount: {payment.currency} {payment.amount.toLocaleString()}</div>
                            <div>Date: {new Date(payment.created_at).toLocaleDateString()}</div>
                            {payment.transaction_id && (
                              <div>Transaction ID: {payment.transaction_id}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-600">
                      <i className="fas fa-credit-card text-2xl mb-2"></i>
                      <p>No payment information available</p>
                    </div>
                  )}
                </div>
              </m.div>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row>
            <Col>
              <m.div {...fadeIn}>
                <div className="bg-[#f7f8fc] p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Quick Actions</h4>
                  <div className="flex flex-wrap gap-4">
                    <Link to={`/tours/${booking.tour_id}`}>
                      <Buttons
                        className="btn-fancy btn-outline"
                        title="View Tour Details"
                      />
                    </Link>
                    
                    <Buttons
                      className="btn-fancy btn-outline"
                      title="Download Voucher"
                      onClick={() => {
                        // Implement voucher download
                        console.log('Download voucher for booking:', booking.id);
                      }}
                    />
                    
                    <Buttons
                      className="btn-fancy btn-outline"
                      title="Contact Support"
                      onClick={() => {
                        // Open support chat or redirect to contact
                        console.log('Contact support for booking:', booking.id);
                      }}
                    />
                    
                    <Link to="/tours/my-bookings">
                      <Buttons
                        className="btn-fancy btn-fill"
                        themeColor="#232323"
                        color="#fff"
                        title="Back to All Bookings"
                      />
                    </Link>
                  </div>
                </div>
              </m.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Cancel Booking Modal */}
      <CustomModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        size="md"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Cancel Booking</h3>
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to cancel your booking for <strong>{booking.tour_title}</strong>?
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">Cancellation Policy:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Free cancellation up to 24 hours before tour start</li>
                <li>• Refund will be processed within 5-7 business days</li>
                <li>• Cancellation fees may apply for last-minute changes</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Buttons
              className="btn-fancy btn-outline"
              title="Keep Booking"
              onClick={() => setShowCancelModal(false)}
            />
            <Buttons
              className="btn-fancy btn-fill"
              themeColor="#dc2626"
              color="#fff"
              title={isProcessing ? "Cancelling..." : "Cancel Booking"}
              onClick={handleCancelBooking}
              disabled={isProcessing}
            />
          </div>
        </div>
      </CustomModal>

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}
    </div>
  );
};

export default BookingDetailPage;
