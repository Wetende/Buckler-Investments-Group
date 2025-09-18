import React, { useState } from "react";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  UserAvatar,
  Badge,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  BlockBetween,
} from "@/components/Component";
import { Card, CardBody } from "reactstrap";
import { useBnbBookings, useSaveBnbBooking } from "@/hooks/useBnb";
import { toast } from "react-toastify";
import BookingDetailsModal from "@/components/modals/BookingDetailsModal";
import BnbSearchFilter from "@/components/search/BnbSearchFilter";

const Bookings = () => {
  const [sm, updateSm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // API hooks for real data
  const { data: bookingsData, isLoading, error, refetch } = useBnbBookings({
    search: searchQuery || undefined,
    ...filters
  });
  const updateBookingMutation = useSaveBnbBooking();

  const bookings = bookingsData?.items || [];

  // Calculate metrics from real data
  const metrics = {
    totalBookings: bookingsData?.total || 0,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalRevenue: bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.total_amount || 0), 0),
    averageNights: bookings.length > 0 ? 
      Math.round(bookings.reduce((sum, b) => sum + (b.nights || 0), 0) / bookings.length) : 0
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
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

  // Booking management handlers
  const handleApproveBooking = async (booking) => {
    try {
      await updateBookingMutation.mutateAsync({
        id: booking.id,
        status: 'confirmed'
      });
      toast.success('Booking approved successfully!');
    } catch (error) {
      toast.error('Failed to approve booking');
    }
  };

  const handleDeclineBooking = async (booking) => {
    if (window.confirm('Are you sure you want to decline this booking?')) {
      try {
        await updateBookingMutation.mutateAsync({
          id: booking.id,
          status: 'cancelled'
        });
        toast.success('Booking declined');
      } catch (error) {
        toast.error('Failed to decline booking');
      }
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  const handleBookingUpdate = () => {
    refetch(); // Refresh bookings list
  };

  // Search and filter handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter configuration for the search component
  const filterOptions = {
    status: {
      label: 'Booking Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'completed', label: 'Completed' },
        { value: 'in_progress', label: 'In Progress' }
      ]
    },
    payment_status: {
      label: 'Payment Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'partial', label: 'Partial' },
        { value: 'refunded', label: 'Refunded' },
        { value: 'failed', label: 'Failed' }
      ]
    },
    property_title: {
      label: 'Property',
      type: 'text',
      placeholder: 'Enter property name'
    },
    guest_name: {
      label: 'Guest Name',
      type: 'text',
      placeholder: 'Enter guest name'
    },
    guests: {
      label: 'Number of Guests',
      type: 'select',
      options: [
        { value: '1', label: '1 Guest' },
        { value: '2', label: '2 Guests' },
        { value: '3', label: '3 Guests' },
        { value: '4', label: '4 Guests' },
        { value: '5', label: '5+ Guests' }
      ]
    }
  };


  const handleMessageGuest = (booking) => {
    // This will open messaging interface
    toast.info('Guest messaging feature coming soon!');
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingMutation.mutateAsync({
          id: booking.id,
          status: 'cancelled'
        });
        toast.success('Booking cancelled');
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <React.Fragment>
        <Head title="Bookings" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page>Bookings</BlockTitle>
                <BlockDes className="text-soft">
                  <p>Loading bookings...</p>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div className="d-flex justify-content-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </Block>
        </Content>
      </React.Fragment>
    );
  }

  // Error state
  if (error) {
    return (
      <React.Fragment>
        <Head title="Bookings" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page>Bookings</BlockTitle>
                <BlockDes className="text-soft">
                  <p>Error loading bookings.</p>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div className="alert alert-danger">
              <h6>Error Loading Bookings</h6>
              <p>{error.message}</p>
              <Button color="primary" outline onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </Block>
        </Content>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Head title="Bookings" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Bookings</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage your property bookings and guest reservations.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="light" outline className="btn-white">
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" outline className="btn-white">
                        <Icon name="calender-date"></Icon>
                        <span>Calendar View</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Metrics Overview */}
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Bookings</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="calendar" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalBookings}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Confirmed</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="check-circle" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.confirmedBookings}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Revenue</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="coins" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.totalRevenue)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Avg. Stay</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="clock" className="card-hint-icon text-info"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.averageNights}</span>
                    <span className="amount-sm">nights</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Search and Filter */}
        <Block>
          <BnbSearchFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchPlaceholder="Search bookings by guest name, property, or booking ID..."
            filterOptions={filterOptions}
            showDateRange={true}
            className="mb-4"
          />
        </Block>

        {/* Bookings Table */}
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-title">
                  <h6 className="title">All Bookings</h6>
                </div>
                <div className="card-tools">
                  <div className="btn-wrap">
                    <Button
                      color="light"
                      outline
                      className="btn-dim"
                      onClick={() => refetch()}
                      title="Refresh bookings"
                    >
                      <Icon name="reload"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Booking ID</span>
                </DataTableRow>
                <DataTableRow size="mb">
                  <span className="sub-text">Guest</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Property</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Dates</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Amount</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <span className="sub-text">Action</span>
                </DataTableRow>
              </DataTableHead>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <DataTableItem key={booking.id}>
                    <DataTableRow>
                      <div>
                        <span className="tb-lead">{booking.booking_id || booking.id}</span>
                        <div className="tb-sub text-muted small">
                          {formatDate(booking.booking_date || booking.created_at)}
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <div className="user-card">
                        <UserAvatar 
                          theme="primary" 
                          text={(booking.guest_name || booking.guest || 'Guest').charAt(0)}
                        />
                        <div className="user-info">
                          <span className="tb-lead">{booking.guest_name || booking.guest || 'Guest'}</span>
                          <span className="sub-text">{booking.guest_email || booking.guestEmail || 'No email'}</span>
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <div>
                        <span className="tb-lead">{booking.property_title || booking.property || 'Property'}</span>
                        <div className="tb-sub">
                          <Icon name="users" className="mr-1"></Icon>
                          {booking.guest_count || booking.guests || 0} guests • {booking.nights || booking.duration || 0} nights
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <div>
                        <div className="tb-sub">
                          <Icon name="calendar" className="mr-1"></Icon>
                          Check-in: {formatDate(booking.check_in || booking.checkIn)}
                        </div>
                        <div className="tb-sub">
                          <Icon name="calendar" className="mr-1"></Icon>
                          Check-out: {formatDate(booking.check_out || booking.checkOut)}
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <div>
                        <span className="tb-amount">{formatCurrency(booking.total_amount || booking.amount || 0)}</span>
                        <div className="tb-sub">
                          <Badge color={getPaymentStatusColor(booking.payment_status || booking.paymentStatus)} className="badge-sm">
                            {booking.payment_status || booking.paymentStatus || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <Badge color={getStatusColor(booking.status)}>
                        {booking.status || 'pending'}
                      </Badge>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1">
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                              <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#view"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handleViewBooking(booking);
                                    }}
                                  >
                                    <Icon name="eye"></Icon>
                                    <span>View Details</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#message"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handleMessageGuest(booking);
                                    }}
                                  >
                                    <Icon name="chat"></Icon>
                                    <span>Message Guest</span>
                                  </DropdownItem>
                                </li>
                                {booking.status === 'pending' && (
                                  <>
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#confirm"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          handleApproveBooking(booking);
                                        }}
                                      >
                                        <Icon name="check"></Icon>
                                        <span>Confirm</span>
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#decline"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          handleDeclineBooking(booking);
                                        }}
                                      >
                                        <Icon name="cross"></Icon>
                                        <span>Decline</span>
                                      </DropdownItem>
                                    </li>
                                  </>
                                )}
                                <li className="divider"></li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#cancel"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handleCancelBooking(booking);
                                    }}
                                  >
                                    <Icon name="na"></Icon>
                                    <span>Cancel Booking</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                ))
              ) : (
                <DataTableItem>
                  <DataTableRow className="text-center" style={{ gridColumn: '1 / -1' }}>
                    <div className="p-4">
                      <Icon name="calendar" className="text-muted" style={{ fontSize: '2rem' }} />
                      <p className="text-muted mt-2">No bookings found. Bookings will appear here once guests start making reservations.</p>
                    </div>
                  </DataTableRow>
                </DataTableItem>
              )}
            </DataTableBody>
          </DataTable>
        </Block>
      </Content>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={showBookingModal}
        toggle={handleCloseBookingModal}
        booking={selectedBooking}
        onBookingUpdate={handleBookingUpdate}
      />
    </React.Fragment>
  );
};

export default Bookings;

