import React from 'react'
import { m } from 'framer-motion'
import { useToggleFavorite, useFavorites } from '../../api/useFavorites'

const WishlistButton = ({ 
  itemId, 
  itemType = 'bnb', 
  className = "",
  size = "md" 
}) => {
  const { data: favorites } = useFavorites()
  const toggleFavorite = useToggleFavorite()

  const isFavorited = favorites?.some(fav => 
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
  )
}

export default WishlistButton
