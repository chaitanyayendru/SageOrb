import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DataUpload from './components/DataUpload';
import Analysis from './components/Analysis';
import Insights from './components/Insights';
import Datasets from './components/Datasets';
import ProjectionChart from './components/ProjectionChart';
import OptimizationResult from './components/OptimizationResult';
import LoadingSpinner from './components/LoadingSpinner';

// Styles
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Navbar />
          
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<DataUpload />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/datasets" element={<Datasets />} />
            </Routes>
          </motion.main>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
