import React, { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import Router from "./route/Index"
import { adminQueryClient } from './services/queryClient'
import { handleAuthFragmentAndMaybeEnableHost } from './services/authSuccessHandler'

// Import toastify CSS
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  // Handle auth tokens from URL hash (when redirected from frontend)
  useEffect(() => {
    handleAuthFragmentAndMaybeEnableHost()
  }, [])

  return (
    <QueryClientProvider client={adminQueryClient}>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  );
};

export default App;