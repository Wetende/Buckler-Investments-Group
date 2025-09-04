import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// MVP Pages
const PropertiesList = React.lazy(() => import('./Pages/Properties/PropertiesList'));
const RentalsList = React.lazy(() => import('./Pages/Rentals/RentalsList'));
const ToursList = React.lazy(() => import('./Pages/Tours/ToursList'));
const CarsList = React.lazy(() => import('./Pages/Cars/CarsList'));

// Minimal composed homepage
const Home = lazy(() => import('./Pages/Home/Decor'))

// All MVP pages are now imported as components

function App() {
  return (
                <Routes>
      <Route path="/" element={<Suspense fallback={<div style={{padding: '50px'}}>Loading Home...</div>}><Home /></Suspense>} />
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
