import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import {
  Block,
  BlockHead,
  BlockContent,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Button,
  Icon,
  Row,
  Col,
} from "@/components/Component";
import { Card, CardBody } from "reactstrap";
import VehicleAvailabilityCalendar from "../../components/calendar/VehicleAvailabilityCalendar";
import { useVehicle, useCarRentals } from "../../hooks/useCars";

const VehicleSchedule = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // Get vehicle details
  const { data: vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicle(vehicleId);
  
  // Get rental statistics
  const { data: rentals = [] } = useCarRentals({ vehicle_id: vehicleId });

  const handleDateSelect = (startDate, endDate, isAvailable) => {
    setSelectedDateRange({
      start: startDate,
      end: endDate,
      available: isAvailable
    });
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const thisMonthRentals = rentals.filter(rental => {
      const pickupDate = new Date(rental.pickup_date);
      return pickupDate >= thisMonth && pickupDate < nextMonth;
    });

    const activeRentals = rentals.filter(rental => rental.status === 'active').length;
    const upcomingRentals = rentals.filter(rental => {
      const pickupDate = new Date(rental.pickup_date);
      return rental.status === 'confirmed' && pickupDate > now;
    }).length;

    const totalEarnings = rentals
      .filter(rental => rental.status === 'completed')
      .reduce((sum, rental) => sum + (rental.total_cost || 0), 0);

    const thisMonthEarnings = thisMonthRentals
      .filter(rental => rental.status === 'completed')
      .reduce((sum, rental) => sum + (rental.total_cost || 0), 0);

    return {
      totalRentals: rentals.length,
      activeRentals,
      upcomingRentals,
      thisMonthRentals: thisMonthRentals.length,
      totalEarnings,
      thisMonthEarnings
    };
  }, [rentals]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (vehicleLoading) {
    return (
      <React.Fragment>
        <Head title="Vehicle Schedule" />
        <Content>
          <div className="d-flex justify-content-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </Content>
      </React.Fragment>
    );
  }

  if (vehicleError || !vehicle) {
    return (
      <React.Fragment>
        <Head title="Vehicle Schedule" />
        <Content>
          <Block>
            <div className="alert alert-danger">
              <h6>Error</h6>
              <p>Vehicle not found or failed to load.</p>
              <Button color="primary" onClick={() => navigate("/cars/my-vehicles")}>
                Back to Vehicles
              </Button>
            </div>
          </Block>
        </Content>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Head title={`${vehicle.make} ${vehicle.model} - Schedule`} />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>
                {vehicle.make} {vehicle.model} - Schedule Management
              </BlockTitle>
              <div className="nk-block-des text-soft">
                <p>Manage bookings and availability for your vehicle.</p>
              </div>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="light" outline onClick={() => navigate("/cars/my-vehicles")}>
                  <Icon name="arrow-left" />
                  <span>Back to Vehicles</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Vehicle Info Card */}
        <Block>
          <Card className="card-bordered">
            <CardBody>
              <Row className="g-3">
                <Col md="8">
                  <div className="vehicle-info">
                    <h5>{vehicle.make} {vehicle.model} ({vehicle.year})</h5>
                    <div className="d-flex flex-wrap text-soft">
                      <span className="mr-3">
                        <Icon name="truck" className="mr-1" />
                        {vehicle.category} • {vehicle.transmission}
                      </span>
                      <span className="mr-3">
                        <Icon name="users" className="mr-1" />
                        {vehicle.seats} seats
                      </span>
                      <span className="mr-3">
                        <Icon name="map-pin" className="mr-1" />
                        {vehicle.location}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md="4">
                  <div className="text-md-right">
                    <div className="amount-lg text-primary">
                      {formatCurrency(vehicle.daily_rate)}
                    </div>
                    <div className="text-soft">per day</div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Block>

        {/* Statistics Cards */}
        <Block>
          <Row className="g-gs">
            <Col md="3" sm="6">
              <Card className="card-bordered h-100">
                <CardBody>
                  <div className="nk-wg-card">
                    <div className="nk-wg-card-head">
                      <div className="nk-wg-card-title">
                        <h6 className="title">Total Rentals</h6>
                      </div>
                    </div>
                    <div className="nk-wg-card-body">
                      <div className="amount">{stats.totalRentals}</div>
                      <div className="text-soft">All time</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3" sm="6">
              <Card className="card-bordered h-100">
                <CardBody>
                  <div className="nk-wg-card">
                    <div className="nk-wg-card-head">
                      <div className="nk-wg-card-title">
                        <h6 className="title">Active Rentals</h6>
                      </div>
                    </div>
                    <div className="nk-wg-card-body">
                      <div className="amount text-info">{stats.activeRentals}</div>
                      <div className="text-soft">Currently rented</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3" sm="6">
              <Card className="card-bordered h-100">
                <CardBody>
                  <div className="nk-wg-card">
                    <div className="nk-wg-card-head">
                      <div className="nk-wg-card-title">
                        <h6 className="title">Upcoming</h6>
                      </div>
                    </div>
                    <div className="nk-wg-card-body">
                      <div className="amount text-warning">{stats.upcomingRentals}</div>
                      <div className="text-soft">Confirmed bookings</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3" sm="6">
              <Card className="card-bordered h-100">
                <CardBody>
                  <div className="nk-wg-card">
                    <div className="nk-wg-card-head">
                      <div className="nk-wg-card-title">
                        <h6 className="title">Total Earnings</h6>
                      </div>
                    </div>
                    <div className="nk-wg-card-body">
                      <div className="amount text-success">{formatCurrency(stats.totalEarnings)}</div>
                      <div className="text-soft">All time</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Calendar */}
        <Block>
          <Card className="card-bordered">
            <CardBody>
              <VehicleAvailabilityCalendar
                vehicleId={vehicleId}
                vehicleName={`${vehicle.make} ${vehicle.model}`}
                onDateSelect={handleDateSelect}
              />
            </CardBody>
          </Card>
        </Block>

        {/* Selected Date Info */}
        {selectedDateRange && (
          <Block>
            <Card className="card-bordered">
              <CardBody>
                <h6 className="title mb-3">Selected Date Range</h6>
                <Row className="g-3">
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <div className="form-control-static">
                        {selectedDateRange.start.toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <div className="form-control-static">
                        {selectedDateRange.end.toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="form-group">
                      <label className="form-label">Availability Status</label>
                      <div>
                        <span className={`badge badge-${selectedDateRange.available ? 'success' : 'warning'}`}>
                          {selectedDateRange.available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Block>
        )}
      </Content>
    </React.Fragment>
  );
};

export default VehicleSchedule;
