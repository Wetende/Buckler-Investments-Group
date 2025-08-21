"""Business rules and configuration constants."""

from decimal import Decimal
from typing import Dict, Any
from datetime import timedelta

# Booking-related business rules
BOOKING_RULES: Dict[str, Any] = {
    # Advance booking requirements
    "min_advance_hours": {
        "bnb": 2,              # 2 hours minimum for BNB
        "tour": 24,            # 24 hours minimum for tours
        "vehicle": 4,          # 4 hours minimum for vehicles
        "property": 0,         # No minimum for property viewing
    },
    
    # Maximum advance booking allowed
    "max_advance_days": {
        "bnb": 365,            # 1 year maximum
        "tour": 180,           # 6 months maximum
        "vehicle": 90,         # 3 months maximum
        "property": 30,        # 1 month maximum
    },
    
    # Minimum booking duration
    "min_duration": {
        "bnb": timedelta(hours=24),     # 1 night minimum
        "tour": timedelta(hours=4),     # 4 hours minimum
        "vehicle": timedelta(hours=4),   # 4 hours minimum
        "property": timedelta(hours=1),  # 1 hour viewing minimum
    },
    
    # Maximum booking duration
    "max_duration": {
        "bnb": timedelta(days=30),      # 30 nights maximum
        "tour": timedelta(days=14),     # 14 days maximum
        "vehicle": timedelta(days=30),   # 30 days maximum
        "property": timedelta(hours=3),  # 3 hours viewing maximum
    },
    
    # Cancellation deadlines (hours before start)
    "cancellation_deadline": {
        "flexible": 24,        # 24 hours before
        "moderate": 120,       # 5 days before
        "strict": 168,         # 7 days before
        "super_strict": 720,   # 30 days before
    },
    
    # Auto-confirmation rules
    "auto_confirm": {
        "instant_book_enabled": True,
        "payment_verified_users": True,
        "host_approval_required": False,
    },
    
    # Guest limits
    "guest_limits": {
        "bnb_max_guests": 16,
        "tour_max_participants": 50,
        "vehicle_max_passengers": 8,
    }
}

# Payment-related business rules
PAYMENT_RULES: Dict[str, Any] = {
    # Payment timing
    "payment_due": {
        "immediate": ["bnb", "vehicle"],      # Pay immediately
        "before_service": ["tour"],           # Pay before tour starts
        "after_viewing": ["property"],        # Pay after property viewing
    },
    
    # Payment split (host/platform)
    "commission_rates": {
        "bnb": Decimal("0.15"),              # 15% platform commission
        "tour": Decimal("0.12"),             # 12% platform commission
        "vehicle": Decimal("0.18"),          # 18% platform commission
        "property": Decimal("0.03"),         # 3% platform commission
    },
    
    # Processing fees
    "processing_fees": {
        "mpesa": Decimal("0.025"),           # 2.5% M-Pesa fee
        "stripe": Decimal("0.035"),          # 3.5% Stripe fee
        "bank_transfer": Decimal("0.01"),    # 1% bank transfer fee
    },
    
    # Refund rates based on cancellation timing
    "refund_rates": {
        "flexible": {
            "24_hours_plus": Decimal("1.0"),     # 100% refund
            "less_24_hours": Decimal("0.0"),     # No refund
        },
        "moderate": {
            "5_days_plus": Decimal("1.0"),       # 100% refund
            "1_5_days": Decimal("0.5"),          # 50% refund
            "less_1_day": Decimal("0.0"),        # No refund
        },
        "strict": {
            "7_days_plus": Decimal("1.0"),       # 100% refund
            "2_7_days": Decimal("0.5"),          # 50% refund
            "less_2_days": Decimal("0.0"),       # No refund
        },
    },
    
    # Payment retry rules
    "retry_policy": {
        "max_attempts": 3,
        "retry_intervals": [60, 300, 1800],  # 1min, 5min, 30min
        "auto_cancel_after_hours": 24,
    },
    
    # Currency conversion
    "exchange_rate_buffer": Decimal("0.02"), # 2% buffer for exchange rates
    "rate_cache_minutes": 30,                # Cache rates for 30 minutes
}

