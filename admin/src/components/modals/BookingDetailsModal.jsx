import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import {
  Block,
  BlockContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  UserAvatar,
  Badge
} from '@/components/Component';
import { Card, CardBody } from 'reactstrap';
import { useSaveBnbBooking } from '@/hooks/useBnb';
import { toast } from 'react-toastify';

const BookingDetailsModal = ({ isOpen, toggle, booking, onBookingUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const updateBooking = useSaveBnbBooking();

  if (!booking) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'light';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'info';
      case 'failed': return 'danger';
      default: return 'light';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsLoading(true);
    try {
      await updateBooking.mutateAsync({
        id: booking.id,
        status: newStatus
      });
      
      toast.success(`Booking ${newStatus === 'confirmed' ? 'approved' : newStatus} successfully!`);
      onBookingUpdate?.();
      toggle();
    } catch (error) {
      toast.error(`Failed to update booking status`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageGuest = () => {
    toast.info('Guest messaging feature coming soon!');
  };

  const handleRefund = () => {
    if (window.confirm('Are you sure you want to process a refund for this booking?')) {
      toast.info('Refund processing feature coming soon!');
    }
  };

  const calculateNights = () => {
    if (!booking.check_in || !booking.check_out) return 0;
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" className="modal-dialog-centered">
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title">Booking Details</h5>
      </ModalHeader>
      <ModalBody className="p-0">
        <div className="p-4">
          {/* Booking Header */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h6 className="mb-1">Booking #{booking.booking_id || booking.id}</h6>
              <p className="text-muted mb-0">
                Created on {formatDate(booking.booking_date || booking.created_at)}
              </p>
            </div>
            <div className="text-right">
              <Badge color={getStatusColor(booking.status)} className="mb-2">
                {(booking.status || 'pending').toUpperCase()}
              </Badge>
              <br />
              <Badge color={getPaymentStatusColor(booking.payment_status || booking.paymentStatus)}>
                {(booking.payment_status || booking.paymentStatus || 'pending').toUpperCase()}
              </Badge>
            </div>
          </div>

          <Row className="g-4">
            {/* Guest Information */}
            <Col lg="6">
              <Card className="card-bordered">
                <CardBody>
                  <BlockTitle tag="h6">Guest Information</BlockTitle>
                  <div className="user-card mt-3">
                    <UserAvatar 
                      theme="primary" 
                      text={(booking.guest_name || booking.guest || 'Guest').charAt(0)}
                      size="lg"
                    />
                    <div className="user-info ml-3">
                      <h6 className="mb-1">{booking.guest_name || booking.guest || 'Guest'}</h6>
                      <p className="text-muted mb-2">{booking.guest_email || booking.guestEmail || 'No email'}</p>
                      <p className="text-muted mb-0">
                        <Icon name="phone" className="mr-1" />
                        {booking.guest_phone || 'No phone provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      color="primary" 
                      size="sm" 
                      outline 
                      onClick={handleMessageGuest}
                      className="mr-2"
                    >
                      <Icon name="chat" className="mr-1" />
                      Message Guest
                    </Button>
                    <Button color="light" size="sm" outline>
                      <Icon name="user" className="mr-1" />
                      View Profile
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Property Information */}
            <Col lg="6">
              <Card className="card-bordered">
                <CardBody>
                  <BlockTitle tag="h6">Property Information</BlockTitle>
                  <div className="mt-3">
                    <h6 className="mb-2">{booking.property_title || booking.property || 'Property'}</h6>
                    <p className="text-muted mb-3">{booking.property_location || 'Location not specified'}</p>
                    
                    <div className="d-flex align-items-center mb-2">
                      <Icon name="users" className="mr-2 text-muted" />
                      <span>{booking.guest_count || booking.guests || 0} guests</span>
                    </div>
                    
                    <div className="d-flex align-items-center mb-2">
                      <Icon name="calendar" className="mr-2 text-muted" />
                      <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <Icon name="home" className="mr-2 text-muted" />
                      <span>{booking.property_type || 'Property'}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Booking Details */}
            <Col lg="12">
              <Card className="card-bordered">
                <CardBody>
                  <BlockTitle tag="h6">Booking Details</BlockTitle>
                  <Row className="g-3 mt-2">
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label text-muted">Check-in Date</label>
                        <p className="mb-0">
                          <Icon name="calendar" className="mr-2 text-primary" />
                          {formatDate(booking.check_in || booking.checkIn)}
                        </p>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label text-muted">Check-out Date</label>
                        <p className="mb-0">
                          <Icon name="calendar" className="mr-2 text-primary" />
                          {formatDate(booking.check_out || booking.checkOut)}
                        </p>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label text-muted">Total Amount</label>
                        <p className="mb-0 h6 text-success">
                          {formatCurrency(booking.total_amount || booking.amount || 0)}
                        </p>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label text-muted">Payment Method</label>
                        <p className="mb-0">
                          <Icon name="card" className="mr-2 text-muted" />
                          {booking.payment_method || 'Not specified'}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {/* Special Requests */}
                  {booking.special_requests && (
                    <div className="mt-4">
                      <label className="form-label text-muted">Special Requests</label>
                      <div className="alert alert-light">
                        <Icon name="info" className="mr-2" />
                        {booking.special_requests}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Action Buttons */}
          <div className="mt-4 d-flex justify-content-between">
            <div>
              {booking.status === 'pending' && (
                <>
                  <Button 
                    color="success" 
                    onClick={() => handleStatusUpdate('confirmed')}
                    disabled={isLoading}
                    className="mr-2"
                  >
                    <Icon name="check" className="mr-1" />
                    Approve Booking
                  </Button>
                  <Button 
                    color="danger" 
                    outline
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={isLoading}
                  >
                    <Icon name="cross" className="mr-1" />
                    Decline Booking
                  </Button>
                </>
              )}
              
              {booking.status === 'confirmed' && (
                <Button 
                  color="warning" 
                  outline
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={isLoading}
                  className="mr-2"
                >
                  <Icon name="cross" className="mr-1" />
                  Cancel Booking
                </Button>
              )}

              {(booking.payment_status === 'paid' || booking.paymentStatus === 'paid') && (
                <Button 
                  color="info" 
                  outline
                  onClick={handleRefund}
                  disabled={isLoading}
                >
                  <Icon name="money" className="mr-1" />
                  Process Refund
                </Button>
              )}
            </div>

            <div>
              <Button color="light" outline onClick={toggle}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default BookingDetailsModal;
