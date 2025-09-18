import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import Buttons from '../Button/Buttons'
import CarBookingModal from '../BookingModal/CarBookingModal'
import { fadeIn } from '../../Functions/GlobalAnimations'

const VehicleCard = ({ 
    vehicle, 
    onBook, 
    onFavorite,
    isFavorite = false,
    showBookButton = true,
    className = '' 
}) => {
    const [imageError, setImageError] = useState(false)
    const [showBookingModal, setShowBookingModal] = useState(false)

    if (!vehicle) return null

    const {
        id,
        make,
        model,
        year,
        daily_rate,
        currency = 'KES',
        category,
        transmission,
        fuel_type,
        seats,
        images = [],
        location,
        description,
        features = [],
        status
    } = vehicle

    const primaryImage = images && images.length > 0 
        ? images[0] 
        : 'https://via.placeholder.com/400x300?text=No+Image'

    const handleImageError = () => {
        setImageError(true)
    }

    const handleBookClick = () => {
        if (onBook) {
            onBook(vehicle)
        } else {
            setShowBookingModal(true)
        }
    }

    const handleFavoriteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (onFavorite) {
            onFavorite(vehicle.id, !isFavorite)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    const getStatusBadge = () => {
        const statusConfig = {
            available: { color: 'bg-green-500', text: 'Available' },
            rented: { color: 'bg-red-500', text: 'Rented' },
            maintenance: { color: 'bg-yellow-500', text: 'Maintenance' }
        }
        
        const config = statusConfig[status] || statusConfig.available
        
        return (
            <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded ${config.color}`}>
                {config.text}
            </span>
        )
    }

    return (
        <m.div
            {...fadeIn}
            className={`vehicle-card bg-white rounded-[6px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 ${className}`}
        >
            <div className="relative overflow-hidden group">
                {/* Vehicle Image */}
                <Link to={`/cars/${id}`}>
                    <img
                        className="w-full h-[250px] object-cover transition-transform duration-500 group-hover:scale-105"
                        src={imageError ? 'https://via.placeholder.com/400x300?text=No+Image' : primaryImage}
                        alt={`${make} ${model}`}
                        onError={handleImageError}
                        loading="lazy"
                    />
                </Link>

                {/* Overlay with quick actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                        <Link 
                            to={`/cars/${id}`}
                            className="bg-white text-darkgray hover:bg-[#ca943d] hover:text-white transition-all duration-300 w-10 h-10 rounded-full flex items-center justify-center"
                        >
                            <i className="feather-eye text-sm"></i>
                        </Link>
                        
                        {onFavorite && (
                            <button
                                onClick={handleFavoriteClick}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isFavorite 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-white text-darkgray hover:bg-red-500 hover:text-white'
                                }`}
                            >
                                <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-sm`}></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    {getStatusBadge()}
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-[#ca943d] text-white px-3 py-1 rounded-full">
                    <span className="font-serif font-semibold text-sm">
                        {formatPrice(daily_rate)}/day
                    </span>
                </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-[25px]">
                <div className="mb-3">
                    <Link to={`/cars/${id}`}>
                        <h3 className="font-serif font-semibold text-darkgray text-lg hover:text-[#ca943d] transition-colors duration-300 mb-1">
                            {make} {model} ({year})
                        </h3>
                    </Link>
                    <p className="text-[#777] text-sm capitalize">{category}</p>
                </div>

                {/* Vehicle Features */}
                <div className="flex items-center gap-4 text-[#777] text-sm mb-4">
                    <span className="flex items-center gap-1">
                        <i className="feather-users text-[#ca943d]"></i>
                        {seats} seats
                    </span>
                    <span className="flex items-center gap-1">
                        <i className="feather-settings text-[#ca943d]"></i>
                        {transmission}
                    </span>
                    <span className="flex items-center gap-1">
                        <i className="feather-zap text-[#ca943d]"></i>
                        {fuel_type}
                    </span>
                </div>

                {/* Location */}
                {location && (
                    <div className="flex items-center gap-1 text-[#777] text-sm mb-4">
                        <i className="feather-map-pin text-[#ca943d]"></i>
                        {location}
                    </div>
                )}

                {/* Additional Features */}
                {features && features.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {features.slice(0, 3).map((feature, index) => (
                                <span 
                                    key={index}
                                    className="inline-block bg-[#f8f9fa] text-[#777] text-xs px-2 py-1 rounded"
                                >
                                    {feature}
                                </span>
                            ))}
                            {features.length > 3 && (
                                <span className="inline-block bg-[#f8f9fa] text-[#777] text-xs px-2 py-1 rounded">
                                    +{features.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                {description && (
                    <p className="text-[#777] text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Link to={`/cars/${id}`} className="flex-1">
                        <Buttons
                            className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase w-full"
                            themeColor="#ca943d"
                            color="#ca943d"
                            size="sm"
                            title="View Details"
                        />
                    </Link>
                    
                    {showBookButton && status === 'available' && (
                        <Buttons
                            onClick={handleBookClick}
                            className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase flex-1"
                            themeColor="#ca943d"
                            color="#fff"
                            size="sm"
                            title="Book Now"
                        />
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            <CarBookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                vehicle={vehicle}
            />
        </m.div>
    )
}

export default VehicleCard
