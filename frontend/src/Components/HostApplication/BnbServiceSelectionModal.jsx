import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Components
import CustomModal from '../CustomModal';
import Buttons from '../Button/Buttons';
import { fadeIn } from '../../Functions/GlobalAnimations';

// Auth hook
import useAuth from '../../api/useAuth';

const BnbServiceSelectionModal = ({ 
  triggerButton, 
  className = "",
  onServiceSelect 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // BnB service types
  const serviceTypes = [
    {
      id: 'entire_place',
      title: 'Entire Place',
      description: 'Guests have the whole place to themselves',
      icon: 'feather-home',
      examples: 'Apartment, house, villa, cottage'
    },
    {
      id: 'private_room',
      title: 'Private Room',
      description: 'Guests have a private room in a shared space',
      icon: 'feather-door-open',
      examples: 'Bedroom in shared apartment/house'
    },
    {
      id: 'shared_room',
      title: 'Shared Room',
      description: 'Guests share a room with others',
      icon: 'feather-users',
      examples: 'Dormitory, shared bedroom'
    },
    {
      id: 'unique_stays',
      title: 'Unique Stays',
      description: 'Special and unique accommodations',
      icon: 'feather-star',
      examples: 'Treehouse, castle, boat, tent'
    },
    {
      id: 'hotel_room',
      title: 'Hotel Room',
      description: 'Professional hospitality business',
      icon: 'feather-briefcase',
      examples: 'Hotel, B&B, boutique property'
    },
    {
      id: 'experience_host',
      title: 'Experience Host',
      description: 'Offer activities and experiences',
      icon: 'feather-activity',
      examples: 'Tours, workshops, activities'
    }
  ];

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedServices.length === 0) {
      return; // Require at least one service
    }

    setIsSubmitting(true);

    try {
      // Store selected services in localStorage for after auth
      localStorage.setItem('selectedBnbServices', JSON.stringify(selectedServices));

      if (isAuthenticated) {
        // User is already logged in, redirect to host application
        navigate('/become-host', { 
          state: { 
            selectedServices,
            step: 'application' 
          }
        });
      } else {
        // User needs to authenticate, redirect to BnB auth page
        navigate('/auth/bnb-signup', { 
          state: { 
            selectedServices,
            returnUrl: '/become-host'
          }
        });
      }

      // Call callback if provided
      if (onServiceSelect) {
        onServiceSelect(selectedServices);
      }

    } catch (error) {
      console.error('Error processing service selection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal.Wrapper
      modalBtn={triggerButton}
      className={`service-selection-modal ${className}`}
      closeBtnOuter={false}
    >
      <div className="bg-white rounded-[6px] p-16 md:p-12 sm:p-8 max-w-[900px] sm:max-w-[500px] mx-auto relative mt-[80px] sm:mt-[60px]">
        <CustomModal.Close className="close-btn absolute top-[15px] right-[15px] text-[#333]">
          <button title="Close (Esc)" type="button" className="border-none text-[24px] font-light w-[40px] h-[40px]">×</button>
        </CustomModal.Close>
        
        <m.div {...fadeIn}>
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="heading-5 font-serif font-semibold mb-4 text-darkgray">
              Start Your Hosting Journey
            </h3>
            <p className="text-md text-spanishgray mb-2">
              What type of accommodation would you like to offer?
            </p>
            <p className="text-sm text-spanishgray">
              Select all that apply - you can always add more later
            </p>
          </div>

          {/* Service Types Grid */}
          <Row className="row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 mb-8">
            {serviceTypes.map((service) => (
              <Col key={service.id} className="mb-[20px]">
                <m.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    service-option cursor-pointer rounded-[4px] border-[1px] p-[15px] transition-all duration-300 h-100 text-center lg:text-left
                    ${selectedServices.includes(service.id)
                      ? 'border-[#232323] bg-[#f8f9fa] shadow-[0_0_10px_rgba(0,0,0,0.1)]'
                      : 'border-[#dfdfdf] hover:border-[#232323] hover:shadow-[0_0_10px_rgba(0,0,0,0.05)]'
                    }
                  `}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  {/* Desktop Layout (3 columns) */}
                  <div className="lg:block hidden">
                    <div className="text-center mb-[10px]">
                      <i className={`${service.icon} text-[32px] text-[#232323] block mb-[8px]`}></i>
                      <h4 className="text-sm font-serif font-semibold text-darkgray mb-0">
                        {service.title}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-spanishgray mb-[10px] text-center">
                      {service.description}
                    </p>
                    
                    {/* Checkbox - Desktop */}
                    <div className="flex justify-center">
                      <div className={`
                        w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all
                        ${selectedServices.includes(service.id)
                          ? 'border-[#232323] bg-[#232323]'
                          : 'border-[#dfdfdf]'
                        }
                      `}>
                        {selectedServices.includes(service.id) && (
                          <i className="feather-check text-white text-[8px]"></i>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Tablet Layout (1-2 columns) */}
                  <div className="lg:hidden block">
                    <div className="flex items-start">
                      {/* Icon */}
                      <div className="mr-[15px] flex-shrink-0">
                        <i className={`${service.icon} text-[28px] text-[#232323]`}></i>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-[10px]">
                          <h4 className="text-md font-serif font-semibold text-darkgray mb-0">
                            {service.title}
                          </h4>
                          
                          {/* Checkbox - Mobile */}
                          <div className={`
                            w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all
                            ${selectedServices.includes(service.id)
                              ? 'border-[#232323] bg-[#232323]'
                              : 'border-[#dfdfdf]'
                            }
                          `}>
                            {selectedServices.includes(service.id) && (
                              <i className="feather-check text-white text-[10px]"></i>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-spanishgray mb-[8px]">
                          {service.description}
                        </p>
                        
                        <p className="text-xs text-lightgray">
                          Examples: {service.examples}
                        </p>
                      </div>
                    </div>
                  </div>
                </m.div>
              </Col>
            ))}
          </Row>

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#f8f9fa] border border-[#dfdfdf] rounded-[4px] p-[15px] mb-[25px]"
            >
              <div className="text-sm font-serif font-semibold text-darkgray mb-[10px]">
                Selected Services ({selectedServices.length})
              </div>
              <div className="flex flex-wrap gap-[8px]">
                {selectedServices.map((serviceId) => {
                  const service = serviceTypes.find(s => s.id === serviceId);
                  return (
                    <span
                      key={serviceId}
                      className="inline-flex items-center px-[12px] py-[4px] rounded-[20px] text-xs bg-[#232323] text-white"
                    >
                      <i className={`${service.icon} mr-[6px] text-[12px]`}></i>
                      {service.title}
                    </span>
                  );
                })}
              </div>
            </m.div>
          )}

          {/* Status Text */}
          <div className="text-center mb-[25px]">
            <div className="text-sm text-spanishgray">
              {selectedServices.length === 0 
                ? 'Please select at least one service to continue'
                : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
              }
            </div>
          </div>

          {/* Action Buttons */}
          <Buttons 
            type="button"
            className="btn-fill btn-fancy w-full font-medium font-serif rounded-none uppercase mb-4" 
            themeColor="#232323" 
            color="#fff" 
            size="md" 
            title={
              isSubmitting 
                ? 'Processing...' 
                : isAuthenticated 
                  ? 'Continue to Application'
                  : 'Continue to Sign Up'
            }
            disabled={selectedServices.length === 0 || isSubmitting}
            onClick={handleContinue}
          />

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-spanishgray">
              {!isAuthenticated && (
                <>You'll need to create an account or sign in to continue. </>
              )}
              Don't worry - you can change your selections later.
            </p>
          </div>
        </m.div>
      </div>
    </CustomModal.Wrapper>
  );
};

export default BnbServiceSelectionModal;
