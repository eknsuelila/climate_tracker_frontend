import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './service/auth.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a QueryClient instance with default options for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed requests once
      retryDelay: 1000, // Wait 1 second before retry
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
