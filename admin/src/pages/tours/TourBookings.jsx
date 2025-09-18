import React, { useState } from 'react';
import Head from '@/layout/head/Head';
import Content from '@/layout/content/Content';
import { 
  Block, BlockHead, BlockContent, BlockTitle, BlockBetween, BlockHeadContent,
  DataTable, DataTableBody, DataTableHead, DataTableRow, DataTableItem,
  Button, Icon, UserAvatar, Badge, Row, Col
} from '@/components/Component';
import { Card, CardBody } from 'reactstrap';

const TourBookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      bookingId: 'TB001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      tourName: 'Maasai Mara Safari',
      bookingDate: '2024-01-15',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      guests: 4,
      totalAmount: 1200,
      status: 'confirmed',
      paymentStatus: 'paid'
    },
    {
      id: 2,
      bookingId: 'TB002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      tourName: 'Kilimanjaro Hiking',
      bookingDate: '2024-01-10',
      startDate: '2024-01-25',
      endDate: '2024-01-30',
      guests: 2,
      totalAmount: 800,
      status: 'pending',
      paymentStatus: 'pending'
    },
    {
      id: 3,
      bookingId: 'TB003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      tourName: 'Coast Cultural Tour',
      bookingDate: '2024-01-08',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      guests: 3,
      totalAmount: 450,
      status: 'completed',
      paymentStatus: 'paid'
    }
  ]);

  const getStatusBadge = (status) => {
    const statusMap = {
      confirmed: { variant: 'success', text: 'Confirmed' },
      pending: { variant: 'warning', text: 'Pending' },
      completed: { variant: 'info', text: 'Completed' },
      cancelled: { variant: 'danger', text: 'Cancelled' }
    };
    return statusMap[status] || { variant: 'secondary', text: status };
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      paid: { variant: 'success', text: 'Paid' },
      pending: { variant: 'warning', text: 'Pending' },
      failed: { variant: 'danger', text: 'Failed' },
      refunded: { variant: 'info', text: 'Refunded' }
    };
    return statusMap[status] || { variant: 'secondary', text: status };
  };

  return (
    <React.Fragment>
      <Head title="Tour Bookings" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Tour Bookings</BlockTitle>
              <div className="nk-block-des text-soft">
                <p>Manage and track all tour bookings and reservations.</p>
              </div>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="primary">
                  <Icon name="plus" />
                  <span>New Booking</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Stats Cards */}
        <Block>
          <Row className="g-gs">
            <Col md="3">
              <Card className="card-bordered">
                <CardBody>
                  <div className="nk-wg-gy">
                    <div className="nk-wg-gy-head">
                      <h6 className="title">Total Bookings</h6>
                    </div>
                    <div className="nk-wg-gy-body">
                      <div className="amount">
                        {bookings.length}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="card-bordered">
                <CardBody>
                  <div className="nk-wg-gy">
                    <div className="nk-wg-gy-head">
                      <h6 className="title">Confirmed</h6>
                    </div>
                    <div className="nk-wg-gy-body">
                      <div className="amount text-success">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="card-bordered">
                <CardBody>
                  <div className="nk-wg-gy">
                    <div className="nk-wg-gy-head">
                      <h6 className="title">Pending</h6>
                    </div>
                    <div className="nk-wg-gy-body">
                      <div className="amount text-warning">
                        {bookings.filter(b => b.status === 'pending').length}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="card-bordered">
                <CardBody>
                  <div className="nk-wg-gy">
                    <div className="nk-wg-gy-head">
                      <h6 className="title">Total Revenue</h6>
                    </div>
                    <div className="nk-wg-gy-body">
                      <div className="amount text-primary">
                        ${bookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.totalAmount : 0), 0)}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Bookings Table */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Recent Bookings</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <BlockContent>
            <DataTable className="card-stretch">
              <DataTableBody>
                <DataTableHead className="nk-tb-item nk-tb-head">
                  <DataTableRow>
                    <span className="sub-text">Booking ID</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Customer</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="sub-text">Tour</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span className="sub-text">Dates</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span className="sub-text">Guests</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span className="sub-text">Amount</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Status</span>
                  </DataTableRow>
                  <DataTableRow className="nk-tb-col-tools text-right">
                    <span className="sub-text">Action</span>
                  </DataTableRow>
                </DataTableHead>
                {bookings.map((booking) => (
                  <DataTableItem key={booking.id}>
                    <DataTableRow>
                      <span className="tb-lead">#{booking.bookingId}</span>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <div className="user-card">
                        <UserAvatar 
                          text={booking.customerName} 
                          theme="primary"
                        />
                        <div className="user-info">
                          <span className="tb-lead">{booking.customerName}</span>
                          <span className="sub-text">{booking.customerEmail}</span>
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span className="tb-lead">{booking.tourName}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <div>
                        <span className="tb-lead">{booking.startDate}</span>
                        <span className="sub-text d-block">to {booking.endDate}</span>
                      </div>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="tb-lead">{booking.guests}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="tb-lead">${booking.totalAmount}</span>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <div className="d-flex flex-column">
                        <Badge 
                          color={getStatusBadge(booking.status).variant}
                          className="mb-1"
                        >
                          {getStatusBadge(booking.status).text}
                        </Badge>
                        <Badge 
                          color={getPaymentStatusBadge(booking.paymentStatus).variant}
                          size="sm"
                        >
                          {getPaymentStatusBadge(booking.paymentStatus).text}
                        </Badge>
                      </div>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1">
                        <li>
                          <Button size="sm" color="primary" outline>
                            <Icon name="eye" />
                            <span>View</span>
                          </Button>
                        </li>
                        <li>
                          <Button size="sm" color="primary" outline>
                            <Icon name="edit" />
                            <span>Edit</span>
                          </Button>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                ))}
              </DataTableBody>
            </DataTable>
          </BlockContent>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default TourBookings;

