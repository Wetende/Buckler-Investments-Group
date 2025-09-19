import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { m } from 'framer-motion';

// Components
import { fadeIn } from '../Functions/GlobalAnimations';
import Buttons from '../Components/Button/Buttons';
import { Input } from '../Components/Form/Form';
import MessageBox from '../Components/MessageBox/MessageBox';

// Auth
import { useAuth } from '../api/useAuth';

const BnbAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, isAuthenticated } = useAuth();
  
  const [authMode, setAuthMode] = useState('phone'); // 'phone', 'email', 'social'
  const [formData, setFormData] = useState({
    countryCode: '+254',
    phone: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // For multi-step phone auth

  // Get state data from navigation
  const selectedServices = location.state?.selectedServices || [];
  const returnUrl = location.state?.returnUrl || '/become-host';

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (isAuthenticated) {
      navigate(returnUrl, { 
        state: { selectedServices }
      });
    }
  }, [isAuthenticated, navigate, returnUrl, selectedServices]);

  const handlePhoneAuth = async () => {
    if (step === 1) {
      // Validate phone number
      const phoneNumber = formData.countryCode + formData.phone;
      if (!formData.phone || formData.phone.length < 9) {
        setErrors({ phone: 'Please enter a valid phone number' });
        return;
      }
      
      // Move to verification step
      setStep(2);
    } else {
      // Handle OTP verification (mock for now)
      try {
        await login({ phone: formData.countryCode + formData.phone });
        navigate(returnUrl, { state: { selectedServices } });
      } catch (error) {
        setErrors({ general: 'Authentication failed' });
      }
    }
  };

  const handleEmailAuth = async () => {
    try {
      if (isSignUp) {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password
        });
      }
      navigate(returnUrl, { state: { selectedServices } });
    } catch (error) {
      setErrors({ general: 'Authentication failed' });
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      // Implement social auth
      console.log(`Authenticating with ${provider}`);
      // Mock success for now
      navigate(returnUrl, { state: { selectedServices } });
    } catch (error) {
      setErrors({ general: `${provider} authentication failed` });
    }
  };

  const countryCodes = [
    { value: '+254', label: 'Kenya (+254)', flag: '🇰🇪' },
    { value: '+1', label: 'USA (+1)', flag: '🇺🇸' },
    { value: '+44', label: 'UK (+44)', flag: '🇬🇧' },
    { value: '+27', label: 'South Africa (+27)', flag: '🇿🇦' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <Row className="justify-center">
          <Col lg={5} md={7} sm={9}>
            <m.div {...fadeIn} className="bg-white rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <img 
                    src="/assets/img/logo.png" 
                    alt="Buckler BnBs" 
                    className="h-12 mx-auto"
                  />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {step === 2 ? 'Confirm your number' : 'Log in or sign up'}
                </h1>
                <p className="text-gray-600">
                  {step === 2 
                    ? `Enter the code we sent to ${formData.countryCode} ${formData.phone}`
                    : 'Welcome to Buckler BnBs'
                  }
                </p>
              </div>

              {/* Error Message */}
              {errors.general && (
                <MessageBox
                  theme="message-box01"
                  variant="error"
                  message={errors.general}
                  className="mb-6"
                />
              )}

              {/* Selected Services Reminder */}
              {selectedServices.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Ready to host: {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-blue-600">
                    Sign in to continue your hosting application
                  </p>
                </div>
              )}

              {/* Phone Authentication */}
              {authMode === 'phone' && step === 1 && (
                <div className="space-y-4">
                  {/* Country Code Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country code
                    </label>
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neonorange focus:border-transparent"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.flag} {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 text-lg ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    We'll call or text you to confirm your number. Standard message and data rates apply.{' '}
                    <a href="/privacy" className="text-neonorange underline">Privacy Policy</a>
                  </p>

                  <Buttons
                    onClick={handlePhoneAuth}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200"
                    title={isLoading ? "Sending..." : "Continue"}
                  />
                </div>
              )}

              {/* OTP Verification */}
              {authMode === 'phone' && step === 2 && (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    className="w-full px-4 py-3 text-lg text-center tracking-widest"
                    maxLength="6"
                  />
                  
                  <Buttons
                    onClick={handlePhoneAuth}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg"
                    title={isLoading ? "Verifying..." : "Verify"}
                  />

                  <div className="text-center">
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Change phone number
                    </button>
                  </div>
                </div>
              )}

              {/* Email Authentication */}
              {authMode === 'email' && (
                <div className="space-y-4">
                  {isSignUp && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <Input
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />

                  <Buttons
                    onClick={handleEmailAuth}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg"
                    title={isLoading ? "Processing..." : (isSignUp ? "Sign up" : "Log in")}
                  />

                  <div className="text-center">
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-neonorange hover:underline"
                    >
                      {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                    </button>
                  </div>
                </div>
              )}

              {/* Social Authentication Options */}
              {authMode !== 'email' && step === 1 && (
                <div className="space-y-3 mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSocialAuth('google')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    onClick={() => handleSocialAuth('apple')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                  </button>

                  <button
                    onClick={() => setAuthMode('email')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Continue with email
                  </button>

                  <button
                    onClick={() => handleSocialAuth('facebook')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </button>
                </div>
              )}

              {/* Back to Phone */}
              {authMode === 'email' && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setAuthMode('phone')}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    ← Back to phone signup
                  </button>
                </div>
              )}

              {/* Footer Links */}
              <div className="mt-8 text-center text-xs text-gray-500">
                <p>
                  By continuing, you agree to our{' '}
                  <a href="/terms" className="text-neonorange underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-neonorange underline">Privacy Policy</a>
                </p>
              </div>
            </m.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BnbAuth;
