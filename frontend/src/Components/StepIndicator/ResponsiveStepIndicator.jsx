import React, { useState, useEffect } from 'react';
import MobileStepIndicator from './MobileStepIndicator';
import DesktopStepIndicator from './DesktopStepIndicator';

const ResponsiveStepIndicator = ({ 
  currentStep, 
  totalSteps, 
  stepTitles = [], 
  stepDescriptions = [],
  className = "",
  onStepClick = null,
  mobileVariant = "minimal", // "minimal", "compact", "detailed"
  breakpoint = 768 // px
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkIsMobile();

    // Listen for resize
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  // Auto-select mobile variant based on screen size and step count
  const getOptimalMobileVariant = () => {
    if (window.innerWidth < 375) { // Small phones
      return "minimal";
    } else if (window.innerWidth < 480) { // Medium phones
      return totalSteps > 4 ? "compact" : "detailed";
    } else { // Large phones/small tablets
      return "detailed";
    }
  };

  const effectiveMobileVariant = mobileVariant === "auto" 
    ? getOptimalMobileVariant() 
    : mobileVariant;

  if (isMobile) {
    return (
      <MobileStepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitles={stepTitles}
        className={className}
        variant={effectiveMobileVariant}
      />
    );
  }

  return (
    <DesktopStepIndicator
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepTitles={stepTitles}
      stepDescriptions={stepDescriptions}
      className={className}
      onStepClick={onStepClick}
    />
  );
};

export default ResponsiveStepIndicator;
