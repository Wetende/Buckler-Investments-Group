import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import Buttons from '../Button/Buttons'
import { useVehicleReviews, useCreateReview } from '../../api/useCars'
import { useAuth } from '../../api/useAuth'
import { fadeIn, fadeInUp } from '../../Functions/GlobalAnimations'

const VehicleReviews = ({ vehicleId, className = '' }) => {
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [reviewData, setReviewData] = useState({
        rating: 5,
        title: '',
        comment: '',
        recommend: true
    })

    const { data: reviews = [], isLoading, refetch } = useVehicleReviews(vehicleId)
    const createReview = useCreateReview()
    const { user, isAuthenticated } = useAuth()

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        
        if (!isAuthenticated) {
            alert('Please log in to submit a review')
            return
        }

        try {
            await createReview.mutateAsync({
                id: 0,
                vehicle_id: vehicleId,
                ...reviewData
            })
            
            // Reset form
            setReviewData({
                rating: 5,
                title: '',
                comment: '',
                recommend: true
            })
            setShowReviewForm(false)
            refetch()
        } catch (error) {
            console.error('Failed to submit review:', error)
            alert('Failed to submit review. Please try again.')
        }
    }

    const handleInputChange = (field, value) => {
        setReviewData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const getAverageRating = () => {
        if (reviews.length === 0) return 0
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
        return (sum / reviews.length).toFixed(1)
    }

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        reviews.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1
        })
        return distribution
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const renderStars = (rating, size = 'text-sm') => {
        return (
            <div className={`flex ${size}`}>
                {[...Array(5)].map((_, i) => (
                    <i 
                        key={i}
                        className={`fas fa-star ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    ></i>
                ))}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className={`reviews-section ${className}`}>
                <div className="text-center py-8">
                    <div className="spinner-border text-[#ca943d]" role="status">
                        <span className="sr-only">Loading reviews...</span>
                    </div>
                </div>
            </div>
        )
    }

    const distribution = getRatingDistribution()
    const averageRating = getAverageRating()

    return (
        <div className={`reviews-section ${className}`}>
            {/* Reviews Header */}
            <m.div {...fadeIn}>
                <div className="reviews-header mb-8">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h3 className="font-serif font-semibold text-2xl text-darkgray mb-4">
                                Customer Reviews
                            </h3>
                            
                            {reviews.length > 0 && (
                                <div className="rating-summary">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="text-4xl font-serif font-bold text-[#ca943d]">
                                                {averageRating}
                                            </div>
                                            {renderStars(Math.floor(averageRating), 'text-lg')}
                                            <div className="text-sm text-[#777] mt-1">
                                                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            {[5, 4, 3, 2, 1].map(rating => (
                                                <div key={rating} className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm w-2">{rating}</span>
                                                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-[#ca943d] h-2 rounded-full"
                                                            style={{
                                                                width: `${reviews.length > 0 ? (distribution[rating] / reviews.length) * 100 : 0}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-[#777] w-8">
                                                        {distribution[rating]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Col>
                        
                        <Col md={6} className="text-md-right">
                            {isAuthenticated ? (
                                <Buttons
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                    themeColor="#ca943d"
                                    color="#fff"
                                    title={showReviewForm ? "Cancel Review" : "Write a Review"}
                                />
                            ) : (
                                <p className="text-[#777]">
                                    Please log in to write a review
                                </p>
                            )}
                        </Col>
                    </Row>
                </div>
            </m.div>

            {/* Review Form */}
            {showReviewForm && (
                <m.div {...fadeInUp} className="review-form bg-gray-50 p-6 rounded mb-8">
                    <h4 className="font-serif font-medium text-lg mb-4">Write Your Review</h4>
                    
                    <form onSubmit={handleSubmitReview}>
                        <Row className="g-4">
                            <Col md={12}>
                                <div className="form-group">
                                    <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                        Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(rating => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => handleInputChange('rating', rating)}
                                                className={`text-2xl transition-colors ${
                                                    rating <= reviewData.rating 
                                                        ? 'text-yellow-400' 
                                                        : 'text-gray-300 hover:text-yellow-300'
                                                }`}
                                            >
                                                <i className="fas fa-star"></i>
                                            </button>
                                        ))}
                                        <span className="ml-2 text-[#777]">
                                            {reviewData.rating} star{reviewData.rating !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </Col>
                            
                            <Col md={12}>
                                <div className="form-group">
                                    <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                        Review Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                        value={reviewData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Summarize your experience"
                                        required
                                    />
                                </div>
                            </Col>
                            
                            <Col md={12}>
                                <div className="form-group">
                                    <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                        Your Review
                                    </label>
                                    <textarea
                                        className="form-control rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                        rows="4"
                                        value={reviewData.comment}
                                        onChange={(e) => handleInputChange('comment', e.target.value)}
                                        placeholder="Tell others about your experience with this vehicle"
                                        required
                                    />
                                </div>
                            </Col>
                            
                            <Col md={12}>
                                <div className="form-group">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="recommend"
                                            checked={reviewData.recommend}
                                            onChange={(e) => handleInputChange('recommend', e.target.checked)}
                                            className="form-check-input"
                                        />
                                        <label htmlFor="recommend" className="form-check-label text-darkgray">
                                            I would recommend this vehicle to others
                                        </label>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        
                        <div className="flex gap-3 mt-6">
                            <Buttons
                                type="submit"
                                disabled={createReview.isLoading}
                                className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#ca943d"
                                color="#fff"
                                title={createReview.isLoading ? "Submitting..." : "Submit Review"}
                            />
                            
                            <Buttons
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#777"
                                color="#777"
                                title="Cancel"
                            />
                        </div>
                    </form>
                </m.div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <m.div {...fadeIn} className="text-center py-12">
                        <i className="fas fa-star text-[#ca943d] text-[60px] mb-4"></i>
                        <h4 className="font-serif font-medium text-lg mb-2">No Reviews Yet</h4>
                        <p className="text-[#777]">
                            Be the first to share your experience with this vehicle.
                        </p>
                    </m.div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <m.div 
                                key={review.id}
                                {...fadeInUp}
                                transition={{ delay: index * 0.1 }}
                                className="review-item bg-white p-6 rounded border border-gray-200"
                            >
                                <div className="review-header flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-[#ca943d] rounded-full flex items-center justify-center text-white font-semibold">
                                                {review.user_name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h5 className="font-serif font-medium mb-1">
                                                    {review.user_name || 'Anonymous'}
                                                </h5>
                                                <div className="flex items-center gap-2">
                                                    {renderStars(review.rating)}
                                                    <span className="text-sm text-[#777]">
                                                        {formatDate(review.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {review.title && (
                                            <h6 className="font-serif font-medium text-darkgray mb-2">
                                                {review.title}
                                            </h6>
                                        )}
                                    </div>
                                    
                                    {review.recommend && (
                                        <div className="flex items-center gap-1 text-green-600 text-sm">
                                            <i className="fas fa-thumbs-up"></i>
                                            <span>Recommended</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="review-content">
                                    <p className="text-[#777] leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            </m.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VehicleReviews
