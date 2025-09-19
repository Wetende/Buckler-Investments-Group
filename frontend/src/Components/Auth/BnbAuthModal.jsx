import React, { useState } from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Components
import CustomModal from '../CustomModal';
import Buttons from '../Button/Buttons';
import { Input } from '../Form/Form';
import MessageBox from '../MessageBox/MessageBox';

// Auth
import useAuth from '../../api/useAuth';

const BnbAuthModal = ({ 
  triggerButton, 
  className = "",
  selectedServices = [],
  returnUrl = '/become-host',
  onAuthSuccess 
}) => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  
  const [authMode, setAuthMode] = useState('phone'); // 'phone', 'email'
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
      // Handle OTP verification
      try {
        await login({ phone: formData.countryCode + formData.phone });
        
        if (onAuthSuccess) {
          onAuthSuccess();
        } else {
          navigate(returnUrl, { state: { selectedServices } });
        }
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
      
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        navigate(returnUrl, { state: { selectedServices } });
      }
    } catch (error) {
      setErrors({ general: 'Authentication failed' });
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      // Implement social auth
      console.log(`Authenticating with ${provider}`);
      
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        navigate(returnUrl, { state: { selectedServices } });
      }
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
    <CustomModal.Wrapper
      modalBtn={triggerButton}
      className={`bnb-auth-modal ${className}`}
    >
      <div className="w-full max-w-md mx-auto">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <img 
                src="/assets/img/logo.png" 
                alt="Buckler BnBs" 
                className="h-10 mx-auto"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {step === 2 ? 'Confirm your number' : 'Log in or sign up'}
            </h2>
            <p className="text-gray-600 text-sm">
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
              className="mb-4"
            />
          )}

          {/* Phone Authentication */}
          {authMode === 'phone' && step === 1 && (
            <div className="space-y-4">
              {/* Country Code Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country code
                </label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neonorange focus:border-transparent"
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
                  className={`w-full px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <p className="text-xs text-gray-500">
                We'll call or text you to confirm your number. Standard message and data rates apply.
              </p>

              <Buttons
                onClick={handlePhoneAuth}
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200"
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
                className="w-full px-3 py-2 text-center tracking-widest"
                maxLength="6"
              />
              
              <Buttons
                onClick={handlePhoneAuth}
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg"
                title={isLoading ? "Verifying..." : "Verify"}
              />

              <div className="text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-600 hover:text-gray-800 underline"
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
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-3 py-2"
                  />
                  <Input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-3 py-2"
                  />
                </div>
              )}
              
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2"
              />
              
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2"
              />

              <Buttons
                onClick={handleEmailAuth}
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg"
                title={isLoading ? "Processing..." : (isSignUp ? "Sign up" : "Log in")}
              />

              <div className="text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-neonorange hover:underline"
                >
                  {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          )}

          {/* Social Authentication Options */}
          {authMode === 'phone' && step === 1 && (
            <div className="space-y-3 mt-4">
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
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => setAuthMode('email')}
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Continue with email
              </button>

              <button
                onClick={() => handleSocialAuth('facebook')}
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>
          )}

          {/* Back to Phone */}
          {authMode === 'email' && (
            <div className="text-center mt-3">
              <button
                onClick={() => setAuthMode('phone')}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                ← Back to phone signup
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-neonorange underline">Terms</a>
              {' '}and{' '}
              <a href="/privacy" className="text-neonorange underline">Privacy Policy</a>
            </p>
          </div>
        </m.div>
      </div>
    </CustomModal.Wrapper>
  );
};

export default BnbAuthModal;
