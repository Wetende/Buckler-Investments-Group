import React, { useCallback } from 'react'

// Libraries
import PropTypes from 'prop-types'

// Components
import MultiRangeSlider from "../Products/MultiRangeSlider"

// API hooks
import { useTourCategories } from '../../api/useTours'

const CheckboxRow = ({ label, checked, onChange, name }) => (
  <label className="flex items-center justify-between mb-3 cursor-pointer">
    <span className="text-sm text-darkgray">{label}</span>
    <input
      type="checkbox"
      name={name}
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4"
    />
  </label>
)

const RatingRow = ({ value, selected, onSelect, label }) => (
  <label className="flex items-center justify-between mb-3 cursor-pointer">
    <span className="text-sm text-darkgray">{label}</span>
    <input
      type="radio"
      name="rating_gte"
      checked={selected === value}
      onChange={() => onSelect(value)}
      className="w-4 h-4"
    />
  </label>
)

const ToursSideFilters = ({ value = {}, onChange }) => {
  const { data: categories = [], isLoading: loadingCats } = useTourCategories()

  const setFilter = useCallback(
    (patch) => {
      onChange?.({ ...(value || {}), ...patch })
    },
    [onChange, value]
  )

  return (
    <aside className="shopping-sidebar">
      {/* Category */}
      <div className="border-b border-mediumgray pb-12 mb-12 relative">
        <span className="shop-title relative font-serif font-medium text-darkgray block mb-[20px]">Category</span>
        <ul className="list-style filter-category">
          {loadingCats && <li className="text-sm text-gray-500">Loading categories…</li>}
          {!loadingCats && (categories || []).map((cat) => (
            <li key={cat.slug || cat.id || cat}>
              <button
                type="button"
                className={`flex items-center justify-between w-full text-left hover:text-darkgray ${value.category === (cat.slug || cat) ? 'font-semibold' : ''}`}
                onClick={() => setFilter({ category: cat.slug || cat })}
              >
                <span>{cat.name || cat.title || cat}</span>
                {value.category === (cat.slug || cat) && <span className="text-[11px] text-neonorange">Selected</span>}
              </button>
            </li>
          ))}
          {value.category && (
            <li className="mt-3">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-darkgray"
                onClick={() => setFilter({ category: undefined })}
              >
                Clear category
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Flags */}
      <div className="border-b border-mediumgray pb-12 mb-12 relative">
        <span className="shop-title relative font-serif font-medium text-darkgray block mb-[20px]">Popular filters</span>
        <div>
          <CheckboxRow
            name="free_cancellation"
            label="Free cancellation"
            checked={value.free_cancellation}
            onChange={(v) => setFilter({ free_cancellation: v || undefined })}
          />
          <CheckboxRow
            name="instant_confirmation"
            label="Instant confirmation"
            checked={value.instant_confirmation}
            onChange={(v) => setFilter({ instant_confirmation: v || undefined })}
          />
          <CheckboxRow
            name="family_friendly"
            label="Family friendly"
            checked={value.family_friendly}
            onChange={(v) => setFilter({ family_friendly: v || undefined })}
          />
        </div>
      </div>

  {/* Price (backend supports only max_price today) */}
      <div className="border-b border-mediumgray pb-12 mb-12">
        <span className="shop-title relative font-serif font-medium text-darkgray block mb-[26px]">Price range (KES)</span>
        <MultiRangeSlider
          min={0}
          max={500000}
          onChange={({ min, max }) => setFilter({ min_price: min, max_price: max })}
        />
      </div>

      {/* Rating */}
      <div className="border-b border-mediumgray pb-12 mb-12 relative">
        <span className="shop-title relative font-serif font-medium text-darkgray block mb-[26px]">Review score</span>
        <div>
          <RatingRow value={4.5} selected={value.rating_gte} label="Wonderful 4.5+" onSelect={(v) => setFilter({ rating_gte: v })} />
          <RatingRow value={4.0} selected={value.rating_gte} label="Very good 4.0+" onSelect={(v) => setFilter({ rating_gte: v })} />
          <RatingRow value={3.5} selected={value.rating_gte} label="Good 3.5+" onSelect={(v) => setFilter({ rating_gte: v })} />
          {value.rating_gte && (
            <button type="button" className="mt-2 text-xs text-gray-500 hover:text-darkgray" onClick={() => setFilter({ rating_gte: undefined })}>
              Clear rating
            </button>
          )}
        </div>
      </div>

      {/* Clear all */}
      <div>
        <button
          type="button"
          className="btn btn-small btn-transparent-dark border border-mediumgray px-4 py-2 text-sm"
          onClick={() => onChange?.({})}
        >
          Clear all filters
        </button>
      </div>
    </aside>
  )
}

ToursSideFilters.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
}

export default ToursSideFilters
