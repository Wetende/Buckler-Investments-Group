import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  Block,
  BlockContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  Badge
} from '@/components/Component';
import { toast } from 'react-toastify';

const AvailabilityCalendar = ({ 
  propertyId, 
  onAvailabilityChange,
  availability = [],
  bookings = [],
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDayStatus = (date) => {
    if (!date) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if it's booked
    const isBooked = bookings.some(booking => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return date >= checkIn && date < checkOut;
    });
    
    if (isBooked) return 'booked';
    
    // Check availability
    const availabilityItem = availability.find(item => item.date === dateStr);
    if (availabilityItem) {
      return availabilityItem.available ? 'available' : 'blocked';
    }
    
    // Default to available
    return 'available';
  };

  const handleDateClick = (date) => {
    if (!date) return;
    
    const status = getDayStatus(date);
    if (status === 'booked') {
      toast.info('This date is already booked and cannot be modified');
      return;
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const newSelected = new Set(selectedDates);
    
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    
    setSelectedDates(newSelected);
  };

  const handleBulkAction = (action) => {
    if (selectedDates.size === 0) {
      toast.warning('Please select dates first');
      return;
    }

    const updates = Array.from(selectedDates).map(date => ({
      date,
      available: action === 'make_available',
      price_override: null // Can be enhanced later
    }));

    onAvailabilityChange?.(updates);
    setSelectedDates(new Set());
    toast.success(`${selectedDates.size} dates updated successfully`);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDayClassName = (date) => {
    if (!date) return 'calendar-day empty';
    
    const status = getDayStatus(date);
    const dateStr = date.toISOString().split('T')[0];
    const isSelected = selectedDates.has(dateStr);
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < new Date().setHours(0, 0, 0, 0);
    
    let className = 'calendar-day';
    
    if (isPast) className += ' past';
    if (isToday) className += ' today';
    if (isSelected) className += ' selected';
    if (status) className += ` status-${status}`;
    
    return className;
  };

  const calendarDays = generateCalendarDays();

  const CalendarView = () => (
    <div className="availability-calendar">
      <style jsx>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: #e5e9f2;
          border: 1px solid #e5e9f2;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .calendar-day {
          aspect-ratio: 1;
          background: white;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          position: relative;
          min-height: 60px;
        }
        
        .calendar-day.empty {
          background: #f8f9fa;
          cursor: default;
        }
        
        .calendar-day.past {
          background: #f8f9fa;
          color: #adb5bd;
          cursor: not-allowed;
        }
        
        .calendar-day.today {
          font-weight: bold;
          box-shadow: inset 0 0 0 2px #007bff;
        }
        
        .calendar-day.selected {
          background: #007bff !important;
          color: white;
        }
        
        .calendar-day.status-available {
          background: #d4edda;
          color: #155724;
        }
        
        .calendar-day.status-blocked {
          background: #f8d7da;
          color: #721c24;
        }
        
        .calendar-day.status-booked {
          background: #fff3cd;
          color: #856404;
          cursor: not-allowed;
        }
        
        .calendar-day:hover:not(.past):not(.status-booked) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: #495057;
          margin-bottom: 1px;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
        }
        
        .calendar-header-cell {
          background: #495057;
          color: white;
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
        }
        
        @media (max-width: 768px) {
          .calendar-day {
            min-height: 40px;
            font-size: 12px;
          }
          
          .calendar-header-cell {
            padding: 8px 4px;
            font-size: 10px;
          }
        }
      `}</style>
      
      <div className="calendar-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-header-cell">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {calendarDays.map((date, index) => (
          <button
            key={index}
            className={getDayClassName(date)}
            onClick={() => handleDateClick(date)}
            disabled={!date || date < new Date().setHours(0, 0, 0, 0)}
          >
            {date && (
              <>
                <span>{date.getDate()}</span>
                {getDayStatus(date) === 'booked' && (
                  <Icon name="calendar" style={{ fontSize: '10px', marginTop: '2px' }} />
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const ListView = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const dates = [];
    
    // Generate next 60 days
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return (
      <div className="availability-list">
        {dates.map(date => {
          const status = getDayStatus(date);
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = selectedDates.has(dateStr);
          
          return (
            <div 
              key={dateStr} 
              className={`list-item d-flex justify-content-between align-items-center p-3 border-bottom ${isSelected ? 'bg-primary text-white' : ''}`}
              onClick={() => handleDateClick(date)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <strong>{date.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}</strong>
                <br />
                <small className={isSelected ? 'text-white-50' : 'text-muted'}>
                  {date.toLocaleDateString('en-US', { year: 'numeric' })}
                </small>
              </div>
              <div className="text-right">
                <Badge color={
                  status === 'booked' ? 'warning' : 
                  status === 'blocked' ? 'danger' : 
                  'success'
                }>
                  {status === 'booked' ? 'Booked' : 
                   status === 'blocked' ? 'Blocked' : 
                   'Available'}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className={`calendar-container ${className}`}>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <BlockTitle tag="h6">Availability Calendar</BlockTitle>
            <p className="text-muted mb-0">Manage your property's availability</p>
          </div>
          <div className="d-flex align-items-center">
            <div className="btn-group btn-group-sm mr-2">
              <Button 
                color={viewMode === 'month' ? 'primary' : 'light'} 
                outline={viewMode !== 'month'}
                onClick={() => setViewMode('month')}
              >
                <Icon name="calendar" />
              </Button>
              <Button 
                color={viewMode === 'list' ? 'primary' : 'light'} 
                outline={viewMode !== 'list'}
                onClick={() => setViewMode('list')}
              >
                <Icon name="list" />
              </Button>
            </div>
          </div>
        </div>
        
        {viewMode === 'month' && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex align-items-center">
              <Button size="sm" color="light" outline onClick={() => navigateMonth(-1)}>
                <Icon name="chevron-left" />
              </Button>
              <h5 className="mx-3 mb-0">{formatMonthYear(currentDate)}</h5>
              <Button size="sm" color="light" outline onClick={() => navigateMonth(1)}>
                <Icon name="chevron-right" />
              </Button>
              <Button size="sm" color="primary" outline onClick={goToToday} className="ml-3">
                Today
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardBody>
        {/* Legend */}
        <div className="calendar-legend mb-4">
          <Row className="g-2">
            <Col>
              <div className="d-flex align-items-center">
                <div 
                  className="legend-color" 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    background: '#d4edda', 
                    border: '1px solid #c3e6cb',
                    borderRadius: '3px',
                    marginRight: '8px'
                  }}
                ></div>
                <small>Available</small>
              </div>
            </Col>
            <Col>
              <div className="d-flex align-items-center">
                <div 
                  className="legend-color" 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    background: '#f8d7da', 
                    border: '1px solid #f5c6cb',
                    borderRadius: '3px',
                    marginRight: '8px'
                  }}
                ></div>
                <small>Blocked</small>
              </div>
            </Col>
            <Col>
              <div className="d-flex align-items-center">
                <div 
                  className="legend-color" 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    background: '#fff3cd', 
                    border: '1px solid #ffeaa7',
                    borderRadius: '3px',
                    marginRight: '8px'
                  }}
                ></div>
                <small>Booked</small>
              </div>
            </Col>
            <Col>
              <div className="d-flex align-items-center">
                <div 
                  className="legend-color" 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    background: '#007bff', 
                    border: '1px solid #0056b3',
                    borderRadius: '3px',
                    marginRight: '8px'
                  }}
                ></div>
                <small>Selected</small>
              </div>
            </Col>
          </Row>
        </div>

        {/* Calendar/List View */}
        {viewMode === 'month' ? <CalendarView /> : <ListView />}

        {/* Bulk Actions */}
        {selectedDates.size > 0 && (
          <div className="bulk-actions mt-4 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center">
              <span><strong>{selectedDates.size}</strong> dates selected</span>
              <div>
                <Button 
                  size="sm" 
                  color="success" 
                  className="mr-2"
                  onClick={() => handleBulkAction('make_available')}
                >
                  <Icon name="check" className="mr-1" />
                  Make Available
                </Button>
                <Button 
                  size="sm" 
                  color="danger" 
                  className="mr-2"
                  onClick={() => handleBulkAction('block_dates')}
                >
                  <Icon name="cross" className="mr-1" />
                  Block Dates
                </Button>
                <Button 
                  size="sm" 
                  color="light" 
                  onClick={() => setSelectedDates(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AvailabilityCalendar;
