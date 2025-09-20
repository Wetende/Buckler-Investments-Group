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
  // ALL HOOKS MUST BE CALLED AT TOP LEVEL - NO EXCEPTIONS
  const navigate = useNavigate();
  const location = useLocation();

  // HOOK CALLED AT TOP LEVEL (BEFORE ANY CONDITIONAL LOGIC)
  const { login, register, isLoading, isAuthenticated } = useAuth();

  const [authMode, setAuthMode] = useState('phone');
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
  const [step, setStep] = useState(1);

  // Get state data from navigation (memoized for performance)
  const selectedServices = React.useMemo(() =>
    location.state?.selectedServices || [],
    [location.state?.selectedServices]
  );
  const returnUrl = React.useMemo(() =>
    location.state?.returnUrl || '/become-host',
    [location.state?.returnUrl]
  );

  // EFFECT HOOK - ONLY USES TOP-LEVEL VALUES
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl, {
        state: { selectedServices }
      });
    }
  }, [isAuthenticated, navigate, returnUrl, selectedServices]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePhoneAuth = async () => {
    if (step === 1) {
      // Validate phone number
      if (!formData.phone || formData.phone.length < 9) {
        setErrors({ phone: 'Please enter a valid phone number' });
        return;
      }

      // Send OTP
      try {
        // This would call your auth service
        console.log('Sending OTP to:', formData.countryCode + formData.phone);
        setStep(2);
        setErrors({});
      } catch (error) {
        setErrors({ general: 'Failed to send OTP. Please try again.' });
      }
    } else if (step === 2) {
      // Verify OTP and login/signup
      try {
        if (isSignUp) {
          await register({
            phone: formData.countryCode + formData.phone,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
          });
        } else {
          await login({
            phone: formData.countryCode + formData.phone,
            password: formData.password
          });
        }
      } catch (error) {
        setErrors({ general: error.message || 'Authentication failed' });
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
    } catch (error) {
      setErrors({ general: error.message || 'Authentication failed' });
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'phone' ? 'email' : 'phone');
    setStep(1);
    setErrors({});
  };

  const toggleSignUp = () => {
    setIsSignUp(prev => !prev);
    setStep(1);
    setErrors({});
  };

  return (
    <m.div {...fadeIn}>
      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="justify-center">
            <Col lg={6} md={8} sm={10} className="text-center mb-16">
              <h2 className="heading-4 font-serif font-semibold text-darkgray mb-6">
                {isSignUp ? 'Create Your Host Account' : 'Welcome Back'}
              </h2>
              <p className="text-lg leading-[32px] mb-0">
                {isSignUp
                  ? 'Join our platform to start hosting amazing properties'
                  : 'Sign in to manage your listings and bookings'
                }
              </p>
            </Col>
          </Row>

          <Row className="justify-center">
            <Col lg={5} md={7} sm={10}>
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Auth Mode Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 rounded-full p-1 flex">
                    <button
                      onClick={() => setAuthMode('phone')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        authMode === 'phone'
                          ? 'bg-white shadow-sm text-darkgray'
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      Phone
                    </button>
                    <button
                      onClick={() => setAuthMode('email')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        authMode === 'email'
                          ? 'bg-white shadow-sm text-darkgray'
                          : 'text-gray-600 hover:text-darkgray'
                      }`}
                    >
                      Email
                    </button>
                  </div>
                </div>

                {/* Error Messages */}
                {errors.general && (
                  <MessageBox
                    theme="message-box01"
                    variant="error"
                    message={errors.general}
                    className="mb-6"
                  />
                )}

                {/* Phone Authentication */}
                {authMode === 'phone' && (
                  <div className="space-y-4">
                    {step === 1 && (
                      <>
                        <div className="flex space-x-2">
                          <div className="w-24">
                            <select
                              value={formData.countryCode}
                              onChange={(e) => handleInputChange('countryCode', e.target.value)}
                              className="form-select h-full"
                            >
                              <option value="+254">+254</option>
                              <option value="+255">+255</option>
                              <option value="+256">+256</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <Input
                              type="tel"
                              placeholder="Enter phone number"
                              value={formData.phone}
                              onChange={(value) => handleInputChange('phone', value)}
                              error={errors.phone}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {isSignUp && (
                          <>
                            <Input
                              type="email"
                              placeholder="Email address"
                              value={formData.email}
                              onChange={(value) => handleInputChange('email', value)}
                              error={errors.email}
                            />
                            <Input
                              type="password"
                              placeholder="Create password"
                              value={formData.password}
                              onChange={(value) => handleInputChange('password', value)}
                              error={errors.password}
                            />
                            <div className="flex space-x-2">
                              <Input
                                type="text"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={(value) => handleInputChange('firstName', value)}
                                error={errors.firstName}
                                className="flex-1"
                              />
                              <Input
                                type="text"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={(value) => handleInputChange('lastName', value)}
                                error={errors.lastName}
                                className="flex-1"
                              />
                            </div>
                          </>
                        )}

                        {!isSignUp && (
                          <Input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(value) => handleInputChange('password', value)}
                            error={errors.password}
                          />
                        )}
                      </>
                    )}

                    {step === 2 && (
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-2">
                          Enter Verification Code
                        </h4>
                        <p className="text-gray-600 mb-4">
                          We sent a code to {formData.countryCode} {formData.phone}
                        </p>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          maxLength="6"
                          className="text-center text-2xl tracking-widest"
                          onChange={(value) => {
                            if (value.length === 6) {
                              handlePhoneAuth();
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Email Authentication */}
                {authMode === 'email' && (
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      error={errors.email}
                    />

                    {isSignUp && (
                      <>
                        <Input
                          type="password"
                          placeholder="Create password"
                          value={formData.password}
                          onChange={(value) => handleInputChange('password', value)}
                          error={errors.password}
                        />
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={(value) => handleInputChange('firstName', value)}
                            error={errors.firstName}
                            className="flex-1"
                          />
                          <Input
                            type="text"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(value) => handleInputChange('lastName', value)}
                            error={errors.lastName}
                            className="flex-1"
                          />
                        </div>
                      </>
                    )}

                    {!isSignUp && (
                      <Input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(value) => handleInputChange('password', value)}
                        error={errors.password}
                      />
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6">
                  <Buttons
                    type="button"
                    className="btn-fancy btn-fill w-full"
                    themeColor="#232323"
                    color="#fff"
                    title={
                      isLoading
                        ? 'Please wait...'
                        : authMode === 'phone' && step === 1
                        ? 'Send Verification Code'
                        : authMode === 'phone' && step === 2
                        ? (isSignUp ? 'Create Account' : 'Sign In')
                        : (isSignUp ? 'Create Account' : 'Sign In')
                    }
                    onClick={authMode === 'phone' ? handlePhoneAuth : handleEmailAuth}
                    disabled={isLoading}
                  />
                </div>

                {/* Toggle Sign Up/Sign In */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={toggleSignUp}
                    className="text-sm text-gray-600 hover:text-darkgray transition-colors"
                  >
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>

                {/* Switch Auth Mode */}
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-sm text-gray-600 hover:text-darkgray transition-colors"
                  >
                    {authMode === 'phone'
                      ? 'Use email instead'
                      : 'Use phone number instead'
                    }
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </m.div>
  );
};

export default BnbAuth;