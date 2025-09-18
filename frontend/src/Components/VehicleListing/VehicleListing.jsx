import React, { useState, useCallback } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import VehicleCard from '../VehicleCard/VehicleCard'
import CarSearch from '../CarSearch/CarSearch'
import Buttons from '../Button/Buttons'
import { useVehiclesSearch, useVehicles } from '../../api/useCars'
import { useFavorites } from '../../api/useFavorites'
import { fadeIn, fadeInUp } from '../../Functions/GlobalAnimations'

const VehicleListing = ({ 
    className = '',
    showSearch = true,
    initialFilters = {},
    title = "Available Vehicles",
    subtitle = "Find the perfect vehicle for your journey"
}) => {
    const [searchFilters, setSearchFilters] = useState(initialFilters)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [sortBy, setSortBy] = useState('price_asc')
    const [viewMode, setViewMode] = useState('grid') // grid or list

    // Use search if filters are provided, otherwise use general listing
    const hasSearchFilters = Object.keys(searchFilters).length > 0
    
    const { 
        data: searchResults = [], 
        isLoading: isSearchLoading, 
        error: searchError 
    } = useVehiclesSearch(searchFilters, {
        enabled: hasSearchFilters
    })
    
    const { 
        data: allVehicles = [], 
        isLoading: isListLoading, 
        error: listError 
    } = useVehicles({ limit: 50 }, {
        enabled: !hasSearchFilters
    })

    const { toggleFavorite } = useFavorites()

    const vehicles = hasSearchFilters ? searchResults : allVehicles
    const isLoading = hasSearchFilters ? isSearchLoading : isListLoading
    const error = hasSearchFilters ? searchError : listError

    const handleSearch = useCallback((filters) => {
        setSearchFilters(filters)
    }, [])

    const handleToggleAdvanced = () => {
        setShowAdvancedFilters(!showAdvancedFilters)
    }

    const handleFavorite = async (vehicleId, isFavorite) => {
        try {
            await toggleFavorite.mutateAsync({
                item_type: 'vehicle',
                item_id: vehicleId,
                action: isFavorite ? 'add' : 'remove'
            })
        } catch (error) {
            console.error('Failed to toggle favorite:', error)
        }
    }

    const handleBookVehicle = (vehicle) => {
        // Navigate to booking page or open booking modal
        // For now, we'll use URL navigation
        window.location.href = `/cars/${vehicle.id}/book`
    }

    const sortedVehicles = React.useMemo(() => {
        if (!vehicles || vehicles.length === 0) return []
        
        const sorted = [...vehicles]
        
        switch (sortBy) {
            case 'price_asc':
                return sorted.sort((a, b) => a.daily_rate - b.daily_rate)
            case 'price_desc':
                return sorted.sort((a, b) => b.daily_rate - a.daily_rate)
            case 'name_asc':
                return sorted.sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`))
            case 'year_desc':
                return sorted.sort((a, b) => b.year - a.year)
            default:
                return sorted
        }
    }, [vehicles, sortBy])

    if (error) {
        return (
            <Container>
                <Row className="justify-center">
                    <Col lg={8}>
                        <div className="text-center py-[100px]">
                            <h3 className="font-serif font-semibold text-darkgray mb-4">
                                Unable to load vehicles
                            </h3>
                            <p className="text-[#777] mb-6">
                                {error.message || 'Something went wrong while fetching vehicles.'}
                            </p>
                            <Buttons
                                onClick={() => window.location.reload()}
                                className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#ca943d"
                                color="#fff"
                                title="Try Again"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <div className={`vehicle-listing ${className}`}>
            {/* Search Section */}
            {showSearch && (
                <Container className="mb-[80px]">
                    <Row className="justify-center">
                        <Col lg={12}>
                            <CarSearch
                                onSearch={handleSearch}
                                initialFilters={searchFilters}
                                showAdvancedFilters={showAdvancedFilters}
                                onToggleAdvanced={handleToggleAdvanced}
                            />
                        </Col>
                    </Row>
                </Container>
            )}

            <Container>
                {/* Header Section */}
                <Row className="justify-center mb-[60px]">
                    <Col lg={8} className="text-center">
                        <m.div {...fadeIn}>
                            <h2 className="heading-4 font-serif font-semibold text-darkgray mb-4">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-[#777] text-lg">
                                    {subtitle}
                                </p>
                            )}
                        </m.div>
                    </Col>
                </Row>

                {/* Results Header */}
                <Row className="justify-between align-items-center mb-[40px]">
                    <Col lg={6}>
                        <div className="results-info">
                            {!isLoading && (
                                <p className="text-[#777] mb-0">
                                    {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? 's' : ''} found
                                    {hasSearchFilters && ' for your search'}
                                </p>
                            )}
                        </div>
                    </Col>
                    
                    <Col lg={6}>
                        <div className="results-controls d-flex align-items-center justify-content-end gap-3">
                            {/* Sort Dropdown */}
                            <select
                                className="form-control w-auto"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                                <option value="year_desc">Year: Newest First</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="view-mode-toggle">
                                <button
                                    className={`p-2 ${viewMode === 'grid' ? 'text-[#ca943d]' : 'text-[#777]'}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <i className="feather-grid"></i>
                                </button>
                                <button
                                    className={`p-2 ${viewMode === 'list' ? 'text-[#ca943d]' : 'text-[#777]'}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <i className="feather-list"></i>
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Loading State */}
                {isLoading && (
                    <Row>
                        {[...Array(6)].map((_, index) => (
                            <Col key={index} lg={4} md={6} className="mb-[30px]">
                                <div className="vehicle-card-skeleton bg-[#f8f9fa] rounded-[6px] overflow-hidden animate-pulse">
                                    <div className="h-[250px] bg-[#e9ecef]"></div>
                                    <div className="p-[25px]">
                                        <div className="h-4 bg-[#e9ecef] rounded mb-2"></div>
                                        <div className="h-3 bg-[#e9ecef] rounded mb-4 w-2/3"></div>
                                        <div className="flex gap-4 mb-4">
                                            <div className="h-3 bg-[#e9ecef] rounded w-16"></div>
                                            <div className="h-3 bg-[#e9ecef] rounded w-16"></div>
                                            <div className="h-3 bg-[#e9ecef] rounded w-16"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-8 bg-[#e9ecef] rounded flex-1"></div>
                                            <div className="h-8 bg-[#e9ecef] rounded flex-1"></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Vehicle Grid */}
                {!isLoading && sortedVehicles.length > 0 && (
                    <Row>
                        {sortedVehicles.map((vehicle, index) => (
                            <Col 
                                key={vehicle.id} 
                                lg={viewMode === 'grid' ? 4 : 12} 
                                md={viewMode === 'grid' ? 6 : 12} 
                                className="mb-[30px]"
                            >
                                <m.div
                                    {...fadeInUp}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <VehicleCard
                                        vehicle={vehicle}
                                        onBook={handleBookVehicle}
                                        onFavorite={handleFavorite}
                                        isFavorite={vehicle.is_favorite || false}
                                        className={viewMode === 'list' ? 'flex-row' : ''}
                                    />
                                </m.div>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* No Results */}
                {!isLoading && sortedVehicles.length === 0 && (
                    <Row className="justify-center">
                        <Col lg={8}>
                            <div className="text-center py-[100px]">
                                <i className="feather-search text-[#ca943d] text-[60px] mb-6"></i>
                                <h3 className="font-serif font-semibold text-darkgray mb-4">
                                    No vehicles found
                                </h3>
                                <p className="text-[#777] mb-6">
                                    {hasSearchFilters 
                                        ? 'Try adjusting your search criteria to find more vehicles.'
                                        : 'No vehicles are currently available.'
                                    }
                                </p>
                                {hasSearchFilters && (
                                    <Buttons
                                        onClick={() => setSearchFilters({})}
                                        className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                        themeColor="#ca943d"
                                        color="#fff"
                                        title="Clear Search"
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    )
}

export default VehicleListing
