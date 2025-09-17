import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { m } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// Components
import Header, { HeaderCart, HeaderLanguage, HeaderNav, Menu, SearchBar } from "../../Components/Header/Header";
import { fadeIn, fadeInUp } from "../../Functions/GlobalAnimations";
import HeaderData from "../../Components/Header/HeaderData";
import FooterStyle01 from "../../Components/Footers/FooterStyle01";
import PageTitle from "../../Components/PageTitle/PageTitle";
import Buttons from "../../Components/Button/Buttons";
import MessageBox from "../../Components/MessageBox/MessageBox";
import CustomModal from "../../Components/CustomModal";
import { Input } from "../../Components/Form/Form";

// API Services
import { getMyTourBookings, cancelTourBooking, modifyTourBooking } from '../../api/toursService';
import { getBookingPayments } from '../../api/paymentService';
import useAuth from '../../api/useAuth';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Bookings data
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  
  // UI state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load bookings
  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyTourBookings({ limit: 50 });
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const startDate = new Date(booking.start_date);
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return startDate > now && booking.status !== 'cancelled';
      case 'past':
        return startDate <= now && booking.status !== 'cancelled';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsProcessing(true);
      await cancelTourBooking(selectedBooking.id);
      await loadBookings(); // Refresh list
      setShowCancelModal(false);
      setSelectedBooking(null);
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

  // Get action buttons for booking
  const getActionButtons = (booking) => {
    const startDate = new Date(booking.start_date);
    const now = new Date();
    const daysUntilTour = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
    
    const buttons = [];
    
    // View details button
    buttons.push(
      <Link key="view" to={`/tours/bookings/${booking.id}`}>
        <Buttons
          className="btn-fancy btn-outline text-xs mr-2"
          title="View"
          size="sm"
        />
      </Link>
    );
    
    // Modify button (if upcoming and not within 24 hours)
    if (booking.status === 'confirmed' && daysUntilTour > 1) {
      buttons.push(
        <Buttons
          key="modify"
          className="btn-fancy btn-outline text-xs mr-2"
          title="Modify"
          size="sm"
          onClick={() => {
            setSelectedBooking(booking);
            setShowModifyModal(true);
          }}
        />
      );
    }
    
    // Cancel button (if upcoming and not within 24 hours)
    if (booking.status !== 'cancelled' && daysUntilTour > 1) {
      buttons.push(
        <Buttons
          key="cancel"
          className="btn-fancy btn-outline text-xs text-red-600 border-red-600"
          title="Cancel"
          size="sm"
          onClick={() => {
            setSelectedBooking(booking);
            setShowCancelModal(true);
          }}
        />
      );
    }
    
    // Rebook button (if past or cancelled)
    if (booking.status === 'cancelled' || (booking.status === 'completed' && startDate < now)) {
      buttons.push(
        <Link key="rebook" to={`/tours/${booking.tour_id}`}>
          <Buttons
            className="btn-fancy btn-fill text-xs"
            themeColor="#232323"
            color="#fff"
            title="Rebook"
            size="sm"
          />
        </Link>
      );
    }
    
    return buttons;
  };

  // Format table data
  const tableData = filteredBookings.map(booking => ({
    id: booking.id,
    tour: (
      <div>
        <div className="font-medium">{booking.tour_title}</div>
        <div className="text-sm text-gray-600">{booking.tour_location}</div>
      </div>
    ),
    date: (
      <div>
        <div className="font-medium">{new Date(booking.start_date).toLocaleDateString()}</div>
        <div className="text-sm text-gray-600">{booking.duration || '3 days'}</div>
      </div>
    ),
    participants: booking.participants,
    amount: (
      <div>
        <div className="font-medium">{booking.currency} {booking.total_amount?.toLocaleString()}</div>
        <div className="text-sm text-gray-600">Total paid</div>
      </div>
    ),
    status: (
      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
      </span>
    ),
    actions: (
      <div className="flex flex-wrap gap-1">
        {getActionButtons(booking)}
      </div>
    )
  }));

  const tableColumns = [
    { title: 'Tour', key: 'tour' },
    { title: 'Date', key: 'date' },
    { title: 'Guests', key: 'participants' },
    { title: 'Amount', key: 'amount' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neonorange mb-4"></div>
          <p className="text-lg text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

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
        title="My Tour Bookings"
        subtitle="Manage your tour reservations"
        breadcrumb={[
          { title: "Home", to: "/" },
          { title: "Account", to: "/account" },
          { title: "My Bookings" }
        ]}
      />
      {/* Page Title End */}

      <div className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          {/* Filter Tabs */}
          <Row className="mb-12">
            <Col>
              <m.div {...fadeIn}>
                <div className="flex flex-wrap border-b border-gray-200 mb-8">
                  {[
                    { key: 'all', label: 'All Bookings' },
                    { key: 'upcoming', label: 'Upcoming' },
                    { key: 'past', label: 'Past Tours' },
                    { key: 'cancelled', label: 'Cancelled' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                        filter === tab.key
                          ? 'border-neonorange text-neonorange'
                          : 'border-transparent text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </m.div>
            </Col>
          </Row>

          {/* Bookings Summary */}
          <Row className="mb-12">
            <Col>
              <m.div {...fadeInUp}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { 
                      label: 'Total Bookings', 
                      value: bookings.length,
                      color: 'bg-blue-100 text-blue-800'
                    },
                    { 
                      label: 'Upcoming Tours', 
                      value: bookings.filter(b => new Date(b.start_date) > new Date() && b.status !== 'cancelled').length,
                      color: 'bg-green-100 text-green-800'
                    },
                    { 
                      label: 'Completed', 
                      value: bookings.filter(b => b.status === 'completed').length,
                      color: 'bg-purple-100 text-purple-800'
                    },
                    { 
                      label: 'Total Spent', 
                      value: `KES ${bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0).toLocaleString()}`,
                      color: 'bg-orange-100 text-orange-800'
                    }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg border shadow-sm">
                      <div className={`inline-block px-3 py-1 rounded text-sm font-medium mb-2 ${stat.color}`}>
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-darkgray">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </m.div>
            </Col>
          </Row>

          {/* Bookings Table */}
          <Row>
            <Col>
              <m.div {...fadeIn}>
                {error ? (
                  <MessageBox
                    theme="message-box01"
                    variant="error"
                    message={error}
                  />
                ) : filteredBookings.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {tableColumns.map((column, index) => (
                              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {column.title}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {tableData.map((row, index) => (
                            <tr key={row.id || index}>
                              {tableColumns.map((column, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                  {row[column.key]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="mb-6">
                      <i className="fas fa-suitcase-rolling text-6xl text-gray-300"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-4">
                      {filter === 'all' ? 'No bookings yet' : 
                       filter === 'upcoming' ? 'No upcoming tours' :
                       filter === 'past' ? 'No past tours' : 'No cancelled bookings'}
                    </h3>
                    <p className="text-gray-500 mb-8">
                      {filter === 'all' ? 'Start exploring our amazing tours and create your first booking!' : 
                       'Check other categories for more bookings.'}
                    </p>
                    {filter === 'all' && (
                      <Link to="/tours">
                        <Buttons
                          className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                          themeColor="#232323"
                          color="#fff"
                          title="Browse Tours"
                        />
                      </Link>
                    )}
                  </div>
                )}
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
          {selectedBooking && (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to cancel your booking for <strong>{selectedBooking.tour_title}</strong>?
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
          )}
          
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

      {/* Modify Booking Modal (date/participants) */}
      <CustomModal
        show={showModifyModal}
        onHide={() => setShowModifyModal(false)}
        size="md"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Modify Booking</h3>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">New Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  defaultValue={new Date(selectedBooking.start_date).toISOString().slice(0,10)}
                  onChange={(e) => (selectedBooking._new_date = e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Participants</label>
                <input
                  type="number"
                  min={1}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  defaultValue={selectedBooking.participants || 1}
                  onChange={(e) => (selectedBooking._new_participants = Number(e.target.value))}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Buttons
                  className="btn-fancy btn-outline"
                  title="Cancel"
                  onClick={() => setShowModifyModal(false)}
                />
                <Buttons
                  className="btn-fancy btn-fill"
                  themeColor="#232323"
                  color="#fff"
                  title={isProcessing ? 'Saving...' : 'Save Changes'}
                  onClick={async () => {
                    try {
                      setIsProcessing(true)
                      await modifyTourBooking(selectedBooking.id, {
                        id: selectedBooking.id,
                        tour_id: selectedBooking.tour_id,
                        customer_id: selectedBooking.customer_id,
                        booking_date: selectedBooking._new_date || selectedBooking.start_date,
                        participants: selectedBooking._new_participants || selectedBooking.participants,
                      })
                      setShowModifyModal(false)
                      setSelectedBooking(null)
                      await loadBookings()
                    } catch (e) {
                      console.error('Failed to modify booking', e)
                    } finally {
                      setIsProcessing(false)
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Footer Start */}
      <FooterStyle01 theme="dark" className="text-[#7F8082] bg-darkgray" />
      {/* Footer End */}
    </div>
  );
};

export default MyBookingsPage;
