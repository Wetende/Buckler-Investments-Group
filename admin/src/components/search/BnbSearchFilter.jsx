import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, Icon } from '@/components/Component';
import { useDebounce } from '@/hooks/useDebounce';

const BnbSearchFilter = ({
  onSearch,
  onFilter,
  searchPlaceholder = 'Search...',
  filterOptions = {},
  initialFilters = {},
  showDateRange = false,
  showPriceRange = false,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch?.(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  // Trigger filter when filters change
  useEffect(() => {
    const allFilters = {
      ...filters,
      ...(showDateRange && dateRange.start && dateRange.end ? { 
        start_date: dateRange.start, 
        end_date: dateRange.end 
      } : {}),
      ...(showPriceRange && (priceRange.min || priceRange.max) ? {
        min_price: priceRange.min || undefined,
        max_price: priceRange.max || undefined
      } : {})
    };
    onFilter?.(allFilters);
  }, [filters, dateRange, priceRange, showDateRange, showPriceRange, onFilter]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleDateRangeChange = useCallback((field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePriceRangeChange = useCallback((field, value) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setFilters(initialFilters);
    setDateRange({ start: '', end: '' });
    setPriceRange({ min: '', max: '' });
    onSearch?.('');
    onFilter?.(initialFilters);
  }, [initialFilters, onSearch, onFilter]);

  const hasActiveFilters = searchQuery || 
    Object.values(filters).some(value => value && value !== 'all' && value !== '') ||
    (showDateRange && (dateRange.start || dateRange.end)) ||
    (showPriceRange && (priceRange.min || priceRange.max));

  return (
    <div className={`bnb-search-filter ${className}`}>
      {/* Search Bar */}
      <Row className="g-3 align-items-center mb-3">
        <Col lg="8" md="12" sm="12">
          <div className="form-control-wrap">
            <div className="form-icon form-icon-right">
              <Icon name="search" />
            </div>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Col>
        <Col lg="4" md="12" sm="12">
          <div className="d-flex justify-content-end justify-content-md-start gap-2">
            <Button
              color="light"
              outline
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`${showAdvancedFilters ? 'active' : ''} w-100 w-lg-auto`}
            >
              <Icon name="filter" />
              <span className="d-inline d-sm-inline">Filters</span>
              {hasActiveFilters && (
                <span className="badge badge-primary ms-1">
                  {Object.values(filters).filter(v => v && v !== 'all' && v !== '').length + 
                   (searchQuery ? 1 : 0) +
                   (showDateRange && (dateRange.start || dateRange.end) ? 1 : 0) +
                   (showPriceRange && (priceRange.min || priceRange.max) ? 1 : 0)}
                </span>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                color="light"
                outline
                onClick={clearAllFilters}
                title="Clear all filters"
                className="flex-shrink-0"
              >
                <Icon name="cross" />
                <span className="d-none d-lg-inline ms-1">Clear</span>
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="advanced-filters p-3 p-md-4 bg-light rounded mb-4">
          <Row className="g-3">
            {/* Standard Filter Options */}
            {Object.entries(filterOptions).map(([key, option]) => (
              <Col key={key} xs="12" sm="6" md="4" lg="3">
                <div className="form-group">
                  <label className="form-label">{option.label}</label>
                  {option.type === 'select' ? (
                    <select
                      className="form-select"
                      value={filters[key] || 'all'}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    >
                      <option value="all">All {option.label}</option>
                      {option.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : option.type === 'date' ? (
                    <input
                      type="date"
                      className="form-control"
                      value={filters[key] || ''}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    />
                  ) : option.type === 'number' ? (
                    <input
                      type="number"
                      className="form-control"
                      placeholder={option.placeholder}
                      value={filters[key] || ''}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      min={option.min}
                      max={option.max}
                      step={option.step}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={option.placeholder}
                      value={filters[key] || ''}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    />
                  )}
                </div>
              </Col>
            ))}

            {/* Date Range Filter */}
            {showDateRange && (
              <>
                <Col xs="12" sm="6" md="4" lg="3">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateRange.start}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    />
                  </div>
                </Col>
                <Col xs="12" sm="6" md="4" lg="3">
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateRange.end}
                      min={dateRange.start}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    />
                  </div>
                </Col>
              </>
            )}

            {/* Price Range Filter */}
            {showPriceRange && (
              <>
                <Col xs="12" sm="6" md="4" lg="3">
                  <div className="form-group">
                    <label className="form-label">Min Price (KES)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      min="0"
                      step="100"
                    />
                  </div>
                </Col>
                <Col xs="12" sm="6" md="4" lg="3">
                  <div className="form-group">
                    <label className="form-label">Max Price (KES)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="No limit"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      min={priceRange.min || "0"}
                      step="100"
                    />
                  </div>
                </Col>
              </>
            )}
          </Row>

          {/* Quick Filter Buttons */}
          <div className="mt-3">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              {filterOptions.status?.options && (
                <>
                  <span className="small text-muted me-2 d-none d-sm-inline">Quick Status:</span>
                  <span className="small text-muted me-2 d-sm-none">Status:</span>
                  <div className="btn-group-sm d-flex flex-wrap gap-1" role="group">
                    {filterOptions.status.options.map(status => (
                      <Button
                        key={status.value}
                        size="sm"
                        color={filters.status === status.value ? 'primary' : 'light'}
                        outline={filters.status !== status.value}
                        onClick={() => handleFilterChange('status', 
                          filters.status === status.value ? 'all' : status.value
                        )}
                        className="flex-shrink-0"
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showAdvancedFilters && (
        <div className="active-filters mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="small text-muted">Active filters:</span>
            
            {searchQuery && (
              <span className="badge badge-soft-primary">
                Search: "{searchQuery}"
                <button 
                  type="button" 
                  className="btn-close btn-close-sm ms-1"
                  onClick={() => setSearchQuery('')}
                ></button>
              </span>
            )}

            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === 'all') return null;
              const option = filterOptions[key];
              const displayValue = option?.options?.find(opt => opt.value === value)?.label || value;
              
              return (
                <span key={key} className="badge badge-soft-info">
                  {option?.label}: {displayValue}
                  <button 
                    type="button" 
                    className="btn-close btn-close-sm ms-1"
                    onClick={() => handleFilterChange(key, 'all')}
                  ></button>
                </span>
              );
            })}

            {showDateRange && (dateRange.start || dateRange.end) && (
              <span className="badge badge-soft-warning">
                Date: {dateRange.start || 'Any'} to {dateRange.end || 'Any'}
                <button 
                  type="button" 
                  className="btn-close btn-close-sm ms-1"
                  onClick={() => setDateRange({ start: '', end: '' })}
                ></button>
              </span>
            )}

            {showPriceRange && (priceRange.min || priceRange.max) && (
              <span className="badge badge-soft-success">
                Price: KES {priceRange.min || '0'} - {priceRange.max || '∞'}
                <button 
                  type="button" 
                  className="btn-close btn-close-sm ms-1"
                  onClick={() => setPriceRange({ min: '', max: '' })}
                ></button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BnbSearchFilter;
