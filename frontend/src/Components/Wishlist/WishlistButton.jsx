import React from 'react'
import { m } from 'framer-motion'
import { useToggleFavorite, useFavorites } from '../../api/useFavorites'
import AuthRequiredWrapper from '../Auth/AuthRequiredWrapper'
import { useAuth } from '../../api/useAuth'

const WishlistButton = ({ 
  itemId, 
  itemType = 'bnb', 
  className = "",
  size = "md" 
}) => {
  const { isAuthenticated } = useAuth()
  const { data: favorites } = useFavorites({}, isAuthenticated) // Only fetch when authenticated
  const toggleFavorite = useToggleFavorite()

  const isFavorited = isAuthenticated && favorites?.some(fav => 
    fav.item_id === itemId && fav.item_type === itemType
  )

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await toggleFavorite.mutateAsync({
        item_id: itemId,
        item_type: itemType,
        action: isFavorited ? 'remove' : 'add'
      })
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-12 h-12 text-lg"
  }

  return (
    <AuthRequiredWrapper
      modalTitle="Sign in to save favorites"
      modalSubtitle="Save your favorite places to view them later"
      fallbackButton={
        <m.button
          className={`
            ${sizeClasses[size]}
            rounded-full bg-white shadow-lg border border-gray-200
            flex items-center justify-center
            hover:shadow-xl transition-all duration-200
            cursor-pointer
            ${className}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Sign in to add to wishlist"
        >
          <i className="far fa-heart text-gray-600 transition-colors duration-200" />
        </m.button>
      }
    >
      <m.button
        onClick={handleToggle}
        disabled={toggleFavorite.isLoading}
        className={`
          ${sizeClasses[size]}
          rounded-full bg-white shadow-lg border border-gray-200
          flex items-center justify-center
          hover:shadow-xl transition-all duration-200
          ${toggleFavorite.isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <i 
          className={`
            ${isFavorited ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-600'}
            transition-colors duration-200
          `}
        />
      </m.button>
    </AuthRequiredWrapper>
  )
}

export default WishlistButton
