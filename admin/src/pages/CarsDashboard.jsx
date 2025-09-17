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

const CarsDashboard = () => {
  const [sm, updateSm] = useState(false);

  // Mock data for Cars metrics
  const carsMetrics = {
    totalVehicles: 145,
    activeRentals: 67,
    totalRevenue: 340000,
    fleetUtilization: 72.8,
    maintenanceAlerts: 8,
    popularCategory: "SUV"
  };

  const recentRentals = [
    { id: 1, client: "Mark Stevens", vehicle: "Toyota Prado - KCB 123A", startDate: "2024-01-15", duration: 5, amount: 25000, status: "active" },
    { id: 2, client: "Emma Wilson", vehicle: "Honda CRV - KCA 456B", startDate: "2024-01-16", duration: 3, amount: 18000, status: "pending" },
    { id: 3, client: "Tom Anderson", vehicle: "Land Cruiser - KCC 789C", startDate: "2024-01-18", duration: 7, amount: 42000, status: "active" },
  ];

  const fleetStatus = [
    { category: "Economy", total: 45, available: 32, rented: 13, maintenance: 0 },
    { category: "SUV", total: 38, available: 24, rented: 12, maintenance: 2 },
    { category: "Luxury", total: 28, available: 18, rented: 8, maintenance: 2 },
    { category: "Van/Bus", total: 34, available: 26, rented: 6, maintenance: 2 },
  ];

  const popularRoutes = [
    { route: "Nairobi - Mombasa", bookings: 45, revenue: 180000 },
    { route: "Nairobi - Nakuru", bookings: 32, revenue: 96000 },
    { route: "City Tours", bookings: 28, revenue: 84000 },
    { route: "Airport Transfers", bookings: 67, revenue: 134000 },
  ];

  return (
    <>
      <Head title="Cars Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Cars Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage vehicle fleet, rentals, and maintenance</p>
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
                        <span>Add Vehicle</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" className="btn-outline-light btn-white">
                        <Icon name="download-cloud" />
                        <span>Fleet Report</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Cars Metrics Cards */}
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Vehicles</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-truck text-primary"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{carsMetrics.totalVehicles}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      8.2%
                    </span>
                  </div>
                  <div className="card-amount-sm">Vehicles in fleet</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Rentals</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-calendar-booking text-info"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{carsMetrics.activeRentals}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      15.7%
                    </span>
                  </div>
                  <div className="card-amount-sm">Currently rented vehicles</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Rental Revenue</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-coins text-success"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">KES {carsMetrics.totalRevenue.toLocaleString()}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      22.1%
                    </span>
                  </div>
                  <div className="card-amount-sm">This month's rental income</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Fleet Utilization</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-growth text-warning"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{carsMetrics.fleetUtilization}%</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      5.3%
                    </span>
                  </div>
                  <div className="card-amount-sm">Average utilization rate</div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Recent Rentals */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Recent Car Rentals</BlockTitle>
              <p className="text-soft">Latest vehicle rental activity and bookings</p>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <div className="nk-tb-list nk-tb-ulist">
                  <div className="nk-tb-item nk-tb-head">
                    <div className="nk-tb-col"><span className="sub-text">Client</span></div>
                    <div className="nk-tb-col tb-col-mb"><span className="sub-text">Vehicle</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Start Date</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Duration</span></div>
                    <div className="nk-tb-col tb-col-lg"><span className="sub-text">Amount</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Status</span></div>
                    <div className="nk-tb-col nk-tb-col-tools text-right">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {recentRentals.map((rental) => (
                    <div key={rental.id} className="nk-tb-item">
                      <div className="nk-tb-col">
                        <div className="user-card">
                          <div className="user-avatar bg-success">
                            <span>{rental.client.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="user-info">
                            <span className="tb-lead">{rental.client}</span>
                          </div>
                        </div>
                      </div>
                      <div className="nk-tb-col tb-col-mb">
                        <span className="tb-amount">{rental.vehicle}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span>{rental.startDate}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span>{rental.duration} days</span>
                      </div>
                      <div className="nk-tb-col tb-col-lg">
                        <span className="tb-amount">KES {rental.amount.toLocaleString()}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span className={`badge badge-outline-${rental.status === 'active' ? 'success' : 'warning'}`}>
                          {rental.status}
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

        {/* Fleet Status and Popular Routes */}
        <Row className="g-gs">
          <Col lg="7">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Fleet Status by Category</BlockTitle>
                  <p className="text-soft">Vehicle availability and maintenance status</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="nk-tb-list nk-tb-ulist">
                    <div className="nk-tb-item nk-tb-head">
                      <div className="nk-tb-col"><span className="sub-text">Category</span></div>
                      <div className="nk-tb-col tb-col-sm"><span className="sub-text">Total</span></div>
                      <div className="nk-tb-col tb-col-sm"><span className="sub-text">Available</span></div>
                      <div className="nk-tb-col tb-col-sm"><span className="sub-text">Rented</span></div>
                      <div className="nk-tb-col tb-col-sm"><span className="sub-text">Maintenance</span></div>
                    </div>
                    {fleetStatus.map((fleet, index) => (
                      <div key={index} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <span className="tb-lead">{fleet.category}</span>
                        </div>
                        <div className="nk-tb-col tb-col-sm">
                          <span className="tb-amount">{fleet.total}</span>
                        </div>
                        <div className="nk-tb-col tb-col-sm">
                          <span className="tb-amount text-success">{fleet.available}</span>
                        </div>
                        <div className="nk-tb-col tb-col-sm">
                          <span className="tb-amount text-primary">{fleet.rented}</span>
                        </div>
                        <div className="nk-tb-col tb-col-sm">
                          <span className={`tb-amount ${fleet.maintenance > 0 ? 'text-warning' : 'text-soft'}`}>
                            {fleet.maintenance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Block>
          </Col>

          <Col lg="5">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Popular Routes</BlockTitle>
                  <p className="text-soft">Top rental destinations and revenue</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="nk-tb-list nk-tb-ulist">
                    <div className="nk-tb-item nk-tb-head">
                      <div className="nk-tb-col"><span className="sub-text">Route</span></div>
                      <div className="nk-tb-col tb-col-sm text-right"><span className="sub-text">Bookings</span></div>
                      <div className="nk-tb-col tb-col-md text-right"><span className="sub-text">Revenue</span></div>
                    </div>
                    {popularRoutes.map((route, index) => (
                      <div key={index} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <span className="tb-lead">{route.route}</span>
                        </div>
                        <div className="nk-tb-col tb-col-sm text-right">
                          <span className="tb-amount">{route.bookings}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md text-right">
                          <span className="tb-amount">KES {route.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Block>
          </Col>
        </Row>

        {/* Maintenance Alerts and Quick Actions */}
        <Row className="g-gs">
          <Col lg="4">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Maintenance Alerts</BlockTitle>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="alert alert-warning" role="alert">
                    <div className="alert-cta">
                      <h6>{carsMetrics.maintenanceAlerts} vehicles need attention</h6>
                      <span>Schedule maintenance to avoid downtime</span>
                    </div>
                  </div>
                  <Button color="warning" size="sm" className="w-100">
                    View Maintenance Schedule
                  </Button>
                </div>
              </Card>
            </Block>
          </Col>

          <Col lg="8">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Quick Actions</BlockTitle>
                </BlockHeadContent>
              </BlockHead>
              <Row className="g-3">
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-truck text-primary" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Fleet Management</h6>
                      <Button color="primary" size="sm">
                        Manage Fleet
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-calendar-booking text-info" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Rental Bookings</h6>
                      <Button color="info" size="sm">
                        View Bookings
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-setting text-warning" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Maintenance</h6>
                      <Button color="warning" size="sm">
                        Schedule Service
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-growth text-success" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Analytics</h6>
                      <Button color="success" size="sm">
                        View Reports
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

export default CarsDashboard;
