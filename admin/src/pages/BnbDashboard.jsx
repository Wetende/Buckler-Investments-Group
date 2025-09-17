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

const BnbDashboard = () => {
  const [sm, updateSm] = useState(false);

  // Mock data for BnB metrics
  const bnbMetrics = {
    totalListings: 342,
    activeBookings: 89,
    totalRevenue: 450000,
    occupancyRate: 78.5,
    averageRating: 4.6,
    newHosts: 12
  };

  const recentBookings = [
    { id: 1, guest: "John Doe", property: "Beachfront Villa", checkIn: "2024-01-15", amount: 15000, status: "confirmed" },
    { id: 2, guest: "Jane Smith", property: "City Apartment", checkIn: "2024-01-16", amount: 8500, status: "pending" },
    { id: 3, guest: "Mike Johnson", property: "Safari Lodge", checkIn: "2024-01-18", amount: 22000, status: "confirmed" },
  ];

  return (
    <>
      <Head title="BnB Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                BnB Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage short-term rentals, hosts, and bookings</p>
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
                        <span>Add Listing</span>
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

        {/* BnB Metrics Cards */}
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Listings</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-home-fill text-primary"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{bnbMetrics.totalListings}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      12.8%
                    </span>
                  </div>
                  <div className="card-amount-sm">Active properties on platform</div>
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
                    <span className="amount">{bnbMetrics.activeBookings}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      8.5%
                    </span>
                  </div>
                  <div className="card-amount-sm">Current confirmed bookings</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Revenue</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-coins text-success"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">KES {bnbMetrics.totalRevenue.toLocaleString()}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      15.2%
                    </span>
                  </div>
                  <div className="card-amount-sm">This month's earnings</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Occupancy Rate</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-growth text-warning"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{bnbMetrics.occupancyRate}%</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      3.2%
                    </span>
                  </div>
                  <div className="card-amount-sm">Average across all properties</div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Recent Bookings Table */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Recent Bookings</BlockTitle>
              <p className="text-soft">Latest booking activity across all BnB properties</p>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <div className="nk-tb-list nk-tb-ulist">
                  <div className="nk-tb-item nk-tb-head">
                    <div className="nk-tb-col"><span className="sub-text">Guest</span></div>
                    <div className="nk-tb-col tb-col-mb"><span className="sub-text">Property</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Check-in</span></div>
                    <div className="nk-tb-col tb-col-lg"><span className="sub-text">Amount</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Status</span></div>
                    <div className="nk-tb-col nk-tb-col-tools text-right">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="nk-tb-item">
                      <div className="nk-tb-col">
                        <div className="user-card">
                          <div className="user-avatar bg-primary">
                            <span>{booking.guest.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="user-info">
                            <span className="tb-lead">{booking.guest}</span>
                          </div>
                        </div>
                      </div>
                      <div className="nk-tb-col tb-col-mb">
                        <span className="tb-amount">{booking.property}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span>{booking.checkIn}</span>
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

        {/* Quick Actions */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Quick Actions</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Row className="g-3">
            <Col sm="6" lg="4">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Manage Listings</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-home-fill text-primary"></em>
                    </div>
                  </div>
                  <div className="card-text">
                    <p>Add, edit, or remove BnB property listings</p>
                  </div>
                  <Button color="primary" size="sm">
                    Go to Listings
                  </Button>
                </div>
              </Card>
            </Col>
            <Col sm="6" lg="4">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Booking Management</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-calendar-booking text-info"></em>
                    </div>
                  </div>
                  <div className="card-text">
                    <p>View and manage all booking requests</p>
                  </div>
                  <Button color="info" size="sm">
                    View Bookings
                  </Button>
                </div>
              </Card>
            </Col>
            <Col sm="6" lg="4">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Host Management</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-users-fill text-success"></em>
                    </div>
                  </div>
                  <div className="card-text">
                    <p>Manage hosts and their performance</p>
                  </div>
                  <Button color="success" size="sm">
                    Manage Hosts
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default BnbDashboard;
