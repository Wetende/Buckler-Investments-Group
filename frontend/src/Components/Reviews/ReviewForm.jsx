import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { m } from 'framer-motion'

// Components
import { Input, Textarea } from '../Form/Form'
import Buttons from '../Button/Buttons'
import { fadeIn } from '../../Functions/GlobalAnimations'

// Hooks
import { useCreateReview } from '../../api/useReviews'

const StarRating = ({ rating, onRatingChange, disabled = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onRatingChange(star)}
          className={`text-2xl transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${!disabled ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

const ReviewForm = ({ bookingId, listingId, onSuccess, className = "" }) => {
  const createReview = useCreateReview()

  const reviewSchema = Yup.object().shape({
    rating: Yup.number()
      .required('Rating is required')
      .min(1, 'Please select a rating')
      .max(5, 'Rating cannot exceed 5 stars'),
    title: Yup.string()
      .required('Review title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    content: Yup.string()
      .required('Review content is required')
      .min(20, 'Please provide a more detailed review (at least 20 characters)')
      .max(1000, 'Review cannot exceed 1000 characters'),
    would_recommend: Yup.boolean()
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await createReview.mutateAsync({
        booking_id: bookingId,
        listing_id: listingId,
        ...values
      })
      
      resetForm()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <m.div {...fadeIn} className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="heading-5 font-serif text-darkgray mb-6">Write a Review</h3>
      
      <Formik
        initialValues={{
          rating: 0,
          title: '',
          content: '',
          would_recommend: true
        }}
        validationSchema={reviewSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-darkgray mb-2">
                Overall Rating *
              </label>
              <StarRating
                rating={values.rating}
                onRatingChange={(rating) => setFieldValue('rating', rating)}
              />
              {errors.rating && touched.rating && (
                <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Review Title */}
            <Input
              name="title"
              label="Review Title *"
              placeholder="Summarize your experience in a few words"
              labelClass="!mb-[5px] font-medium"
            />

            {/* Review Content */}
            <Textarea
              name="content"
              label="Your Review *"
              placeholder="Tell future guests about your experience. What did you love about this place?"
              rows="5"
              labelClass="!mb-[5px] font-medium"
            />

            {/* Recommendation */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="would_recommend"
                checked={values.would_recommend}
                onChange={(e) => setFieldValue('would_recommend', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label 
                htmlFor="would_recommend" 
                className="text-sm font-medium text-darkgray"
              >
                I would recommend this place to others
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <Buttons
                type="submit"
                disabled={isSubmitting || createReview.isLoading}
                className={`btn-fill btn-fancy font-medium font-serif rounded-none uppercase ${
                  isSubmitting || createReview.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                themeColor="#232323"
                color="#fff"
                title={isSubmitting || createReview.isLoading ? 'Submitting...' : 'Submit Review'}
              />
            </div>
          </Form>
        )}
      </Formik>
    </m.div>
  )
}

export default ReviewForm
