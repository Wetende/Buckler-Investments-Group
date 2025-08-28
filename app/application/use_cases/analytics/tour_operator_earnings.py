"""Tour operator earnings analytics use case."""
from typing import Dict, Any
from domain.repositories.tours import TourRepository, TourBookingRepository
from decimal import Decimal
from datetime import datetime, timedelta


class TourOperatorEarningsUseCase:
    def __init__(
        self,
        tour_repository: TourRepository,
        tour_booking_repository: TourBookingRepository
    ):
        self._tour_repository = tour_repository
        self._tour_booking_repository = tour_booking_repository

    async def execute(self, operator_id: int, period: str = "month") -> Dict[str, Any]:
        """Calculate earnings for a tour operator over a specified period."""
        
        # Define date range based on period
        end_date = datetime.now().date()
        
        if period == "day":
            start_date = end_date
        elif period == "week":
            start_date = end_date - timedelta(days=7)
        elif period == "month":
            start_date = end_date.replace(day=1)
        elif period == "year":
            start_date = end_date.replace(month=1, day=1)
        else:
            # Default to month
            start_date = end_date.replace(day=1)
            period = "month"
        
        # Get all tour bookings in the period
        all_bookings = await self._tour_booking_repository.list(limit=1000)
        
        total_earnings = Decimal('0')
        pending_payouts = Decimal('0')
        completed_payouts = Decimal('0')
        bookings_count = 0
        
        for booking in all_bookings:
            # Check if booking is in the specified period
            booking_date = booking.created_at.date()
            if start_date <= booking_date <= end_date:
                bookings_count += 1
                
                booking_amount = (
                    booking.total_amount.amount 
                    if hasattr(booking.total_amount, 'amount') 
                    else booking.total_amount
                )
                
                if booking.status == 'COMPLETED':
                    # Assume 12% platform fee for tours
                    operator_earning = booking_amount * Decimal('0.88')
                    total_earnings += operator_earning
                    
                    # Check if payout has been completed (simplified logic)
                    days_since_completion = (end_date - booking.tour_date).days
                    if days_since_completion > 5:  # Assume 5-day payout delay for tours
                        completed_payouts += operator_earning
                    else:
                        pending_payouts += operator_earning
                
                elif booking.status == 'CONFIRMED':
                    # Future earnings (tour not yet completed)
                    operator_earning = booking_amount * Decimal('0.88')
                    pending_payouts += operator_earning
        
        # Calculate additional metrics
        if bookings_count > 0:
            average_booking_value = float(total_earnings / bookings_count) if total_earnings > 0 else 0
        else:
            average_booking_value = 0
        
        # Tour categories breakdown (simplified)
        category_earnings = {
            "safari": float(total_earnings * Decimal('0.4')),  # Mock distribution
            "cultural": float(total_earnings * Decimal('0.3')),
            "adventure": float(total_earnings * Decimal('0.2')),
            "other": float(total_earnings * Decimal('0.1'))
        }
        
        return {
            "period": period,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_earnings": float(total_earnings),
            "pending_payouts": float(pending_payouts),
            "completed_payouts": float(completed_payouts),
            "bookings_count": bookings_count,
            "average_booking_value": round(average_booking_value, 2),
            "category_earnings": category_earnings,
            "currency": "KES"
        }
