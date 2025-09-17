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

const ToursDashboard = () => {
  const [sm, updateSm] = useState(false);

  // Mock data for Tours metrics
  const toursMetrics = {
    totalPackages: 156,
    activeBookings: 67,
    totalRevenue: 890000,
    averageRating: 4.8,
    tourOperators: 45,
    popularDestination: "Maasai Mara"
  };

  const recentTourBookings = [
    { id: 1, client: "Sarah Wilson", tour: "3-Day Safari Package", startDate: "2024-01-20", amount: 45000, status: "confirmed" },
    { id: 2, client: "David Brown", tour: "Cultural Heritage Tour", startDate: "2024-01-22", amount: 12000, status: "pending" },
    { id: 3, client: "Lisa Garcia", tour: "Mountain Climbing Adventure", startDate: "2024-01-25", amount: 35000, status: "confirmed" },
  ];

  const popularTours = [
    { name: "Maasai Mara Safari", bookings: 34, revenue: 320000 },
    { name: "Mount Kenya Hiking", bookings: 28, revenue: 210000 },
    { name: "Coastal Cultural Tour", bookings: 22, revenue: 165000 },
    { name: "Samburu Game Drive", bookings: 19, revenue: 142000 },
  ];

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
                      <Button color="primary" className="btn-white">
                        <Icon name="plus" />
                        <span>Add Tour Package</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" className="btn-outline-light btn-white">
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
                            <span>{booking.client.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="user-info">
                            <span className="tb-lead">{booking.client}</span>
                          </div>
                        </div>
                      </div>
                      <div className="nk-tb-col tb-col-mb">
                        <span className="tb-amount">{booking.tour}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span>{booking.startDate}</span>
                      </div>
                      <div className="nk-tb-col tb-col-lg">
                        <span className="tb-amount">KES {booking.amount.toLocaleString()}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span className={`badge badge-outline-${booking.status === 'confirmed' ? 'success' : 'warning'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="nk-tb-col nk-tb-col-tools">
                        <ul className="nk-tb-actions gx-1">
                          <li>
                            <Button size="sm" color="primary" outline>
                              <Icon name="eye" />
                            </Button>
                          </li>
                          <li>
                            <Button size="sm" color="light" outline>
                              <Icon name="edit" />
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <BlockTitle tag="h6">Popular Tour Packages</BlockTitle>
                  <p className="text-soft">Top performing tours by bookings and revenue</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="nk-tb-list nk-tb-ulist">
                    <div className="nk-tb-item nk-tb-head">
                      <div className="nk-tb-col"><span className="sub-text">Tour Name</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">Bookings</span></div>
                      <div className="nk-tb-col tb-col-lg"><span className="sub-text">Revenue</span></div>
                    </div>
                    {popularTours.map((tour, index) => (
                      <div key={index} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <span className="tb-lead">{tour.name}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-amount">{tour.bookings}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span className="tb-amount">KES {tour.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <Button color="primary" size="sm">
                        Manage Tours
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col sm="12">
                  <Card className="card-bordered">
                    <div className="card-inner">
                      <div className="card-title-group align-start mb-3">
                        <div className="card-title">
                          <h6 className="title">Tour Operators</h6>
                        </div>
                        <div className="card-tools">
                          <em className="card-hint-icon icon ni ni-users-fill text-success"></em>
                        </div>
                      </div>
                      <div className="card-text">
                        <p>View and manage tour operators</p>
                      </div>
                      <Button color="success" size="sm">
                        View Operators
                      </Button>
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
