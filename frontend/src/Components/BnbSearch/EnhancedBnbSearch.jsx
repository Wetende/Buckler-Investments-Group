import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '../Form/Form';
import Buttons from '../Button/Buttons';
import { m } from 'framer-motion';
import { fadeIn } from '../../Functions/GlobalAnimations';

const EnhancedBnbSearch = ({ onSearch, className = "" }) => {
  const [showFilters, setShowFilters] = useState(false);

  // Kenyan locations for autocomplete
  const kenyanLocations = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Malindi', 'Diani Beach', 'Watamu', 'Lamu', 'Nyeri', 'Meru',
    'Kakamega', 'Kitale', 'Garissa', 'Isiolo', 'Masai Mara', 'Amboseli'
  ];

  const propertyTypes = [
    { value: 'entire', label: 'Entire place' },
    { value: 'private', label: 'Private room' },
    { value: 'shared', label: 'Shared room' },
    { value: 'hotel', label: 'Hotel room' }
  ];

  const amenities = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Free parking' },
    { value: 'pool', label: 'Swimming pool' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'ac', label: 'Air conditioning' },
    { value: 'gym', label: 'Gym' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'pets', label: 'Pet friendly' }
  ];

  return (
    <section className={`py-[80px] lg:py-[60px] md:py-[50px] sm:py-[40px] bg-white border-b border-mediumgray ${className}`}>
      <Container>
        <Row className="justify-center">
          <Col lg={12}>
            <m.div {...fadeIn} className="bg-white rounded-lg shadow-lg border border-gray-200 p-[30px] lg:p-[25px] md:p-[20px]">
              <Formik
                initialValues={{
                  location: '',
                  check_in: '',
                  check_out: '',
                  adults: 1,
                  children: 0,
                  infants: 0,
                  property_type: '',
                  min_price: '',
                  max_price: '',
                  amenities: []
                }}
                validationSchema={Yup.object({
                  location: Yup.string().required('Location is required for search'),
                  check_in: Yup.string().required('Check-in date is required'),
                  check_out: Yup.string().required('Check-out date is required')
                    .test('after-checkin', 'Check-out must be after check-in', function(value) {
                      const { check_in } = this.parent;
                      return !check_in || !value || new Date(value) > new Date(check_in);
                    }),
                  adults: Yup.number().min(1).max(16),
                  children: Yup.number().min(0).max(10),
                  infants: Yup.number().min(0).max(5),
                  min_price: Yup.number().min(0),
                  max_price: Yup.number().min(0)
                })}
                onSubmit={(values) => {
                  const searchCriteria = {
                    location: values.location,
                    check_in: values.check_in,
                    check_out: values.check_out,
                    guests: values.adults + values.children,
                    property_type: values.property_type || undefined,
                    min_price: values.min_price || undefined,
                    max_price: values.max_price || undefined,
                    amenities: values.amenities.length > 0 ? values.amenities : undefined
                  };
                  if (onSearch) onSearch(searchCriteria);
                }}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
                    {/* Main Search Row */}
                    <div className="grid grid-cols-12 gap-4 items-end mb-6">
                      {/* Location */}
                      <div className="col-span-12 md:col-span-4">
                        <label className="!mb-[10px] font-medium text-darkgray text-base d-block">Where</label>
                        <div className="relative">
                          <Input 
                            name="location" 
                            placeholder="Search destinations"
                            className="w-full !h-[50px] !text-base border-2 border-gray-300 focus:border-basecolor rounded-lg"
                            list="locations"
                          />
                          <datalist id="locations">
                            {kenyanLocations.map((location) => (
                              <option key={location} value={location} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Check-in */}
                      <div className="col-span-6 md:col-span-2">
                        <label className="!mb-[10px] font-medium text-darkgray text-base d-block">Check-in</label>
                        <Input 
                          name="check_in" 
                          type="date"
                          className="w-full !h-[50px] !text-base border-2 border-gray-300 focus:border-basecolor rounded-lg"
                        />
                      </div>

                      {/* Check-out */}
                      <div className="col-span-6 md:col-span-2">
                        <label className="!mb-[10px] font-medium text-darkgray text-base d-block">Check-out</label>
                        <Input 
                          name="check_out" 
                          type="date"
                          className="w-full !h-[50px] !text-base border-2 border-gray-300 focus:border-basecolor rounded-lg"
                        />
                      </div>

                      {/* Guests */}
                      <div className="col-span-8 md:col-span-2">
                        <label className="!mb-[10px] font-medium text-darkgray text-base d-block">Who</label>
                        <div className="flex items-center space-x-2 h-[50px] px-3 border-2 border-gray-300 focus-within:border-basecolor rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => setFieldValue('adults', Math.max(1, values.adults - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                          >
                            -
                          </button>
                          <span className="min-w-[60px] text-center text-base">{values.adults + values.children} guests</span>
                          <button
                            type="button"
                            onClick={() => setFieldValue('adults', Math.min(16, values.adults + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Search Button */}
                      <div className="col-span-4 md:col-span-2">
                        <Buttons
                          ariaLabel="Search stays"
                          type="submit"
                          className="btn-fancy btn-fill font-medium font-serif rounded-lg uppercase w-full h-[50px]"
                          themeColor="#232323"
                          color="#fff"
                          title={isSubmitting ? 'Searching...' : 'Search'}
                        />
                      </div>
                    </div>

                    {/* Filters Toggle */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-base font-medium text-darkgray hover:text-basecolor flex items-center transition-colors"
                      >
                        <i className="feather-sliders mr-2"></i>
                        {showFilters ? 'Hide filters' : 'More filters'}
                      </button>
                      
                      <div className="flex items-center space-x-4 text-base text-darkgray">
                        <span className="font-medium">Property type:</span>
                        <select
                          value={values.property_type}
                          onChange={(e) => setFieldValue('property_type', e.target.value)}
                          className="border-2 border-gray-300 focus:border-basecolor rounded-lg px-3 py-2 text-base"
                        >
                          <option value="">Any type</option>
                          {propertyTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200 bg-lightgray p-4 sm:p-6 rounded-lg"
                      >
                        <div className="grid grid-cols-12 gap-6">
                          {/* Guest Details */}
                          <div className="col-span-12 md:col-span-4">
                            <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">Guests</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span>Adults</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('adults', Math.max(1, values.adults - 1))}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center text-base font-medium">{values.adults}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('adults', Math.min(16, values.adults + 1))}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Children</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('children', Math.max(0, values.children - 1))}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center text-base font-medium">{values.children}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('children', Math.min(10, values.children + 1))}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Infants</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('infants', Math.max(0, values.infants - 1))}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center text-base font-medium">{values.infants}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('infants', Math.min(5, values.infants + 1))}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-basecolor transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price Range */}
                          <div className="col-span-12 md:col-span-4">
                            <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">Price range (KES per night)</h4>
                            <div className="space-y-3">
                              <Input
                                name="min_price"
                                type="number"
                                placeholder="Min price"
                                labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                                className="w-full !h-[50px] !text-base border-2 border-gray-300 focus:border-basecolor rounded-lg"
                              />
                              <Input
                                name="max_price"
                                type="number"
                                placeholder="Max price"
                                labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                                className="w-full !h-[50px] !text-base border-2 border-gray-300 focus:border-basecolor rounded-lg"
                              />
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="col-span-12 md:col-span-4">
                            <h4 className="heading-6 font-serif font-semibold text-darkgray mb-4">Amenities</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {amenities.map((amenity) => (
                                <label key={amenity.value} className="flex items-center space-x-3 text-base cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={values.amenities.includes(amenity.value)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFieldValue('amenities', [...values.amenities, amenity.value]);
                                      } else {
                                        setFieldValue('amenities', values.amenities.filter(a => a !== amenity.value));
                                      }
                                    }}
                                    className="w-4 h-4 rounded border-2 border-gray-300 text-basecolor focus:ring-basecolor focus:ring-2"
                                  />
                                  <span className="text-darkgray">{amenity.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </m.div>
                    )}
                  </Form>
                )}
              </Formik>
            </m.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default EnhancedBnbSearch;
