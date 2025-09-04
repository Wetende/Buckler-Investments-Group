import React, { Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// MVP Pages
const PropertiesList = React.lazy(() => import('./Pages/Properties/PropertiesList'));
const RentalsList = React.lazy(() => import('./Pages/Rentals/RentalsList'));
const ToursList = React.lazy(() => import('./Pages/Tours/ToursList'));
const CarsList = React.lazy(() => import('./Pages/Cars/CarsList'));

// Simple test pages
const HomePage = () => (
  <div style={{ padding: '50px' }}>
    <h1>Homepage</h1>
    <p>Welcome to the Buckler Investments Group super platform!</p>
    <nav style={{ marginTop: '20px' }}>
      <Link to="/properties" style={{ marginRight: '20px' }}>Properties</Link>
      <Link to="/rentals" style={{ marginRight: '20px' }}>Rentals</Link>
      <Link to="/tours" style={{ marginRight: '20px' }}>Tours</Link>
      <Link to="/cars">Cars</Link>
    </nav>
  </div>
);

// All MVP pages are now imported as components

function App() {
  return (
                <Routes>
      <Route path="/" element={<HomePage />} />
                    <Route
        path="/properties" 
                      element={
          <Suspense fallback={<div style={{padding: '50px'}}>Loading Properties...</div>}>
            <PropertiesList />
          </Suspense>
        } 
      />
      <Route 
        path="/rentals" 
        element={
          <Suspense fallback={<div style={{padding: '50px'}}>Loading Rentals...</div>}>
            <RentalsList />
          </Suspense>
        } 
      />
      <Route 
        path="/tours" 
        element={
          <Suspense fallback={<div style={{padding: '50px'}}>Loading Tours...</div>}>
            <ToursList />
          </Suspense>
        } 
      />
      <Route 
        path="/cars" 
        element={
          <Suspense fallback={<div style={{padding: '50px'}}>Loading Cars...</div>}>
            <CarsList />
          </Suspense>
        } 
      />
                </Routes>
  );
}

export default App;
