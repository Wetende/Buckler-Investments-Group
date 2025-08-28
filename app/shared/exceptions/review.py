"""Review-related exceptions."""


class ReviewException(Exception):
    """Base exception for review domain."""
    pass


class ReviewNotFoundError(ReviewException):
    def __init__(self, review_id: int):
        super().__init__(f"Review with ID {review_id} not found")
        self.review_id = review_id


class ReviewAlreadyExistsError(ReviewException):
    def __init__(self, message: str = "Review already exists for this booking"):
        super().__init__(message)


class BookingNotFoundError(ReviewException):
    def __init__(self, booking_id: int):
        super().__init__(f"Booking with ID {booking_id} not found")
        self.booking_id = booking_id


class InvalidRatingError(ReviewException):
    def __init__(self, message: str = "Invalid rating value"):
        super().__init__(message)


class ReviewPermissionError(ReviewException):
    def __init__(self, message: str = "Permission denied for this review operation"):
        super().__init__(message)


class ReviewResponseError(ReviewException):
    def __init__(self, message: str = "Cannot add response to this review"):
        super().__init__(message)
