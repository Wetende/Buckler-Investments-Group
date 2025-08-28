"""Host dashboard analytics use case."""
from typing import Dict, Any
from domain.repositories.bnb import BnbRepository, BookingRepository
from domain.repositories.review import ReviewRepository
from decimal import Decimal
from datetime import datetime, timedelta


class HostDashboardUseCase:
    def __init__(
        self,
        bnb_repository: BnbRepository,
        booking_repository: BookingRepository,
        review_repository: ReviewRepository
    ):
        self._bnb_repository = bnb_repository
        self._booking_repository = booking_repository
        self._review_repository = review_repository

    async def execute(self, host_id: int) -> Dict[str, Any]:
        """Generate dashboard analytics for a host."""
        
        # Get host's listings
        host_listings = await self._bnb_repository.get_by_host(host_id)
        total_listings = len(host_listings)
        
        # Get all bookings for host's listings
        all_bookings = []
        total_revenue = Decimal('0')
        active_bookings = 0
        completed_bookings = 0
        
        current_date = datetime.now().date()
        
        for listing in host_listings:
            listing_bookings = await self._booking_repository.get_by_listing_id(listing.id)
            all_bookings.extend(listing_bookings)
            
            for booking in listing_bookings:
                # Calculate revenue from completed bookings
                if booking.status in ['COMPLETED', 'CONFIRMED']:
                    total_revenue += booking.total_amount.amount if hasattr(booking.total_amount, 'amount') else booking.total_amount
                
                # Count active bookings (current or future)
                if booking.check_out >= current_date and booking.status in ['CONFIRMED', 'PENDING']:
                    active_bookings += 1
                
                # Count completed bookings
                if booking.status == 'COMPLETED':
                    completed_bookings += 1
        
        # Calculate occupancy rate (simplified)
        # This is a basic calculation - in reality, it would be more complex
        occupancy_rate = 0.0
        if total_listings > 0:
            # Estimate based on bookings vs potential booking days
            days_in_month = 30
            potential_booking_days = total_listings * days_in_month
            
            # Count booked days in the current month
            month_start = datetime.now().replace(day=1).date()
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            booked_days = 0
            for booking in all_bookings:
                if (booking.check_in <= month_end and booking.check_out >= month_start 
                    and booking.status in ['CONFIRMED', 'COMPLETED']):
                    # Calculate overlap with current month
                    start_date = max(booking.check_in, month_start)
                    end_date = min(booking.check_out, month_end)
                    booked_days += (end_date - start_date).days
            
            if potential_booking_days > 0:
                occupancy_rate = min(booked_days / potential_booking_days, 1.0)
        
        # Calculate average rating across all listings
        average_rating = 0.0
        total_reviews = 0
        total_rating_sum = 0
        
        for listing in host_listings:
            listing_reviews = await self._review_repository.get_by_target('bnb_listing', listing.id)
            for review in listing_reviews:
                total_rating_sum += review.rating
                total_reviews += 1
        
        if total_reviews > 0:
            average_rating = round(total_rating_sum / total_reviews, 2)
        
        # Recent bookings (last 30 days)
        thirty_days_ago = current_date - timedelta(days=30)
        recent_bookings = [
            booking for booking in all_bookings 
            if booking.created_at.date() >= thirty_days_ago
        ]
        
        return {
            "total_listings": total_listings,
            "active_bookings": active_bookings,
            "completed_bookings": completed_bookings,
            "total_revenue": float(total_revenue),
            "occupancy_rate": round(occupancy_rate, 3),
            "average_rating": average_rating,
            "total_reviews": total_reviews,
            "recent_bookings_count": len(recent_bookings),
            "currency": "KES"
        }
