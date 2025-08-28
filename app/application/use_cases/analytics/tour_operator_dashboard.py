"""Tour operator dashboard analytics use case."""
from typing import Dict, Any
from domain.repositories.tours import TourRepository, TourBookingRepository
from domain.repositories.review import ReviewRepository
from decimal import Decimal
from datetime import datetime, timedelta


class TourOperatorDashboardUseCase:
    def __init__(
        self,
        tour_repository: TourRepository,
        tour_booking_repository: TourBookingRepository,
        review_repository: ReviewRepository
    ):
        self._tour_repository = tour_repository
        self._tour_booking_repository = tour_booking_repository
        self._review_repository = review_repository

    async def execute(self, operator_id: int) -> Dict[str, Any]:
        """Generate dashboard analytics for a tour operator."""
        
        # Get all tours (simplified - assuming operator owns all tours for now)
        # In reality, we'd filter by operator_id
        all_tours = await self._tour_repository.list(limit=1000)
        total_tours = len(all_tours)
        
        # Get all tour bookings
        all_bookings = await self._tour_booking_repository.list(limit=1000)
        
        # Calculate metrics
        total_revenue = Decimal('0')
        active_bookings = 0
        completed_tours = 0
        
        current_date = datetime.now().date()
        
        for booking in all_bookings:
            # Calculate revenue from completed bookings
            if booking.status in ['COMPLETED', 'CONFIRMED']:
                booking_amount = (
                    booking.total_amount.amount 
                    if hasattr(booking.total_amount, 'amount') 
                    else booking.total_amount
                )
                total_revenue += booking_amount
            
            # Count active bookings (future tours)
            if booking.tour_date >= current_date and booking.status in ['CONFIRMED', 'PENDING']:
                active_bookings += 1
            
            # Count completed tours
            if booking.status == 'COMPLETED':
                completed_tours += 1
        
        # Calculate average rating across all tours
        average_rating = 0.0
        total_reviews = 0
        total_rating_sum = 0
        
        for tour in all_tours:
            tour_reviews = await self._review_repository.get_by_target('tour', tour.id)
            for review in tour_reviews:
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
        
        # Popular tours (by booking count)
        tour_booking_counts = {}
        for booking in all_bookings:
            tour_id = booking.tour_id
            tour_booking_counts[tour_id] = tour_booking_counts.get(tour_id, 0) + 1
        
        most_popular_tour_id = max(tour_booking_counts.keys(), key=tour_booking_counts.get) if tour_booking_counts else None
        most_popular_tour_bookings = tour_booking_counts.get(most_popular_tour_id, 0) if most_popular_tour_id else 0
        
        return {
            "total_tours": total_tours,
            "active_bookings": active_bookings,
            "completed_tours": completed_tours,
            "total_revenue": float(total_revenue),
            "average_rating": average_rating,
            "total_reviews": total_reviews,
            "recent_bookings_count": len(recent_bookings),
            "most_popular_tour_id": most_popular_tour_id,
            "most_popular_tour_bookings": most_popular_tour_bookings,
            "currency": "KES"
        }