# Pricing-related business rules
PRICING_RULES: Dict[str, Any] = {
    # Dynamic pricing factors
    "seasonal_multipliers": {
        "peak_season": Decimal("1.5"),       # 50% increase during peak
        "high_season": Decimal("1.25"),      # 25% increase during high
        "low_season": Decimal("0.8"),        # 20% decrease during low
    },
    
    # Demand-based pricing
    "demand_multipliers": {
        "very_high": Decimal("1.8"),         # 80% increase
        "high": Decimal("1.4"),              # 40% increase  
        "normal": Decimal("1.0"),            # No change
        "low": Decimal("0.9"),               # 10% decrease
    },
    
    # Early bird discounts
    "early_bird_discounts": {
        "30_days_advance": Decimal("0.1"),   # 10% discount
        "60_days_advance": Decimal("0.15"),  # 15% discount
        "90_days_advance": Decimal("0.2"),   # 20% discount
    },
    
    # Bulk booking discounts
    "bulk_discounts": {
        "7_nights_plus": Decimal("0.05"),    # 5% for weekly stays
        "30_nights_plus": Decimal("0.15"),   # 15% for monthly stays
        "multiple_services": Decimal("0.1"), # 10% for bundle bookings
    },
    
    # Price boundaries
    "price_limits": {
        "min_nightly_rate": {
            "KES": Decimal("1000"),          # 1,000 KES minimum
            "USD": Decimal("10"),            # $10 minimum
        },
        "max_price_increase": Decimal("0.5"), # 50% max increase
        "price_change_notice_days": 30,      # 30 days notice for changes
    },
    
    # Service fees
    "service_fees": {
        "guest_fee_rate": Decimal("0.05"),   # 5% guest service fee
        "min_service_fee": {
            "KES": Decimal("200"),           # Minimum 200 KES
            "USD": Decimal("2"),             # Minimum $2
        },
        "max_service_fee": {
            "KES": Decimal("5000"),          # Maximum 5,000 KES
            "USD": Decimal("50"),            # Maximum $50
        },
    }
}

# Search and recommendation rules
SEARCH_RULES: Dict[str, Any] = {
    # Default search parameters
    "default_radius_km": 50,                 # 50km default search radius
    "max_radius_km": 200,                    # 200km maximum search radius
    "default_results_per_page": 20,          # 20 results per page
    "max_results_per_page": 100,             # 100 maximum results per page
    
    # Boost factors for search ranking
    "ranking_boosts": {
        "instant_book": 1.2,                # 20% boost for instant book
        "superhost": 1.5,                   # 50% boost for superhosts
        "recent_booking": 1.1,              # 10% boost for recent bookings
        "high_rating": 1.3,                 # 30% boost for high ratings (4.5+)
        "verified_listing": 1.15,           # 15% boost for verified listings
    },
    
    # Filter limits
    "price_filter_steps": [1000, 2500, 5000, 10000, 25000],  # KES price steps
    "rating_minimum": 3.0,                  # Minimum rating to show
    "review_count_minimum": 3,              # Minimum reviews to show rating
}

# Content moderation rules
MODERATION_RULES: Dict[str, Any] = {
    # Auto-moderation triggers
    "flagged_words": [
        "spam", "scam", "fake", "illegal", "drugs", "weapons"
    ],
    
    # Review moderation
    "review_auto_approve": True,
    "review_max_length": 1000,
    "review_min_length": 10,
    "review_cooldown_hours": 24,            # 24 hours between reviews
    
    # Image moderation
    "max_images_per_listing": 20,
    "min_images_per_listing": 3,
    "max_image_size_mb": 10,
    "allowed_image_formats": ["jpg", "jpeg", "png", "webp"],
    
    # Content approval
    "auto_approve_verified_users": True,
    "manual_review_required": [
        "new_user_first_listing",
        "price_above_threshold",
        "flagged_content"
    ]
}

# Notification rules
NOTIFICATION_RULES: Dict[str, Any] = {
    # Timing for different notifications
    "booking_reminders": {
        "check_in_reminder": 24,            # 24 hours before check-in
        "review_reminder": 24,              # 24 hours after check-out
        "payment_reminder": 2,              # 2 hours before payment due
    },
    
    # Channel preferences
    "default_channels": ["email", "in_app"],
    "urgent_channels": ["email", "sms", "in_app"],
    
    # Rate limiting
    "max_emails_per_day": 10,
    "max_sms_per_day": 5,
    "notification_cooldown_minutes": 15,
}
