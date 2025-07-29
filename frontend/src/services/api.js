import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading indicator
    if (config.showLoading !== false) {
      // You can add a global loading state here
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    
    // Show error toast
    if (error.config?.showError !== false) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Data upload
  uploadData: (file, description = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    
    return api.post('/upload-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Generate sample data
  generateSampleData: (days = 365) => {
    return api.post('/generate-sample-data', { days });
  },

  // Liquidity projection
  getLiquidityProjection: (data, method = 'ensemble', horizon = 90) => {
    return api.post('/liquidity-projection', {
      data,
      method,
      horizon,
    });
  },

  // Optimization
  optimizeCashFlow: (data, strategy = 'comprehensive', riskLevel = 'moderate') => {
    return api.post('/optimize', {
      data,
      strategy,
      risk_level: riskLevel,
    });
  },

  // Comprehensive analysis
  analyzeData: (data, options = {}) => {
    const {
      projectionMethod = 'ensemble',
      optimizationStrategy = 'comprehensive',
      riskLevel = 'moderate',
      horizon = 90,
    } = options;

    return api.post('/analyze', {
      data,
      projection_method: projectionMethod,
      optimization_strategy: optimizationStrategy,
      risk_level: riskLevel,
      horizon,
    });
  },

  // Generate insights
  generateInsights: (data) => {
    return api.post('/insights', { data });
  },

  // Dataset management
  listDatasets: () => api.get('/datasets'),
  
  getDataset: (datasetId) => api.get(`/datasets/${datasetId}`),
  
  exportDataset: (datasetId) => api.get(`/export/${datasetId}`, {
    responseType: 'blob',
  }),

  // Legacy endpoints for backward compatibility
  legacyUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  legacyProjection: (data) => {
    return api.post('/liquidity-projection', { data });
  },

  legacyOptimize: (data) => {
    return api.post('/optimize', { data });
  },
};

// Utility functions
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Error handling utilities
export const handleApiError = (error, customMessage = null) => {
  const message = customMessage || 
    error.response?.data?.error || 
    error.message || 
    'An unexpected error occurred';
  
  toast.error(message);
  console.error('API Error:', error);
  
  return {
    success: false,
    error: message,
  };
};

export const handleApiSuccess = (response, customMessage = null) => {
  const message = customMessage || 'Operation completed successfully';
  
  if (response.data?.success !== false) {
    toast.success(message);
  }
  
  return response.data;
};

export default api;
