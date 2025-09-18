import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  Badge,
} from "@/components/Component";
import { Card, CardBody } from "reactstrap";
import { useVehicles, useCarRentals, useCarEarnings } from "../hooks/useCars";

const CarsDashboard = () => {
  const [sm, updateSm] = useState(false);

  // Get real data from APIs
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles({ owner_id: 1 }); // TODO: Get from auth
  const { data: rentals = [], isLoading: rentalsLoading } = useCarRentals({ limit: 10 });
  const { data: earnings = { total: 0, monthly: 0 }, isLoading: earningsLoading } = useCarEarnings();

  // Calculate real metrics from API data
  const carsMetrics = React.useMemo(() => {
    const totalVehicles = vehicles.length;
    const activeRentals = rentals.filter(rental => rental.status === 'active').length;
    const availableVehicles = vehicles.filter(vehicle => vehicle.status === 'available').length;
    const inMaintenanceVehicles = vehicles.filter(vehicle => vehicle.status === 'maintenance').length;
    
    // Calculate utilization rate
    const fleetUtilization = totalVehicles > 0 ? ((totalVehicles - availableVehicles) / totalVehicles * 100).toFixed(1) : 0;
    
    // Find most popular category
    const categoryCount = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.category] = (acc[vehicle.category] || 0) + 1;
      return acc;
    }, {});
    const popularCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, 'N/A');

    return {
      totalVehicles,
      activeRentals,
      totalRevenue: earnings.total || 0,
      fleetUtilization: parseFloat(fleetUtilization),
      maintenanceAlerts: inMaintenanceVehicles,
      popularCategory
    };
  }, [vehicles, rentals, earnings]);

  // Get recent rentals (already from API)
  const recentRentals = rentals.slice(0, 5);

  // Calculate fleet status by category
  const fleetStatus = React.useMemo(() => {
    const categories = ['economy', 'compact', 'luxury', 'suv'];
    return categories.map(category => {
      const categoryVehicles = vehicles.filter(v => v.category === category);
      const total = categoryVehicles.length;
      const available = categoryVehicles.filter(v => v.status === 'available').length;
      const rented = categoryVehicles.filter(v => v.status === 'rented').length;
      const maintenance = categoryVehicles.filter(v => v.status === 'maintenance').length;
      
      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        total,
        available,
        rented,
        maintenance
      };
    }).filter(item => item.total > 0); // Only show categories with vehicles
  }, [vehicles]);

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
                      <Button color="primary" className="btn-white" tag={Link} to="/cars/add-vehicle">
                        <Icon name="plus" />
                        <span>Add Vehicle</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" className="btn-outline-light btn-white" tag={Link} to="/cars/my-vehicles">
                        <Icon name="eye" />
                        <span>View All Vehicles</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" className="btn-outline-light btn-white" tag={Link} to="/cars/rentals">
                        <Icon name="calendar" />
                        <span>View Rentals</span>
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
                  {rentalsLoading && (
                    <div className="nk-tb-item">
                      <div className="nk-tb-col">
                        <span>Loading rentals...</span>
                      </div>
                    </div>
                  )}
                  
                  {!rentalsLoading && recentRentals.length === 0 && (
                    <div className="nk-tb-item">
                      <div className="nk-tb-col">
                        <span className="text-muted">No recent rentals found.</span>
                      </div>
                    </div>
                  )}
                  
                  {!rentalsLoading && recentRentals.map((rental) => {
                    // Calculate duration
                    const startDate = new Date(rental.pickup_date);
                    const endDate = new Date(rental.return_date);
                    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={rental.id} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <div className="user-card">
                            <div className="user-avatar bg-success">
                              <span>R{rental.renter_id}</span>
                            </div>
                            <div className="user-info">
                              <span className="tb-lead">Renter #{rental.renter_id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="nk-tb-col tb-col-mb">
                          <span className="tb-amount">Vehicle #{rental.vehicle_id}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{startDate.toLocaleDateString()}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{duration} days</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span className="tb-amount">
                            {rental.currency} {Number(rental.total_cost || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <Badge color={
                            rental.status === 'active' ? 'success' :
                            rental.status === 'confirmed' ? 'info' :
                            rental.status === 'pending' ? 'warning' :
                            rental.status === 'completed' ? 'light' : 'danger'
                          } outline>
                            {rental.status}
                          </Badge>
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
                    );
                  })}
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
