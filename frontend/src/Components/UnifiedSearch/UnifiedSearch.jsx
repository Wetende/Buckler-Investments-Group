import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Input } from '../Form/Form';
import Buttons from '../Button/Buttons';
import { m } from 'framer-motion';
import { fadeIn } from '../../Functions/GlobalAnimations';

const UnifiedSearch = ({ className = "" }) => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('tours');

  const placeholderByType = {
    tours: 'tours',
    bnb: 'accommodations',
    properties: 'properties',
    cars: 'cars',
    invest: 'investments',
  };

  const searchSchema = Yup.object().shape({
    query: Yup.string().min(2, 'Enter at least 2 characters'),
    location: Yup.string(),
    date: Yup.string(),
  });

  const handleSearch = (values) => {
    const params = new URLSearchParams();
    if (values.query) params.append('q', values.query);
    if (values.location) params.append('location', values.location);
    if (values.date) params.append('date', values.date);
    
    const searchPath = `/${searchType}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(searchPath);
  };

  return (
    <m.section 
      className={`py-[80px] bg-white border-b border-mediumgray ${className}`}
      {...fadeIn}
    >
      <Container>
        <Row className="justify-center">
          <Col lg={10}>
            <div className="text-center mb-12">
              <h2 className="heading-5 font-serif font-semibold text-darkgray mb-4">
                Find Your Perfect Experience
              </h2>
              <p className="text-lg text-gray-600">
                Search across tours, accommodations, properties, vehicles, and investments
              </p>
            </div>
            
            {/* Search Type Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap justify-center bg-lightgray rounded-lg p-1 gap-1 sm:gap-0">
                {[
                  { key: 'tours', label: 'Tours', icon: 'fas fa-map-marked-alt' },
                  { key: 'bnb', label: 'BnB', icon: 'fas fa-home' },
                  { key: 'properties', label: 'Properties', icon: 'fas fa-building' },
                  { key: 'cars', label: 'Cars', icon: 'fas fa-car' },
                  { key: 'invest', label: 'Invest', icon: 'fas fa-chart-line' },
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setSearchType(type.key)}
                    className={`px-3 sm:px-6 py-3 rounded-md font-medium transition-all duration-300 text-sm sm:text-base ${
                      searchType === type.key
                        ? 'bg-white text-darkgray shadow-sm'
                        : 'text-gray-600 hover:text-darkgray'
                    }`}
                  >
                    <i className={`${type.icon} mr-1 sm:mr-2`}></i>
                    <span className="hidden xs:inline sm:inline">{type.label}</span>
                    <span className="xs:hidden sm:hidden">{type.label.slice(0, 4)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Form */}
            <Formik
              initialValues={{ query: '', location: '', date: '' }}
              validationSchema={searchSchema}
              onSubmit={handleSearch}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200">
                    {/* Mobile-first: stack vertically (xs=12). Desktop (md>=768px): 4 columns */}
                    <Row className="g-3 g-md-2 align-items-end">
                      <Col xs={12} md={3}>
                        <Input
                          name="query"
                          type="text"
                          label="What are you looking for?"
                          placeholder={`Search ${placeholderByType[searchType] || searchType}...`}
                          labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                          className="w-full w-100 !h-[50px] !text-base text-center border-2 border-gray-300 focus:border-red-600"
                        />
                      </Col>
                      <Col xs={12} md={3}>
                        <Input
                          name="location"
                          type="text"
                          label="Location"
                          placeholder="e.g., Nairobi, Mombasa"
                          labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                          className="w-full w-100 !h-[50px] !text-base text-center border-2 border-gray-300 focus:border-red-600"
                        />
                      </Col>
                      <Col xs={12} md={3}>
                        <Input
                          name="date"
                          type="date"
                          label="Date"
                          labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                          className="w-full w-100 !h-[50px] !text-base text-center border-2 border-gray-300 focus:border-red-600"
                        />
                      </Col>
                      <Col xs={12} md={3}>
                        <Buttons
                          type="submit"
                          className="btn-fancy btn-fill font-medium font-serif rounded-lg uppercase h-[50px] w-full w-100 px-8"
                          themeColor="#232323"
                          color="#fff"
                          title={isSubmitting ? 'Searching...' : 'Search'}
                          disabled={isSubmitting}
                        />
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </m.section>
  );
};

export default UnifiedSearch;

