import React from 'react';
import Buttons from '../Button/Buttons';
import BnbServiceSelectionModal from './BnbServiceSelectionModal';

// Example component showing how to use the new 2-step host onboarding flow
const BecomeHostTrigger = ({ 
  className = "",
  buttonText = "Become a Host",
  buttonStyle = "btn-fancy btn-fill",
  themeColor = "#f59e0b",
  color = "#fff",
  variant = "button" // "button" or "link"
}) => {

  const handleServiceSelection = (selectedServices) => {
    console.log('User selected services:', selectedServices);
    // You can add analytics tracking here
    // analytics.track('host_services_selected', { services: selectedServices });
  };

  // Create the trigger button
  const triggerButton = variant === "link" ? (
    <a 
      href="#" 
      className={`become-host-link ${className}`}
      onClick={(e) => e.preventDefault()}
    >
      {buttonText}
    </a>
  ) : (
    <Buttons
      className={`${buttonStyle} ${className}`}
      themeColor={themeColor}
      color={color}
      title={buttonText}
    />
  );

  return (
    <BnbServiceSelectionModal
      triggerButton={triggerButton}
      onServiceSelect={handleServiceSelection}
      className="become-host-modal"
    />
  );
};

// Pre-configured variants for different use cases
export const BecomeHostButton = (props) => (
  <BecomeHostTrigger
    buttonStyle="btn-fancy btn-fill"
    themeColor="#f59e0b"
    color="#fff"
    {...props}
  />
);

export const BecomeHostOutlineButton = (props) => (
  <BecomeHostTrigger
    buttonStyle="btn-fancy btn-outline"
    themeColor="#f59e0b"
    color="#f59e0b"
    {...props}
  />
);

export const BecomeHostLink = (props) => (
  <BecomeHostTrigger
    variant="link"
    {...props}
  />
);

// Navigation menu version
export const BecomeHostNavItem = ({ className = "" }) => (
  <BecomeHostTrigger
    variant="link"
    buttonText="Host your home"
    className={`nav-link ${className}`}
  />
);

// Hero section CTA
export const BecomeHostHeroCTA = ({ className = "" }) => (
  <BecomeHostTrigger
    buttonText="Start hosting today"
    buttonStyle="btn-fancy btn-fill btn-lg"
    themeColor="#f59e0b"
    color="#fff"
    className={className}
  />
);

// Footer CTA
export const BecomeHostFooterCTA = ({ className = "" }) => (
  <BecomeHostTrigger
    buttonText="Become a Host"
    buttonStyle="btn-fancy btn-outline btn-sm"
    themeColor="#fff"
    color="#fff"
    className={className}
  />
);

export default BecomeHostTrigger;
