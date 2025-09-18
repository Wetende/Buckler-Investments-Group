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
  BlockBetween,
} from "@/components/Component";
import { Card, CardBody } from "reactstrap";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";
import { useBnbListings, useBnbBookings } from "@/hooks/useBnb";
import { toast } from "react-toastify";

const Calendar = () => {
  const [selectedProperty, setSelectedProperty] = useState('all');
  
  // Fetch listings for property selector
  const { data: listingsData } = useBnbListings({ status: 'active' });
  const listings = listingsData || [];

  // Fetch bookings for selected property
  const { data: bookingsData } = useBnbBookings({
    property_id: selectedProperty === 'all' ? undefined : selectedProperty,
    status: 'confirmed'
  });
  const bookings = bookingsData || [];

  const handleAvailabilityChange = async (updates) => {
    try {
      // This would call an API to update availability
      console.log('Updating availability:', updates);
      toast.success('Availability updated successfully!');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const selectedPropertyData = selectedProperty === 'all' 
    ? null 
    : listings.find(listing => listing.id === parseInt(selectedProperty));

  return (
    <React.Fragment>
      <Head title="Calendar & Availability" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Calendar & Availability</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage your property availability and view bookings.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="light" outline>
                  <Icon name="download" />
                  <span>Export Calendar</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            {/* Property Selector */}
            <Col lg="3">
              <Card className="card-bordered">
                <CardBody>
                  <BlockTitle tag="h6">Select Property</BlockTitle>
                  <div className="form-group">
                    <select 
                      className="form-select"
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                    >
                      <option value="all">All Properties</option>
                      {listings.map(listing => (
                        <option key={listing.id} value={listing.id}>
                          {listing.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPropertyData && (
                    <div className="property-info mt-4">
                      <div className="card card-bordered">
                        <div className="card-inner">
                          <h6 className="card-title">{selectedPropertyData.title}</h6>
                          <p className="text-muted small mb-2">{selectedPropertyData.location}</p>
                          
                          <div className="d-flex justify-content-between text-sm mb-2">
                            <span>Max Guests:</span>
                            <span>{selectedPropertyData.max_guests || selectedPropertyData.guests}</span>
                          </div>
                          
                          <div className="d-flex justify-content-between text-sm mb-2">
                            <span>Price/Night:</span>
                            <span className="text-success font-weight-bold">
                              KES {(selectedPropertyData.price_per_night || selectedPropertyData.price || 0).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="d-flex justify-content-between text-sm">
                            <span>Status:</span>
                            <span className={`badge badge-${selectedPropertyData.status === 'active' ? 'success' : 'warning'}`}>
                              {selectedPropertyData.status || 'draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="calendar-stats mt-4">
                    <BlockTitle tag="h6">Quick Stats</BlockTitle>
                    <div className="card card-bordered">
                      <div className="card-inner">
                        <div className="status-list">
                          <div className="status-item">
                            <div className="status-text">
                              <h6 className="status-num">{bookings.length}</h6>
                              <span className="status-text">Active Bookings</span>
                            </div>
                          </div>
                          <div className="status-item">
                            <div className="status-text">
                              <h6 className="status-num text-success">
                                {Math.round((bookings.length / 30) * 100)}%
                              </h6>
                              <span className="status-text">Occupancy Rate</span>
                            </div>
                          </div>
                          <div className="status-item">
                            <div className="status-text">
                              <h6 className="status-num text-info">
                                {selectedProperty === 'all' ? listings.length : 1}
                              </h6>
                              <span className="status-text">Properties</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Calendar */}
            <Col lg="9">
              {selectedProperty === 'all' ? (
                <Card className="card-bordered">
                  <CardBody>
                    <div className="text-center p-5">
                      <Icon name="calendar" style={{ fontSize: '4rem', color: '#e5e9f2' }} />
                      <h5 className="mt-3">Select a Property</h5>
                      <p className="text-muted">
                        Please select a specific property to view and manage its availability calendar.
                      </p>
                      {listings.length === 0 && (
                        <div className="mt-3">
                          <Button color="primary" onClick={() => window.location.href = '/dashboard/bnb/create-listing'}>
                            <Icon name="plus" className="mr-1" />
                            Create Your First Listing
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <AvailabilityCalendar
                  propertyId={selectedProperty}
                  bookings={bookings}
                  availability={[]} // This would come from API
                  onAvailabilityChange={handleAvailabilityChange}
                />
              )}
            </Col>
          </Row>
        </Block>

        {/* Quick Actions */}
        {selectedProperty !== 'all' && (
          <Block>
            <Card className="card-bordered">
              <CardBody>
                <BlockTitle tag="h6">Quick Actions</BlockTitle>
                <Row className="g-3">
                  <Col sm="6" md="3">
                    <Button color="light" outline block onClick={() => {
                      toast.info('Bulk pricing feature coming soon!');
                    }}>
                      <Icon name="money" className="mr-1" />
                      Set Seasonal Pricing
                    </Button>
                  </Col>
                  <Col sm="6" md="3">
                    <Button color="light" outline block onClick={() => {
                      toast.info('Auto-availability feature coming soon!');
                    }}>
                      <Icon name="repeat" className="mr-1" />
                      Auto Availability
                    </Button>
                  </Col>
                  <Col sm="6" md="3">
                    <Button color="light" outline block onClick={() => {
                      toast.info('iCal sync feature coming soon!');
                    }}>
                      <Icon name="link" className="mr-1" />
                      Sync iCal
                    </Button>
                  </Col>
                  <Col sm="6" md="3">
                    <Button color="light" outline block onClick={() => {
                      toast.info('Minimum stay feature coming soon!');
                    }}>
                      <Icon name="clock" className="mr-1" />
                      Minimum Stay Rules
                    </Button>
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

export default Calendar;
