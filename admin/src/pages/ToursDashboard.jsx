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
  PreviewCard,
  BlockBetween,
} from "@/components/Component";
import { Card } from "reactstrap";
import { useOperatorDashboard, useTourBookings, useFeaturedTours } from "@/hooks/useTours";
import { Link } from "react-router-dom";

const ToursDashboard = () => {
  const [sm, updateSm] = useState(false);
  const operatorId = 1; // TODO: Get from auth context

  // Fetch real data from API
  const { 
    data: dashboardData, 
    isLoading: dashboardLoading, 
    error: dashboardError 
  } = useOperatorDashboard(operatorId);

  const { 
    data: recentBookings, 
    isLoading: bookingsLoading 
  } = useTourBookings({ 
    limit: 5, 
    sort: 'created_at', 
    order: 'desc' 
  });

  const { 
    data: featuredTours, 
    isLoading: toursLoading 
  } = useFeaturedTours(4);

  // Use real data or fallback to loading state
  const toursMetrics = dashboardData || {
    totalPackages: 0,
    activeBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    tourOperators: 0,
    popularDestination: "Loading..."
  };

  const recentTourBookings = recentBookings || [];
  const popularTours = featuredTours || [];

  // Show loading state for dashboard
  if (dashboardLoading) {
    return (
      <>
        <Head title="Tours Dashboard" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page tag="h3">
                  Tours Dashboard
                </BlockTitle>
                <BlockDes className="text-soft">
                  <p>Loading dashboard data...</p>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </Block>
        </Content>
      </>
    );
  }

  // Show error state if dashboard fails to load
  if (dashboardError) {
    return (
      <>
        <Head title="Tours Dashboard" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page tag="h3">
                  Tours Dashboard
                </BlockTitle>
                <BlockDes className="text-soft">
                  <p>Error loading dashboard data</p>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div className="alert alert-danger">
              <h6>Unable to load dashboard</h6>
              <p>{dashboardError.message}</p>
              <Button color="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Block>
        </Content>
      </>
    );
  }

  return (
    <>
      <Head title="Tours Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Tours Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage tour packages, operators, and bookings</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className={`toggle-expand-content ${sm ? "expanded" : ""}`}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Link to="/tours/create">
                        <Button color="primary" className="btn-white">
                          <Icon name="plus" />
                          <span>Add Tour Package</span>
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Button 
                        color="light" 
                        className="btn-outline-light btn-white"
                        onClick={() => {
                          // TODO: Implement export functionality
                          alert('Export functionality coming soon!');
                        }}
                      >
                        <Icon name="download-cloud" />
                        <span>Export</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Tours Metrics Cards */}
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Tour Packages</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-map text-primary"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{toursMetrics.totalPackages}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      18.2%
                    </span>
                  </div>
                  <div className="card-amount-sm">Active tour packages</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Bookings</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-calendar-booking text-info"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{toursMetrics.activeBookings}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      12.8%
                    </span>
                  </div>
                  <div className="card-amount-sm">Upcoming tour bookings</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Tour Revenue</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-coins text-success"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">KES {toursMetrics.totalRevenue.toLocaleString()}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      24.5%
                    </span>
                  </div>
                  <div className="card-amount-sm">This month's tour revenue</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Tour Operators</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-users-fill text-warning"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{toursMetrics.tourOperators}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      6.7%
                    </span>
                  </div>
                  <div className="card-amount-sm">Active tour operators</div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Recent Tour Bookings */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Recent Tour Bookings</BlockTitle>
              <p className="text-soft">Latest booking activity for tour packages</p>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                {bookingsLoading ? (
                  <div className="d-flex justify-content-center p-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading bookings...</span>
                    </div>
                  </div>
                ) : recentTourBookings.length === 0 ? (
                  <div className="text-center p-4">
                    <Icon name="calendar" style={{ fontSize: '3rem', color: '#ccc' }} />
                    <h6 className="mt-2">No Recent Bookings</h6>
                    <p className="text-soft">No tour bookings found. New bookings will appear here.</p>
                  </div>
                ) : (
                  <div className="nk-tb-list nk-tb-ulist">
                    <div className="nk-tb-item nk-tb-head">
                      <div className="nk-tb-col"><span className="sub-text">Client</span></div>
                      <div className="nk-tb-col tb-col-mb"><span className="sub-text">Tour Package</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">Start Date</span></div>
                      <div className="nk-tb-col tb-col-lg"><span className="sub-text">Amount</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">Status</span></div>
                      <div className="nk-tb-col nk-tb-col-tools text-right">
                        <span className="sub-text">Action</span>
                      </div>
                    </div>
                    {recentTourBookings.map((booking) => (
                      <div key={booking.id} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <div className="user-card">
                            <div className="user-avatar bg-info">
                              <span>{(booking.customer_name || booking.client || 'U').substring(0, 2).toUpperCase()}</span>
                            </div>
                            <div className="user-info">
                              <span className="tb-lead">{booking.customer_name || booking.client || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="nk-tb-col tb-col-mb">
                          <span className="tb-amount">{booking.tour_title || booking.tour || 'Tour Package'}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{booking.start_date || booking.startDate || 'TBD'}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span className="tb-amount">
                            KES {(booking.total_amount || booking.amount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className={`badge badge-outline-${
                            (booking.status === 'confirmed' || booking.status === 'completed') ? 'success' : 
                            booking.status === 'cancelled' ? 'danger' : 'warning'
                          }`}>
                            {booking.status || 'pending'}
                          </span>
                        </div>
                        <div className="nk-tb-col nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <Link to={`/tours/bookings/${booking.id}`}>
                                <Button size="sm" color="primary" outline>
                                  <Icon name="eye" />
                                </Button>
                              </Link>
                            </li>
                            <li>
                              <Link to={`/tours/bookings/${booking.id}/edit`}>
                                <Button size="sm" color="light" outline>
                                  <Icon name="edit" />
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Block>

        {/* Popular Tours and Quick Actions */}
        <Row className="g-gs">
          <Col lg="8">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Featured Tour Packages</BlockTitle>
                  <p className="text-soft">Top performing tours by popularity and bookings</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  {toursLoading ? (
                    <div className="d-flex justify-content-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading tours...</span>
                      </div>
                    </div>
                  ) : popularTours.length === 0 ? (
                    <div className="text-center p-4">
                      <Icon name="map" style={{ fontSize: '3rem', color: '#ccc' }} />
                      <h6 className="mt-2">No Tours Available</h6>
                      <p className="text-soft">Create your first tour package to get started.</p>
                      <Link to="/tours/create">
                        <Button color="primary">
                          <Icon name="plus" />
                          <span>Create Tour</span>
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="nk-tb-list nk-tb-ulist">
                      <div className="nk-tb-item nk-tb-head">
                        <div className="nk-tb-col"><span className="sub-text">Tour Name</span></div>
                        <div className="nk-tb-col tb-col-md"><span className="sub-text">Price</span></div>
                        <div className="nk-tb-col tb-col-lg"><span className="sub-text">Status</span></div>
                      </div>
                      {popularTours.map((tour, index) => (
                        <div key={tour.id || index} className="nk-tb-item">
                          <div className="nk-tb-col">
                            <span className="tb-lead">{tour.title || tour.name || 'Untitled Tour'}</span>
                            <div className="tb-sub text-muted">{tour.location || 'Location TBD'}</div>
                          </div>
                          <div className="nk-tb-col tb-col-md">
                            <span className="tb-amount">
                              KES {(tour.price || tour.revenue || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="nk-tb-col tb-col-lg">
                            <span className={`badge badge-outline-${
                              tour.status === 'active' ? 'success' : 
                              tour.status === 'inactive' ? 'warning' : 'info'
                            }`}>
                              {tour.status || 'active'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </Block>
          </Col>

          <Col lg="4">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Quick Actions</BlockTitle>
                </BlockHeadContent>
              </BlockHead>
              <Row className="g-3">
                <Col sm="12">
                  <Card className="card-bordered">
                    <div className="card-inner">
                      <div className="card-title-group align-start mb-3">
                        <div className="card-title">
                          <h6 className="title">Tour Packages</h6>
                        </div>
                        <div className="card-tools">
                          <em className="card-hint-icon icon ni ni-map text-primary"></em>
                        </div>
                      </div>
                      <div className="card-text">
                        <p>Manage tour packages and itineraries</p>
                      </div>
                      <Link to="/tours/my-tours">
                        <Button color="primary" size="sm">
                          Manage Tours
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Col>
                <Col sm="12">
                  <Card className="card-bordered">
                    <div className="card-inner">
                      <div className="card-title-group align-start mb-3">
                        <div className="card-title">
                          <h6 className="title">Bookings</h6>
                        </div>
                        <div className="card-tools">
                          <em className="card-hint-icon icon ni ni-calendar-booking text-success"></em>
                        </div>
                      </div>
                      <div className="card-text">
                        <p>View and manage tour bookings</p>
                      </div>
                      <Link to="/tours/bookings">
                        <Button color="success" size="sm">
                          View Bookings
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Col>
                <Col sm="12">
                  <Card className="card-bordered">
                    <div className="card-inner">
                      <div className="card-title-group align-start mb-3">
                        <div className="card-title">
                          <h6 className="title">Analytics</h6>
                        </div>
                        <div className="card-tools">
                          <em className="card-hint-icon icon ni ni-bar-chart text-warning"></em>
                        </div>
                      </div>
                      <div className="card-text">
                        <p>View earnings and performance</p>
                      </div>
                      <Link to="/tours/earnings">
                        <Button color="warning" size="sm">
                          View Analytics
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Block>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default ToursDashboard;
