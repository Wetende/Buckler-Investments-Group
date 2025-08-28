"""Host earnings analytics use case."""
from typing import Dict, Any
from domain.repositories.bnb import BnbRepository, BookingRepository
from decimal import Decimal
from datetime import datetime, timedelta


class HostEarningsUseCase:
    def __init__(
        self,
        bnb_repository: BnbRepository,
        booking_repository: BookingRepository
    ):
        self._bnb_repository = bnb_repository
        self._booking_repository = booking_repository

    async def execute(self, host_id: int, period: str = "month") -> Dict[str, Any]:
        """Calculate earnings for a host over a specified period."""
        
        # Get host's listings
        host_listings = await self._bnb_repository.get_by_host(host_id)
        
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
        
        # Get all bookings for host's listings in the period
        total_earnings = Decimal('0')
        pending_payouts = Decimal('0')
        completed_payouts = Decimal('0')
        bookings_count = 0
        
        for listing in host_listings:
            listing_bookings = await self._booking_repository.get_by_listing_id(listing.id)
            
            for booking in listing_bookings:
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
                        # Assume 15% platform fee
                        host_earning = booking_amount * Decimal('0.85')
                        total_earnings += host_earning
                        
                        # Check if payout has been completed (simplified logic)
                        # In reality, this would check a payouts table
                        days_since_completion = (end_date - booking.check_out).days
                        if days_since_completion > 7:  # Assume 7-day payout delay
                            completed_payouts += host_earning
                        else:
                            pending_payouts += host_earning
                    
                    elif booking.status == 'CONFIRMED':
                        # Future earnings (not yet completed)
                        host_earning = booking_amount * Decimal('0.85')
                        pending_payouts += host_earning
        
        # Calculate some additional metrics
        if bookings_count > 0:
            average_booking_value = float(total_earnings / bookings_count) if total_earnings > 0 else 0
        else:
            average_booking_value = 0
        
        # Calculate growth compared to previous period (simplified)
        # This would be more sophisticated in a real implementation
        growth_rate = 0.0  # Placeholder
        
        return {
            "period": period,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_earnings": float(total_earnings),
            "pending_payouts": float(pending_payouts),
            "completed_payouts": float(completed_payouts),
            "bookings_count": bookings_count,
            "average_booking_value": round(average_booking_value, 2),
            "growth_rate": growth_rate,
            "currency": "KES"
        }
