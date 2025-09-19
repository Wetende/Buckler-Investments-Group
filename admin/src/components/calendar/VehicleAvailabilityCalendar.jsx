import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Icon, Row, Col } from '@/components/Component';
import { Modal, ModalBody } from 'reactstrap';
import { useCarRentals, useCheckAvailability } from '../../hooks/useCars';
import { toast } from 'react-toastify';

const localizer = momentLocalizer(moment);

const VehicleAvailabilityCalendar = ({ 
  vehicleId, 
  vehicleName = "Vehicle",
  onDateSelect,
  className = ""
}) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSlotModal, setShowSlotModal] = useState(false);

  // Get rentals for this vehicle
  const { data: rentals = [], isLoading } = useCarRentals({ vehicle_id: vehicleId });
  const checkAvailability = useCheckAvailability();

  // Convert rentals to calendar events
  useEffect(() => {
    if (rentals && rentals.length > 0) {
      const calendarEvents = rentals.map(rental => ({
        id: rental.id,
        title: getEventTitle(rental),
        start: new Date(rental.pickup_date),
        end: new Date(rental.return_date),
        resource: rental,
        allDay: false,
        status: rental.status
      }));
      setEvents(calendarEvents);
    }
  }, [rentals]);

  const getEventTitle = (rental) => {
    switch (rental.status) {
      case 'pending':
        return `⏳ Pending Booking`;
      case 'confirmed':
        return `✅ Confirmed Rental`;
      case 'active':
        return `🚗 Active Rental`;
      case 'completed':
        return `✓ Completed`;
      case 'cancelled':
        return `❌ Cancelled`;
      default:
        return `Rental #${rental.id}`;
    }
  };

  const getEventStyle = (event) => {
    const baseStyle = {
      borderRadius: '4px',
      border: 'none',
      padding: '2px 4px',
      fontSize: '12px'
    };

    switch (event.status) {
      case 'pending':
        return { ...baseStyle, backgroundColor: '#ffc107', color: '#000' };
      case 'confirmed':
        return { ...baseStyle, backgroundColor: '#28a745', color: '#fff' };
      case 'active':
        return { ...baseStyle, backgroundColor: '#007bff', color: '#fff' };
      case 'completed':
        return { ...baseStyle, backgroundColor: '#6c757d', color: '#fff' };
      case 'cancelled':
        return { ...baseStyle, backgroundColor: '#dc3545', color: '#fff' };
      default:
        return { ...baseStyle, backgroundColor: '#17a2b8', color: '#fff' };
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleSelectSlot = async (slotInfo) => {
    // Check if the selected dates are available
    try {
      const availabilityCheck = await checkAvailability.mutateAsync({
        vehicle_id: vehicleId,
        start_date: slotInfo.start.toISOString(),
        end_date: slotInfo.end.toISOString()
      });

      setSelectedSlot({
        start: slotInfo.start,
        end: slotInfo.end,
        available: availabilityCheck.available,
        conflictingRentals: availabilityCheck.conflicting_rentals || []
      });
      setShowSlotModal(true);

      // Notify parent component if provided
      if (onDateSelect) {
        onDateSelect(slotInfo.start, slotInfo.end, availabilityCheck.available);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      toast.error('Failed to check availability');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDateTime = (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm A');
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="calendar-toolbar d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
      <div className="calendar-nav">
        <Button size="sm" color="light" onClick={() => onNavigate('PREV')}>
          <Icon name="chevron-left" />
        </Button>
        <span className="mx-3 font-weight-bold">{label}</span>
        <Button size="sm" color="light" onClick={() => onNavigate('NEXT')}>
          <Icon name="chevron-right" />
        </Button>
      </div>
      <div className="calendar-views">
        <Button size="sm" color="primary" outline onClick={() => onView('month')}>
          Month
        </Button>
        <Button size="sm" color="primary" outline onClick={() => onView('week')} className="ml-1">
          Week
        </Button>
        <Button size="sm" color="primary" outline onClick={() => onView('day')} className="ml-1">
          Day
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`availability-calendar ${className}`}>
        <div className="d-flex justify-content-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading calendar...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`availability-calendar ${className}`}>
      <div className="calendar-header mb-3">
        <h5 className="title">{vehicleName} - Availability Calendar</h5>
        <div className="calendar-legend d-flex flex-wrap">
          <div className="legend-item d-flex align-items-center mr-3 mb-2">
            <div className="legend-color" style={{ backgroundColor: '#28a745', width: '12px', height: '12px', marginRight: '4px' }}></div>
            <small>Confirmed</small>
          </div>
          <div className="legend-item d-flex align-items-center mr-3 mb-2">
            <div className="legend-color" style={{ backgroundColor: '#ffc107', width: '12px', height: '12px', marginRight: '4px' }}></div>
            <small>Pending</small>
          </div>
          <div className="legend-item d-flex align-items-center mr-3 mb-2">
            <div className="legend-color" style={{ backgroundColor: '#007bff', width: '12px', height: '12px', marginRight: '4px' }}></div>
            <small>Active</small>
          </div>
          <div className="legend-item d-flex align-items-center mr-3 mb-2">
            <div className="legend-color" style={{ backgroundColor: '#6c757d', width: '12px', height: '12px', marginRight: '4px' }}></div>
            <small>Completed</small>
          </div>
        </div>
      </div>

      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          defaultView="month"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={(event) => ({ style: getEventStyle(event) })}
          components={{
            toolbar: CustomToolbar
          }}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
          }}
        />
      </div>

      {/* Event Details Modal */}
      <Modal isOpen={showEventModal} toggle={() => setShowEventModal(false)} size="lg">
        <ModalBody>
          <a 
            href="#close" 
            onClick={(e) => {
              e.preventDefault();
              setShowEventModal(false);
            }} 
            className="close"
          >
            <Icon name="cross-sm" />
          </a>
          {selectedEvent && (
            <div className="p-2">
              <h5 className="title mb-3">Rental Details</h5>
              <Row className="g-3">
                <Col sm="6">
                  <div className="form-group">
                    <label className="form-label">Rental ID</label>
                    <div className="form-control-static">#{selectedEvent.resource.id}</div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <div>
                      <span className={`badge badge-${
                        selectedEvent.resource.status === 'confirmed' ? 'success' :
                        selectedEvent.resource.status === 'pending' ? 'warning' :
                        selectedEvent.resource.status === 'active' ? 'info' :
                        selectedEvent.resource.status === 'cancelled' ? 'danger' : 'secondary'
                      }`}>
                        {selectedEvent.resource.status}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="form-group">
                    <label className="form-label">Pickup Date</label>
                    <div className="form-control-static">{formatDateTime(selectedEvent.start)}</div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="form-group">
                    <label className="form-label">Return Date</label>
                    <div className="form-control-static">{formatDateTime(selectedEvent.end)}</div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="form-group">
                    <label className="form-label">Total Cost</label>
                    <div className="form-control-static font-weight-bold">
                      {formatCurrency(selectedEvent.resource.total_cost)}
                    </div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <div className="form-control-static">
                      {moment(selectedEvent.end).diff(moment(selectedEvent.start), 'days')} days
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Date Selection Modal */}
      <Modal isOpen={showSlotModal} toggle={() => setShowSlotModal(false)}>
        <ModalBody>
          <a 
            href="#close" 
            onClick={(e) => {
              e.preventDefault();
              setShowSlotModal(false);
            }} 
            className="close"
          >
            <Icon name="cross-sm" />
          </a>
          {selectedSlot && (
            <div className="p-2 text-center">
              <div className={`nk-modal-icon ${selectedSlot.available ? 'text-success' : 'text-warning'}`}>
                <Icon name={selectedSlot.available ? "check-circle" : "alert-circle"} style={{ fontSize: '4rem' }} />
              </div>
              <h4 className="nk-modal-title">
                {selectedSlot.available ? 'Available Dates' : 'Dates Not Available'}
              </h4>
              <div className="nk-modal-text">
                <p><strong>Selected Period:</strong></p>
                <p>{formatDateTime(selectedSlot.start)} - {formatDateTime(selectedSlot.end)}</p>
                
                {!selectedSlot.available && selectedSlot.conflictingRentals.length > 0 && (
                  <div className="mt-3">
                    <p><strong>Conflicting with:</strong></p>
                    <p>Rental ID(s): {selectedSlot.conflictingRentals.join(', ')}</p>
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-center g-3">
                <Button 
                  color="primary" 
                  onClick={() => setShowSlotModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      <style jsx>{`
        .availability-calendar .rbc-calendar {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .availability-calendar .rbc-header {
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          padding: 8px;
          font-weight: 600;
        }
        
        .availability-calendar .rbc-today {
          background-color: rgba(0, 123, 255, 0.1);
        }
        
        .availability-calendar .rbc-event {
          border-radius: 4px;
          border: none;
          font-size: 11px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default VehicleAvailabilityCalendar;
