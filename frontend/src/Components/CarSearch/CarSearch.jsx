import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { m } from 'framer-motion'
import Buttons from '../Button/Buttons'
import { useVehicleCategories, useLocations } from '../../api/useCars'
import { fadeIn } from '../../Functions/GlobalAnimations'

const CarSearch = ({ 
    onSearch, 
    initialFilters = {}, 
    className = '',
    showAdvancedFilters = false,
    onToggleAdvanced 
}) => {
    const [filters, setFilters] = useState({
        location: '',
        pickup_date: '',
        return_date: '',
        category: '',
        min_price: '',
        max_price: '',
        transmission: '',
        fuel_type: '',
        seats: '',
        ...initialFilters
    })

    const { data: categories = [] } = useVehicleCategories()
    const { data: locations = [] } = useLocations()

    const handleInputChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSearch = () => {
        // Filter out empty values
        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value && value !== '') {
                acc[key] = value
            }
            return acc
        }, {})

        onSearch(activeFilters)
    }

    const clearFilters = () => {
        setFilters({
            location: '',
            pickup_date: '',
            return_date: '',
            category: '',
            min_price: '',
            max_price: '',
            transmission: '',
            fuel_type: '',
            seats: '',
        })
        onSearch({})
    }

    // Auto-search when basic filters change (location, dates)
    useEffect(() => {
        if (filters.location || filters.pickup_date || filters.return_date) {
            const basicFilters = {
                location: filters.location,
                pickup_date: filters.pickup_date,
                return_date: filters.return_date
            }
            
            const activeBasicFilters = Object.entries(basicFilters).reduce((acc, [key, value]) => {
                if (value && value !== '') {
                    acc[key] = value
                }
                return acc
            }, {})

            onSearch(activeBasicFilters)
        }
    }, [filters.location, filters.pickup_date, filters.return_date, onSearch])

    return (
        <m.div {...fadeIn} className={`car-search ${className}`}>
            <div className="search-form bg-white p-[50px] lg:p-[40px] md:p-[30px] sm:p-[25px] rounded-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                {/* Basic Search Fields */}
                <Row className="g-4 mb-4">
                    <Col lg={3} md={6}>
                        <div className="form-group">
                            <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                Pickup Location
                            </label>
                            <select
                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                value={filters.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {locations.map(location => (
                                    <option key={location.value} value={location.value}>
                                        {location.label} ({location.count})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Col>
                    
                    <Col lg={3} md={6}>
                        <div className="form-group">
                            <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                Pickup Date
                            </label>
                            <input
                                type="date"
                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                value={filters.pickup_date}
                                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </Col>
                    
                    <Col lg={3} md={6}>
                        <div className="form-group">
                            <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                Return Date
                            </label>
                            <input
                                type="date"
                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                value={filters.return_date}
                                onChange={(e) => handleInputChange('return_date', e.target.value)}
                                min={filters.pickup_date || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </Col>
                    
                    <Col lg={3} md={6}>
                        <div className="form-group">
                            <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                Vehicle Type
                            </label>
                            <select
                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                value={filters.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label} ({category.count})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Col>
                </Row>

                {/* Advanced Filters - Only show if enabled */}
                {showAdvancedFilters && (
                    <m.div 
                        {...fadeIn}
                        className="advanced-filters border-t border-[#efefef] pt-4 mt-4"
                    >
                        <Row className="g-4 mb-4">
                            <Col lg={3} md={6}>
                                <div className="form-group">
                                    <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                        Min Price (KES/day)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                        value={filters.min_price}
                                        onChange={(e) => handleInputChange('min_price', e.target.value)}
                                        placeholder="Min price"
                                        min="0"
                                    />
                                </div>
                            </Col>
                            
                            <Col lg={3} md={6}>
                                <div className="form-group">
                                    <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                        Max Price (KES/day)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                        value={filters.max_price}
                                        onChange={(e) => handleInputChange('max_price', e.target.value)}
                                        placeholder="Max price"
                                        min="0"
                                    />
                                </div>
                            </Col>
                            
                            <Col lg={3} md={6}>
                                <div className="form-group">
                                    <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                        Transmission
                                    </label>
                                    <select
                                        className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                        value={filters.transmission}
                                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                                    >
                                        <option value="">Any</option>
                                        <option value="manual">Manual</option>
                                        <option value="automatic">Automatic</option>
                                    </select>
                                </div>
                            </Col>
                            
                            <Col lg={3} md={6}>
                                <div className="form-group">
                                    <label className="form-label font-serif font-medium text-darkgray mb-[10px] block">
                                        Fuel Type
                                    </label>
                                    <select
                                        className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf] text-md"
                                        value={filters.fuel_type}
                                        onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                                    >
                                        <option value="">Any</option>
                                        <option value="petrol">Petrol</option>
                                        <option value="diesel">Diesel</option>
                                        <option value="electric">Electric</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </Col>
                        </Row>
                    </m.div>
                )}

                {/* Action Buttons */}
                <Row className="g-3 align-items-center">
                    <Col lg={6}>
                        <div className="d-flex align-items-center gap-3">
                            <Buttons
                                onClick={handleSearch}
                                className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#ca943d"
                                color="#fff"
                                size="lg"
                                title="Search Vehicles"
                            />
                            
                            <Buttons
                                onClick={clearFilters}
                                className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#ca943d"
                                color="#ca943d"
                                size="lg"
                                title="Clear"
                            />
                        </div>
                    </Col>
                    
                    <Col lg={6}>
                        <div className="text-right">
                            {onToggleAdvanced && (
                                <button
                                    onClick={onToggleAdvanced}
                                    className="font-serif text-darkgray hover:text-[#ca943d] transition-colors duration-300"
                                >
                                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                                </button>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </m.div>
    )
}

export default CarSearch
