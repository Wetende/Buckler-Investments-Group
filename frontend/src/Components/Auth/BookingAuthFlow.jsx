import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input, Checkbox } from '../Form/Form';
import Buttons from '../Button/Buttons';
import { login, getCurrentUser, registerAndLogin } from '../../api/authService';
import { resetForm } from '../../Functions/Utilities';
import { useAuth } from '../../api/useAuth';

const BookingAuthFlow = ({ onSuccess = () => {} }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const { login: setAuthUser } = useAuth();

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email.").required("Email is required."),
    password: Yup.string().required("Password is required.")
  });

  const registerSchema = Yup.object().shape({
    username: Yup.string().required("Username is required."),
    email: Yup.string().email("Invalid email.").required("Email is required."),
    password: Yup.string().min(8, "Password must be at least 8 characters.").required("Password is required.")
  });

  const handleLogin = async (values, actions) => {
    try {
      await login({ username: values.email, password: values.password });
      const userData = await getCurrentUser();
      setAuthUser(userData);
      resetForm(actions);
      actions.setStatus('Login successful!');
      onSuccess();
    } catch (e) {
      actions.setStatus('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (values, actions) => {
    try {
      const result = await registerAndLogin({ 
        username: values.username, 
        email: values.email, 
        password: values.password 
      });
      
      // Update auth context with user data
      setAuthUser(result.user);
      
      resetForm(actions);
      actions.setStatus('Registration successful!');
      onSuccess();
    } catch (e) {
      actions.setStatus(e?.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Auth Mode Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            authMode === 'login'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            authMode === 'register'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Create Account
        </button>
      </div>

      {authMode === 'login' ? (
        // Login Form
        <div>
          <h3 className="heading-5 font-serif font-semibold text-center mb-6">
            Sign in to your account
          </h3>
          
          <Formik
            initialValues={{ email: '', password: '', remember: false }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, status }) => (
              <Form>
                {status && (
                  <div className={`mb-4 p-3 rounded-md text-sm ${
                    status.includes('successful') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {status}
                  </div>
                )}
                
                <div className="space-y-4">
                  <Input
                    type="email"
                    name="email"
                    labelClass="!mb-[5px] font-medium"
                    className="form-control"
                    label="Email address"
                    placeholder="Enter your email"
                  />
                  
                  <Input
                    type="password"
                    name="password"
                    labelClass="!mb-[5px] font-medium"
                    className="form-control"
                    label="Password"
                    placeholder="Enter your password"
                  />
                  
                  <div className="flex items-center">
                    <Checkbox
                      name="remember"
                      labelClass="text-sm text-gray-600"
                      label="Remember me"
                    />
                  </div>
                  
                  <Buttons
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full"
                    themeColor="#232323"
                    color="#fff"
                    title={isSubmitting ? "Signing in..." : "Sign In"}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        // Register Form
        <div>
          <h3 className="heading-5 font-serif font-semibold text-center mb-6">
            Create your account
          </h3>
          
          <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting, status }) => (
              <Form>
                {status && (
                  <div className={`mb-4 p-3 rounded-md text-sm ${
                    status.includes('successful') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {status}
                  </div>
                )}
                
                <div className="space-y-4">
                  <Input
                    type="text"
                    name="username"
                    labelClass="!mb-[5px] font-medium"
                    className="form-control"
                    label="Username"
                    placeholder="Choose a username"
                  />
                  
                  <Input
                    type="email"
                    name="email"
                    labelClass="!mb-[5px] font-medium"
                    className="form-control"
                    label="Email address"
                    placeholder="Enter your email"
                  />
                  
                  <Input
                    type="password"
                    name="password"
                    labelClass="!mb-[5px] font-medium"
                    className="form-control"
                    label="Password"
                    placeholder="Create a password (min 8 characters)"
                  />
                  
                  <Buttons
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full"
                    themeColor="#232323"
                    color="#fff"
                    title={isSubmitting ? "Creating account..." : "Create Account"}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default BookingAuthFlow;
