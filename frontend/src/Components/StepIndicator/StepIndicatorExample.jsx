import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { m } from 'framer-motion';
import Buttons from '../Button/Buttons';
import MobileStepIndicator from './MobileStepIndicator';
import DesktopStepIndicator from './DesktopStepIndicator';
import ResponsiveStepIndicator from './ResponsiveStepIndicator';

const StepIndicatorExample = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const stepTitles = [
    "Personal Info",
    "Property Details", 
    "Pricing & Availability",
    "Hosting Experience",
    "Documents",
    "Review & Submit"
  ];
  
  const stepDescriptions = [
    "Basic information",
    "About your space",
    "Set your rates", 
    "Your background",
    "Required uploads",
    "Final confirmation"
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <Container className="py-[80px]">
      <Row className="justify-center">
        <Col lg={12}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-semibold mb-4">
              Multi-Step Form Indicators
            </h2>
            <p className="text-gray-600 mb-6">
              Examples of responsive step indicators for mobile and desktop
            </p>
          </div>

          {/* Mobile Examples */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-semibold mb-6">Mobile Variants</h3>
            
            {/* Minimal Variant */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Minimal (Best for small screens)</h4>
              <div className="max-w-sm mx-auto">
                <MobileStepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  stepTitles={stepTitles}
                  variant="minimal"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Shows only current step title with progress bar
              </p>
            </div>

            {/* Compact Variant */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Compact (Current + Next step)</h4>
              <div className="max-w-md mx-auto">
                <MobileStepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  stepTitles={stepTitles}
                  variant="compact"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Shows current and next step for context
              </p>
            </div>

            {/* Detailed Variant */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Detailed (Grid layout)</h4>
              <div className="max-w-lg mx-auto">
                <MobileStepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  stepTitles={stepTitles}
                  variant="detailed"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Shows all steps in responsive grid (2-3 columns)
              </p>
            </div>
          </div>

          {/* Desktop Example */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-semibold mb-6">Desktop Version</h3>
            <div className="bg-white rounded-lg shadow-md p-6">
              <DesktopStepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepTitles={stepTitles}
                stepDescriptions={stepDescriptions}
                onStepClick={goToStep}
              />
              <p className="text-sm text-gray-600 mt-4 text-center">
                Full horizontal stepper with clickable navigation
              </p>
            </div>
          </div>

          {/* Responsive Auto-Select */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-semibold mb-6">Responsive Auto-Select</h3>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ResponsiveStepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepTitles={stepTitles}
                stepDescriptions={stepDescriptions}
                onStepClick={goToStep}
                mobileVariant="auto"
              />
              <p className="text-sm text-gray-600 mt-4 text-center">
                Automatically selects best mobile variant based on screen size
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Test Controls</h4>
            <div className="flex justify-center space-x-4 mb-6">
              <Buttons
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-fancy btn-outline"
                title="Previous Step"
              />
              <Buttons
                onClick={nextStep}
                disabled={currentStep === totalSteps}
                className="btn-fancy btn-fill"
                themeColor="#f59e0b"
                color="#fff"
                title="Next Step"
              />
            </div>
            
            {/* Direct step navigation */}
            <div className="flex justify-center flex-wrap gap-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <Buttons
                  key={index + 1}
                  onClick={() => goToStep(index + 1)}
                  className={`btn-fancy ${currentStep === index + 1 ? 'btn-fill' : 'btn-outline'}`}
                  themeColor={currentStep === index + 1 ? "#f59e0b" : "#6b7280"}
                  color={currentStep === index + 1 ? "#fff" : "#6b7280"}
                  title={`${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Usage Guide */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Usage Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-green-700 mb-2">📱 Small Phones (< 375px)</h5>
                <p>Use <code>minimal</code> variant to save space and reduce cognitive load</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-700 mb-2">📱 Medium Phones (375-480px)</h5>
                <p>Use <code>compact</code> for context or <code>detailed</code> for ≤ 4 steps</p>
              </div>
              <div>
                <h5 className="font-medium text-purple-700 mb-2">💻 Large Screens (> 768px)</h5>
                <p>Use full <code>desktop</code> stepper with clickable navigation</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2">🎯 Best Practices</h5>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Keep step titles short and descriptive (max 2-3 words)</li>
                <li>• Use <code>mobileVariant="auto"</code> for automatic selection</li>
                <li>• Consider step count when choosing variants (6+ steps → minimal/compact)</li>
                <li>• Always show progress percentage for long forms</li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StepIndicatorExample;
