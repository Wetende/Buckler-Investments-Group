import React from 'react';
import { m } from 'framer-motion';

const DesktopStepIndicator = ({ 
  currentStep, 
  totalSteps, 
  stepTitles = [], 
  stepDescriptions = [],
  className = "",
  onStepClick = null // Allow navigation to previous steps
}) => {
  
  return (
    <div className={`desktop-step-indicator ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-semibold">Become a Host</h2>
        <span className="text-lg text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      
      {/* Horizontal Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = onStepClick && (isCompleted || isActive);
          
          return (
            <React.Fragment key={stepNumber}>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex flex-col items-center text-center cursor-pointer transition-all duration-300
                  ${isClickable ? 'hover:scale-105' : ''}
                  ${isActive ? 'transform scale-105' : ''}
                `}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                {/* Step Circle */}
                <div className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg mb-2
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-neonorange text-white shadow-lg' 
                    : isCompleted 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                  
                  {/* Active Step Pulse */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-neonorange opacity-30 animate-ping" />
                  )}
                </div>
                
                {/* Step Title */}
                <div className={`
                  max-w-28 transition-colors duration-300
                  ${isActive 
                    ? 'text-neonorange font-semibold' 
                    : isCompleted 
                      ? 'text-green-700 font-medium' 
                      : 'text-gray-500'
                  }
                `}>
                  <div className="text-sm font-medium">{title}</div>
                  {stepDescriptions[index] && (
                    <div className="text-xs text-gray-400 mt-1">
                      {stepDescriptions[index]}
                    </div>
                  )}
                </div>
              </m.div>
              
              {/* Connector Line */}
              {index < stepTitles.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4 transition-colors duration-300
                  ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <m.div 
          className="bg-neonorange h-2 rounded-full transition-all duration-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        <span>{totalSteps - currentStep} steps remaining</span>
      </div>
    </div>
  );
};

export default DesktopStepIndicator;
