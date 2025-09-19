import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { m } from 'framer-motion';

// Components
import { 
  BecomeHostButton, 
  BecomeHostOutlineButton, 
  BecomeHostLink, 
  BecomeHostNavItem,
  BecomeHostHeroCTA,
  BecomeHostFooterCTA 
} from './BecomeHostTrigger';
import BnbAuthModal from '../Auth/BnbAuthModal';
import { fadeIn } from '../../Functions/GlobalAnimations';

const HostOnboardingExample = () => {
  return (
    <Container className="py-[80px]">
      <Row className="justify-center">
        <Col lg={10}>
          <m.div {...fadeIn}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-semibold mb-4">
                🎯 New 2-Step Host Onboarding Flow
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Simplified flow: Service Selection → Authentication → Continue
              </p>
            </div>

            {/* Flow Diagram */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-semibold mb-6 text-center">User Journey</h3>
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                
                {/* Step 1 */}
                <div className="flex-1 text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h4 className="font-semibold mb-2">1. Service Selection</h4>
                  <p className="text-sm text-gray-600">
                    Choose BnB services to offer (entire place, private room, experiences, etc.)
                  </p>
                </div>

                <div className="hidden md:block text-2xl text-gray-400">→</div>

                {/* Step 2 */}
                <div className="flex-1 text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h4 className="font-semibold mb-2">2. Authentication</h4>
                  <p className="text-sm text-gray-600">
                    Sign in with Google, Email, or Facebook (Airbnb-style)
                  </p>
                </div>

                <div className="hidden md:block text-2xl text-gray-400">→</div>

                {/* Step 3 */}
                <div className="flex-1 text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-semibold mb-2">3. Application</h4>
                  <p className="text-sm text-gray-600">
                    Complete detailed hosting application with selected services
                  </p>
                </div>
              </div>
            </div>

            {/* Button Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Primary CTA */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">Primary CTA Button</h4>
                <BecomeHostButton />
                <p className="text-sm text-gray-600 mt-2">
                  Main call-to-action with orange fill
                </p>
              </div>

              {/* Secondary Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">Secondary Button</h4>
                <BecomeHostOutlineButton />
                <p className="text-sm text-gray-600 mt-2">
                  Outline style for secondary placement
                </p>
              </div>

              {/* Link Style */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">Text Link Style</h4>
                <BecomeHostLink />
                <p className="text-sm text-gray-600 mt-2">
                  For navigation menus and inline text
                </p>
              </div>

              {/* Hero CTA */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">Hero Section CTA</h4>
                <BecomeHostHeroCTA />
                <p className="text-sm text-gray-600 mt-2">
                  Large button for hero sections
                </p>
              </div>

              {/* Nav Item */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4">Navigation Item</h4>
                <BecomeHostNavItem />
                <p className="text-sm text-gray-600 mt-2">
                  For header navigation menus
                </p>
              </div>

              {/* Footer CTA */}
              <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4 text-white">Footer CTA</h4>
                <BecomeHostFooterCTA />
                <p className="text-sm text-gray-300 mt-2">
                  White outline for dark backgrounds
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-semibold mb-6">✨ Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Service Selection Modal</h4>
                      <p className="text-sm text-gray-600">Choose from 6 BnB service types with visual icons and descriptions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Smart Authentication</h4>
                      <p className="text-sm text-gray-600">Detects if user is logged in and routes accordingly</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">State Preservation</h4>
                      <p className="text-sm text-gray-600">Selected services are preserved through authentication flow</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Multiple Auth Options</h4>
                      <p className="text-sm text-gray-600">Google, Facebook, Email, and Phone authentication</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Responsive Design</h4>
                      <p className="text-sm text-gray-600">Works seamlessly on mobile and desktop</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Flexible Integration</h4>
                      <p className="text-sm text-gray-600">Easy to integrate into any existing UI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Guide */}
            <div className="bg-gray-900 rounded-xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6">🛠️ Quick Implementation</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-400 mb-2">1. Replace existing "Become a Host" buttons:</h4>
                  <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <code className="text-green-300">
                      {`import { BecomeHostButton } from './Components/HostApplication/BecomeHostTrigger';

// Replace old button with:
<BecomeHostButton />
`}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-blue-400 mb-2">2. Add to navigation menu:</h4>
                  <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <code className="text-blue-300">
                      {`import { BecomeHostNavItem } from './Components/HostApplication/BecomeHostTrigger';

// In your navigation:
<BecomeHostNavItem className="nav-item" />
`}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-purple-400 mb-2">3. Add route for BnB authentication:</h4>
                  <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <code className="text-purple-300">
                      {`import BnbAuth from './Pages/BnbAuth';

// Add to your routes:
<Route path="/auth/bnb-signup" element={<BnbAuth />} />
`}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Authentication Modal */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Test the authentication modal directly:
              </p>
              <BnbAuthModal
                triggerButton={
                  <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                    Test Auth Modal
                  </button>
                }
                selectedServices={['entire_place', 'private_room']}
                onAuthSuccess={() => alert('Authentication successful!')}
              />
            </div>
          </m.div>
        </Col>
      </Row>
    </Container>
  );
};

export default HostOnboardingExample;
