import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import AuthRequiredWrapper from './AuthRequiredWrapper';
import Buttons from '../Button/Buttons';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-8">
          <div className="mb-8">
            <i className="fas fa-lock text-6xl text-gray-400 mb-4"></i>
            <h2 className="heading-4 font-serif text-darkgray mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-8">
              Please sign in to access this page. You'll be redirected here after logging in.
            </p>
          </div>
          
          <AuthRequiredWrapper
            modalTitle="Sign in to continue"
            modalSubtitle="You'll be redirected to your intended page after logging in"
            fallbackButton={
              <Buttons
                className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full"
                themeColor="#232323"
                color="#fff"
                size="lg"
                title="Sign In"
              />
            }
          >
            {/* This will never render since user is not authenticated */}
            <div></div>
          </AuthRequiredWrapper>
          
          <div className="mt-6">
            <a 
              href="/" 
              className="text-primary hover:underline text-sm"
            >
              ← Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute

