import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import Buttons from "../Button/Buttons";

const AvailabilityCalendar = ({ 
  tourId, 
  availabilityData = [], 
  onDateSelect, 
  selectedDate = null,
  className = "",
  animation = {} 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, availabilityData]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: '', isEmpty: true });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const availability = availabilityData.find(a => a.date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      const isPast = new Date(year, month, day) < new Date().setHours(0, 0, 0, 0);
      const isSelected = selectedDate === dateStr;
      
      days.push({
        day,
        date: dateStr,
        isEmpty: false,
        availability: availability || { status: 'unavailable', available_spots: 0 },
        isToday,
        isPast,
        isSelected
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'full':
        return 'bg-red-100 text-red-800 cursor-not-allowed';
      default:
        return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
  };

  const handleDateClick = (dayData) => {
    if (dayData.isPast || dayData.availability.status === 'unavailable' || dayData.availability.status === 'full') {
      return;
    }
    
    if (onDateSelect) {
      onDateSelect(dayData.date, dayData.availability);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <m.div className={`availability-calendar bg-white rounded-lg border ${className}`} {...animation}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Buttons
          className="btn-fancy btn-outline text-sm px-3 py-1"
          onClick={() => navigateMonth(-1)}
          title="‹"
          ariaLabel="Previous month"
        />
        
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <Buttons
          className="btn-fancy btn-outline text-sm px-3 py-1"
          onClick={() => navigateMonth(1)}
          title="›"
          ariaLabel="Next month"
        />
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              className={`
                relative aspect-square flex items-center justify-center text-sm rounded cursor-pointer transition-all
                ${dayData.isEmpty ? 'invisible' : ''}
                ${dayData.isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                ${dayData.isToday ? 'ring-2 ring-neonorange' : ''}
                ${dayData.isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${!dayData.isEmpty && !dayData.isPast ? getStatusColor(dayData.availability.status) : ''}
              `}
              onClick={() => handleDateClick(dayData)}
              title={
                dayData.isEmpty ? '' :
                dayData.isPast ? 'Past date' :
                dayData.availability.status === 'available' ? `Available (${dayData.availability.available_spots} spots)` :
                dayData.availability.status === 'limited' ? `Limited (${dayData.availability.available_spots} spots left)` :
                dayData.availability.status === 'full' ? 'Fully booked' :
                'Unavailable'
              }
            >
              {!dayData.isEmpty && (
                <>
                  <span className="font-medium">{dayData.day}</span>
                  
                  {/* Availability indicator */}
                  {!dayData.isPast && dayData.availability.available_spots > 0 && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-current opacity-60"></div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t p-4">
        <h4 className="text-sm font-medium mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
            <span>Limited</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
            <span>Full</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default AvailabilityCalendar;
