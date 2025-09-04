import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSuggestions } from '../../api/searchService'

const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

const UnifiedSearch = ({ className = '' }) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 300)
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!debounced || debounced.length < 2) {
        setSuggestions([])
        return
      }
      try {
        const res = await getSuggestions(debounced)
        setSuggestions(Array.isArray(res) ? res.slice(0, 8) : [])
      } catch {
        setSuggestions([])
      }
    }
    fetch()
  }, [debounced])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!query) return
    navigate(`/search?query=${encodeURIComponent(query)}`)
  }

  return (
    <div className={`relative w-full max-w-[720px] mx-auto ${className}`}>
      <form onSubmit={onSubmit} className="flex bg-white rounded-md shadow-md overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search destinations, rentals, tours, properties, cars..."
          className="flex-1 px-4 py-3 outline-none text-[#232323]"
          aria-label="Unified search"
        />
        <button type="submit" className="px-5 py-3 bg-[#232323] text-white uppercase text-sm">Search</button>
      </form>
      {isOpen && suggestions?.length > 0 && (
        <ul className="absolute z-[20] w-full bg-white shadow-lg rounded-b-md max-h-[260px] overflow-auto">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => navigate(`/search?query=${encodeURIComponent(s?.text || s)}`)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#232323]"
              >
                {typeof s === 'string' ? s : s?.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UnifiedSearch


