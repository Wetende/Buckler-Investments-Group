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
import { useVehicles, useDeleteVehicle } from "../../hooks/useCars";

const MyVehicles = () => {
  const [sm, updateSm] = useState(false);
  
  // Get vehicles from API
  const { data: vehicles = [], isLoading, error } = useVehicles({ owner_id: 1 }); // TODO: Get owner_id from auth
  const deleteVehicle = useDeleteVehicle();

  // Calculate metrics from real data
  const metrics = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'available').length,
    totalRentals: vehicles.reduce((sum, v) => sum + (v.rentals || 0), 0),
    totalEarnings: vehicles.reduce((sum, v) => sum + (v.earnings || 0), 0),
    averageRating: vehicles.length > 0 ? (vehicles.reduce((sum, v) => sum + (v.rating || 0), 0) / vehicles.length).toFixed(1) : '0.0'
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle.mutateAsync(vehicleId);
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'rented': return 'info';
      case 'maintenance': return 'warning';
      case 'inactive': return 'secondary';
      default: return 'light';
    }
  };

  return (
    <React.Fragment>
      <Head title="My Vehicles" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>My Vehicles</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage your vehicle fleet and track rental performance.</p>
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
                    <li className="nk-block-tools-opt">
                      <Button color="primary" tag={Link} to="/cars/add-vehicle">
                        <Icon name="plus"></Icon>
                        <span>Add Vehicle</span>
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
                      <h6 className="subtitle">Total Vehicles</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="truck" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalVehicles}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Available</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="check-circle" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.availableVehicles}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Rentals</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="calendar" className="card-hint-icon text-info"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalRentals}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Earnings</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="coins" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.totalEarnings)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Vehicles Table */}
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Vehicle</span>
                </DataTableRow>
                <DataTableRow size="mb">
                  <span className="sub-text">Details</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Daily Rate</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Performance</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <span className="sub-text">Action</span>
                </DataTableRow>
              </DataTableHead>
              {isLoading && (
                <DataTableItem>
                  <DataTableRow>
                    <span>Loading vehicles...</span>
                  </DataTableRow>
                </DataTableItem>
              )}
              
              {error && (
                <DataTableItem>
                  <DataTableRow>
                    <span className="text-danger">Error loading vehicles: {error.message}</span>
                  </DataTableRow>
                </DataTableItem>
              )}
              
              {!isLoading && !error && vehicles.length === 0 && (
                <DataTableItem>
                  <DataTableRow>
                    <span className="text-muted">No vehicles found. <Link to="/cars/add-vehicle">Add your first vehicle</Link></span>
                  </DataTableRow>
                </DataTableItem>
              )}
              
              {!isLoading && !error && vehicles.map((vehicle) => (
                <DataTableItem key={vehicle.id}>
                  <DataTableRow>
                    <div className="user-card">
                      <UserAvatar 
                        theme="primary" 
                        text={`${vehicle.make.charAt(0)}${vehicle.model.charAt(0)}`}
                        image={vehicle.images && vehicle.images[0]}
                      />
                      <div className="user-info">
                        <span className="tb-lead">{vehicle.make} {vehicle.model}</span>
                        <span className="sub-text">{vehicle.year} • {vehicle.location || 'Location not set'}</span>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <div>
                      <div className="tb-sub">
                        <Icon name="truck" className="mr-1"></Icon>
                        {vehicle.category || 'N/A'} • {vehicle.transmission || 'N/A'}
                      </div>
                      <div className="tb-sub">
                        <Icon name="users" className="mr-1"></Icon>
                        {vehicle.seats} seats • {vehicle.fuel_type || 'N/A'}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <span className="tb-amount">
                        {vehicle.daily_rate ? `KES ${vehicle.daily_rate.toLocaleString()}` : 'N/A'}
                      </span>
                      <div className="tb-sub text-muted">per day</div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <div className="tb-sub">
                        <Icon name="star-fill" className="text-warning mr-1"></Icon>
                        {vehicle.rating || 0} • {vehicle.rentals || 0} rentals
                      </div>
                      <div className="tb-sub text-success">
                        {vehicle.earnings ? `KES ${vehicle.earnings.toLocaleString()}` : 'KES 0'} earned
                      </div>
                      <div className="tb-sub text-muted small">
                        {vehicle.last_rented || 'Never rented'}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <Badge color={getStatusColor(vehicle.status)}>
                      {vehicle.status}
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
                                <DropdownItem tag="a" href="#edit">
                                  <Icon name="edit"></Icon>
                                  <span>Edit Vehicle</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem tag="a" href="#view">
                                  <Icon name="eye"></Icon>
                                  <span>View Details</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem 
                                  tag={Link} 
                                  to={`/cars/vehicle/${vehicle.id}/schedule`}
                                >
                                  <Icon name="calendar"></Icon>
                                  <span>Manage Schedule</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem 
                                  tag="a" 
                                  href="#delete"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteVehicle(vehicle.id);
                                  }}
                                  className="text-danger"
                                >
                                  <Icon name="trash"></Icon>
                                  <span>Delete Vehicle</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </li>
                    </ul>
                  </DataTableRow>
                </DataTableItem>
              ))}
            </DataTableBody>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default MyVehicles;


