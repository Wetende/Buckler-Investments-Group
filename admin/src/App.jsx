import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import Router from "./route/Index"
import { adminQueryClient } from './services/queryClient'

// Import toastify CSS
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
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