import React from 'react'
import Buttons from '../Button/Buttons'

const chip = 'px-3 py-1 rounded-full text-xs border transition-colors'

const AttractionsFiltersBar = ({ value = {}, onChange }) => {
  const set = (patch) => onChange?.({ ...value, ...patch })

  return (
    <div className="bg-white border-b border-mediumgray">
      <div className="container mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-700 mr-2">Filter:</span>
        <button className={`${chip} ${value.freeCancellation ? 'bg-black text-white border-black' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'}`} onClick={() => set({ freeCancellation: !value.freeCancellation })}>Free cancellation</button>
        <button className={`${chip} ${value.instantConfirmation ? 'bg-black text-white border-black' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'}`} onClick={() => set({ instantConfirmation: !value.instantConfirmation })}>Instant confirmation</button>
        <button className={`${chip} ${value.bestSeller ? 'bg-black text-white border-black' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'}`} onClick={() => set({ bestSeller: !value.bestSeller })}>Best seller</button>
        <button className={`${chip} ${value.topRated ? 'bg-black text-white border-black' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'}`} onClick={() => set({ topRated: !value.topRated })}>Top rated 4.5+</button>
        <button className={`${chip} ${value.familyFriendly ? 'bg-black text-white border-black' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'}`} onClick={() => set({ familyFriendly: !value.familyFriendly })}>Family friendly</button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-700">Sort by:</span>
          <select value={value.sort || ''} onChange={(e) => set({ sort: e.target.value })} className="text-sm border border-gray-300 rounded px-2 py-1">
            <option value="">Recommended</option>
            <option value="rating_desc">Rating (high to low)</option>
            <option value="price_asc">Price (low to high)</option>
            <option value="price_desc">Price (high to low)</option>
            <option value="popular">Most popular</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default AttractionsFiltersBar
