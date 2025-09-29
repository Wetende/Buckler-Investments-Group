import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { m } from 'framer-motion';

// Components
import { fadeIn } from '../Functions/GlobalAnimations';
import Buttons from '../Components/Button/Buttons';
import MessageBox from '../Components/MessageBox/MessageBox';
import Header, { HeaderNav, Menu } from '../Components/Header/Header';
import { BnbMenuData } from '../Components/Header/BnbMenuData';

// Auth
import { useAuth } from '../api/useAuth';

const BnbAuth = () => {
  // ALL HOOKS MUST BE CALLED AT TOP LEVEL - NO EXCEPTIONS
  const navigate = useNavigate();
  const location = useLocation();

  // HOOK CALLED AT TOP LEVEL (BEFORE ANY CONDITIONAL LOGIC)
  const { login, register, isAuthenticated } = useAuth();

  const [currentForm, setCurrentForm] = useState('welcome'); // 'welcome', 'email', 'finish'
  const [authProvider, setAuthProvider] = useState(null); // 'google', 'facebook', 'apple', 'email'
  const [formData, setFormData] = useState({
    countryCode: '+254',
    phone: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleContinueWithPhone = async () => {
    if (!formData.phone || formData.phone.length < 9) {
      setErrors({ phone: 'Please enter a valid phone number' });
      return;
    }

    setIsLoading(true);
    try {
      // Send OTP and proceed with phone auth
      console.log('Sending OTP to:', formData.countryCode + formData.phone);
      // Mock success - in real app, this would call your auth service
      setAuthProvider('phone');
      setCurrentForm('finish');
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithEmail = () => {
    setAuthProvider('email');
    setCurrentForm('email');
  };

  const handleSocialAuth = (provider) => {
    setIsLoading(true);
    // Mock social auth - in real app, this would trigger OAuth flow
    setTimeout(() => {
      setAuthProvider(provider);
      setCurrentForm('finish');
      // Pre-fill some data from social provider
      if (provider === 'google') {
        setFormData(prev => ({
          ...prev,
          firstName: 'Cyprian',
          lastName: 'Wetende',
          email: 'cyprianwetende@gmail.com'
        }));
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleEmailSignup = async () => {
    // Validate email form
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate
      });
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishSignup = async () => {
    // Validate finish form
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Complete registration with social provider data
      await register({
        provider: authProvider,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        email: formData.email
      });
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header Start */}
      <Header topSpace={{ md: true }} type="header-always-fixed">
        <HeaderNav
          theme="dark"
          fluid="fluid"
          bg="dark"
          expand="lg"
          containerClass="sm:!px-0"
          className="py-[0px] border-b border-[#ffffff1a] px-[35px] md:pr-[15px] md:pl-0 md:py-[20px] bg-[#23262d]"
        >
          <Col xs="auto" lg={2} sm={6} className="me-auto ps-lg-0">
            <Link aria-label="header logo link" className="flex items-center" to="/">
              <Navbar.Brand className="inline-block p-0 m-0">
                <span className="default-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                <span className="alt-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
                <span className="mobile-logo font-serif font-semibold text-[18px] tracking-[-.2px] text-white whitespace-nowrap">Buckler Investment Group</span>
              </Navbar.Brand>
            </Link>
          </Col>
          <Navbar.Toggle className="order-last md:ml-[25px] sm:ml-[17px]">
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
          </Navbar.Toggle>
          <Navbar.Collapse className="col-auto justify-center">
            <Menu data={BnbMenuData} className="text-white auth-menu" />
          </Navbar.Collapse>
          <style>{`
            .auth-menu .nav-link,
            .auth-menu .nav-link a,
            .auth-menu .navbar-nav .nav-item .nav-link {
              color: #fff !important;
            }
            @media (max-width: 991.98px) {
              .navbar-collapse .auth-menu .nav-link,
              .navbar-collapse .auth-menu .nav-link a {
                color: #000 !important;
              }
            }
          `}</style>
          <Col xs="auto" lg={2} className="nav-bar-contact text-end xs:hidden pe-0">
            <span className="text-md text-[#fff] font-serif font-medium">
              {currentForm === 'welcome' ? 'Log in or sign up' : 
               currentForm === 'email' ? 'Finish signing up' : 
               'Finish signing up'}
            </span>
          </Col>
        </HeaderNav>
      </Header>
      {/* Header End */}

      <m.div {...fadeIn}>
        <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
          <Container>
            <Row className="justify-center">
              <Col lg={5} md={7} sm={10}>
                {/* Error Messages */}
                {errors.general && (
                  <MessageBox
                    theme="message-box01"
                    variant="error"
                    message={errors.general}
                    className="mb-6"
                  />
                )}

                {/* FORM 1: Welcome Screen (like first image) */}
                {currentForm === 'welcome' && (
                  <div className="bg-white rounded-lg shadow-lg border p-8">
                    <div className="text-center mb-6">
                      <h3 className="heading-5 font-serif font-semibold text-darkgray mb-2">
                        Welcome to Buckler
                      </h3>
                    </div>

                    {/* Country Code + Phone Number */}
                    <div className="mb-4">
                      <label className="form-label text-sm font-medium mb-2 block">Country code</label>
                      <div className="flex space-x-2 mb-4">
                        <div className="w-32">
                          <select
                            value={formData.countryCode}
                            onChange={(e) => handleInputChange('countryCode', e.target.value)}
                            className="form-select w-full"
                          >
                            <option value="+254">Kenya (+254)</option>
                            <option value="+255">Tanzania (+255)</option>
                            <option value="+256">Uganda (+256)</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`form-control w-full ${errors.phone ? 'border-red-500' : ''}`}
                          />
                        </div>
                      </div>
                      {errors.phone && (
                        <span className="text-sm text-red-500 block mt-1">{errors.phone}</span>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        We'll call or text you to confirm your number. Standard message and data rates apply.{' '}
                        <Link to="/privacy" className="underline">Privacy Policy</Link>
                      </p>
                    </div>

                    {/* Continue Button */}
                    <div className="mb-4">
                      <Buttons
                        type="button"
                        className="btn-fancy btn-fill w-full font-medium"
                        themeColor="#e91e63"
                        color="#fff"
                        title={isLoading ? 'Processing...' : 'Continue'}
                        onClick={handleContinueWithPhone}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    {/* Social Auth Buttons */}
                    <div className="space-y-3">
                      <Buttons
                        type="button"
                        className="btn-outline w-full font-medium flex items-center justify-center"
                        themeColor="#000"
                        color="#000"
                        title={
                          <div className="flex items-center justify-center space-x-3">
                            <i className="fab fa-google text-lg"></i>
                            <span>Continue with Google</span>
                          </div>
                        }
                        onClick={() => handleSocialAuth('google')}
                        disabled={isLoading}
                      />

                      <Buttons
                        type="button"
                        className="btn-outline w-full font-medium flex items-center justify-center"
                        themeColor="#000"
                        color="#000"
                        title={
                          <div className="flex items-center justify-center space-x-3">
                            <i className="fab fa-apple text-lg"></i>
                            <span>Continue with Apple</span>
                          </div>
                        }
                        onClick={() => handleSocialAuth('apple')}
                        disabled={isLoading}
                      />

                      <Buttons
                        type="button"
                        className="btn-outline w-full font-medium flex items-center justify-center"
                        themeColor="#000"
                        color="#000"
                        title={
                          <div className="flex items-center justify-center space-x-3">
                            <i className="far fa-envelope text-lg"></i>
                            <span>Continue with email</span>
                          </div>
                        }
                        onClick={handleContinueWithEmail}
                        disabled={isLoading}
                      />

                      <Buttons
                        type="button"
                        className="btn-outline w-full font-medium flex items-center justify-center"
                        themeColor="#000"
                        color="#000"
                        title={
                          <div className="flex items-center justify-center space-x-3">
                            <i className="fab fa-facebook text-lg"></i>
                            <span>Continue with Facebook</span>
                          </div>
                        }
                        onClick={() => handleSocialAuth('facebook')}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* FORM 2: Email Signup (like second image) */}
                {currentForm === 'email' && (
                  <div className="bg-white rounded-lg shadow-lg border p-8">
                    <div className="mb-6">
                      <button
                        onClick={() => setCurrentForm('welcome')}
                        className="flex items-center text-gray-600 hover:text-darkgray mb-4"
                      >
                        <i className="feather-arrow-left mr-2"></i>
                      </button>
                      <h3 className="heading-5 font-serif font-semibold text-darkgray">
                        Finish signing up
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`form-control w-full ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && (
                          <span className="text-sm text-red-500 block mt-1">{errors.email}</span>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <input
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`form-control w-full ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && (
                          <span className="text-sm text-red-500 block mt-1">{errors.password}</span>
                        )}
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="First name on ID"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`form-control w-full ${errors.firstName ? 'border-red-500' : ''}`}
                          />
                          {errors.firstName && (
                            <span className="text-sm text-red-500 block mt-1">{errors.firstName}</span>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Last name on ID"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`form-control w-full ${errors.lastName ? 'border-red-500' : ''}`}
                          />
                          {errors.lastName && (
                            <span className="text-sm text-red-500 block mt-1">{errors.lastName}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Make sure this matches the name on your government ID. If you go by another name, you can add a{' '}
                        <Link to="#" className="underline">preferred first name</Link>.
                      </p>

                      {/* Birth Date */}
                      <div>
                        <label className="form-label text-sm font-medium mb-2 block">Date of birth</label>
                        <input
                          type="date"
                          placeholder="Birthdate"
                          value={formData.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          className={`form-control w-full ${errors.birthDate ? 'border-red-500' : ''}`}
                        />
                        {errors.birthDate && (
                          <span className="text-sm text-red-500 block mt-1">{errors.birthDate}</span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          To sign up, you need to be at least 18. Your birthday won't be shared with other people who use Buckler.
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <label className="form-label text-sm font-medium mb-2 block">Contact info</label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="form-control w-full bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          We'll email you trip confirmations and receipts.
                        </p>
                      </div>

                      {/* Terms */}
                      <div className="text-xs text-gray-600 leading-relaxed">
                        By selecting <strong>Agree and continue</strong>, I agree to Buckler's{' '}
                        <Link to="/terms" className="underline">Terms of Service</Link>,{' '}
                        <Link to="/payments" className="underline">Payments Terms of Service</Link>, and{' '}
                        <Link to="/nondiscrimination" className="underline">Nondiscrimination Policy</Link>{' '}
                        and acknowledge the <Link to="/privacy" className="underline">Privacy Policy</Link>.
                      </div>

                      {/* Marketing preferences */}
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="marketing"
                          className="mt-1"
                          defaultChecked
                        />
                        <label htmlFor="marketing" className="text-xs text-gray-600">
                          Buckler will send you members-only deals, inspiration, marketing emails, and push notifications. 
                          You can opt out of receiving these at any time in your account settings or directly from the marketing notification.
                        </label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="noMarketing"
                          className="mt-1"
                        />
                        <label htmlFor="noMarketing" className="text-xs text-gray-600">
                          I don't want to receive marketing messages from Buckler.
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                      <Buttons
                        type="button"
                        className="btn-fancy btn-fill w-full font-medium"
                        themeColor="#e91e63"
                        color="#fff"
                        title={isLoading ? 'Creating account...' : 'Agree and continue'}
                        onClick={handleEmailSignup}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* FORM 3: Finish Signup (like third image) */}
                {currentForm === 'finish' && (
                  <div className="bg-white rounded-lg shadow-lg border p-8">
                    <div className="mb-6">
                      <button
                        onClick={() => setCurrentForm('welcome')}
                        className="flex items-center text-gray-600 hover:text-darkgray mb-4"
                      >
                        <i className="feather-x text-lg"></i>
                      </button>
                      <h3 className="heading-5 font-serif font-semibold text-darkgray">
                        Finish signing up
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Legal Name */}
                      <div>
                        <label className="form-label text-sm font-medium mb-2 block">Legal name</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              placeholder="First name on ID"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className={`form-control w-full ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.firstName && (
                              <span className="text-sm text-red-500 block mt-1">{errors.firstName}</span>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Last name on ID"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className={`form-control w-full ${errors.lastName ? 'border-red-500' : ''}`}
                            />
                            {errors.lastName && (
                              <span className="text-sm text-red-500 block mt-1">{errors.lastName}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Make sure this matches the name on your government ID. If you go by another name, you can add a{' '}
                          <Link to="#" className="underline">preferred first name</Link>.
                        </p>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="form-label text-sm font-medium mb-2 block">
                          Date of birth{' '}
                          <i className="feather-help-circle text-gray-400 cursor-help" title="Help information"></i>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            className="form-select"
                            value={formData.birthDate.split('-')[1] || ''}
                            onChange={(e) => {
                              const [year, , day] = formData.birthDate.split('-');
                              handleInputChange('birthDate', `${year || new Date().getFullYear()}-${e.target.value.padStart(2, '0')}-${day || '01'}`);
                            }}
                          >
                            <option value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </select>
                          <select
                            className="form-select"
                            value={formData.birthDate.split('-')[2] || ''}
                            onChange={(e) => {
                              const [year, month] = formData.birthDate.split('-');
                              handleInputChange('birthDate', `${year || new Date().getFullYear()}-${month || '01'}-${e.target.value.padStart(2, '0')}`);
                            }}
                          >
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                          <select
                            className="form-select"
                            value={formData.birthDate.split('-')[0] || ''}
                            onChange={(e) => {
                              const [, month, day] = formData.birthDate.split('-');
                              handleInputChange('birthDate', `${e.target.value}-${month || '01'}-${day || '01'}`);
                            }}
                          >
                            <option value="">Year</option>
                            {Array.from({ length: 80 }, (_, i) => {
                              const year = new Date().getFullYear() - 18 - i;
                              return <option key={year} value={year}>{year}</option>;
                            })}
                          </select>
                        </div>
                        {errors.birthDate && (
                          <span className="text-sm text-red-500 block mt-1">{errors.birthDate}</span>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div>
                        <label className="form-label text-sm font-medium mb-2 block">Contact info</label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="form-control w-full bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          We'll email you trip confirmations and receipts.
                        </p>
                        {authProvider === 'google' && (
                          <p className="text-xs text-gray-500 mt-1">
                            This info came from Google.
                          </p>
                        )}
                      </div>

                      {/* Terms */}
                      <div className="text-xs text-gray-600 leading-relaxed">
                        By selecting <strong>Agree and continue</strong>, I agree to Buckler's{' '}
                        <Link to="/terms" className="underline text-blue-600">Terms of Service</Link>,{' '}
                        <Link to="/payments" className="underline text-blue-600">Payments Terms of Service</Link>, and{' '}
                        <Link to="/nondiscrimination" className="underline text-blue-600">Nondiscrimination Policy</Link>{' '}
                        and acknowledge the <Link to="/privacy" className="underline text-blue-600">Privacy Policy</Link>.
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                      <Buttons
                        type="button"
                        className="btn-fancy btn-fill w-full font-medium"
                        themeColor="#e91e63"
                        color="#fff"
                        title={isLoading ? 'Creating account...' : 'Agree and continue'}
                        onClick={handleFinishSignup}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </m.div>
    </div>
  );
};

export default BnbAuth;