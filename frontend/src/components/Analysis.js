import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'react-query';
import {
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { apiService, handleApiError, handleApiSuccess } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ProjectionChart from './ProjectionChart';
import OptimizationResult from './OptimizationResult';

const Analysis = () => {
  const [data, setData] = useState(null);
  const [analysisOptions, setAnalysisOptions] = useState({
    projectionMethod: 'ensemble',
    optimizationStrategy: 'comprehensive',
    riskLevel: 'moderate',
    horizon: 90,
  });
  const [analysisResults, setAnalysisResults] = useState(null);

  // Analysis mutation
  const analysisMutation = useMutation(apiService.analyzeData, {
    onSuccess: (response) => {
      handleApiSuccess(response, 'Analysis completed successfully!');
      setAnalysisResults(response.analysis);
    },
    onError: (error) => {
      handleApiError(error, 'Failed to perform analysis');
    },
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvData = e.target.result;
          const lines = csvData.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
              date: values[0],
              cash_in: parseFloat(values[1]) || 0,
              cash_out: parseFloat(values[2]) || 0,
            };
          }).filter(row => row.date && !isNaN(row.cash_in) && !isNaN(row.cash_out));
          
          setData(data);
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const runAnalysis = () => {
    if (!data || data.length === 0) {
      handleApiError(new Error('No data available for analysis'), 'Please upload data first');
      return;
    }

    analysisMutation.mutate({
      data,
      ...analysisOptions,
    });
  };

  const generateSampleData = () => {
    // Generate sample data for testing
    const sampleData = [];
    const startDate = new Date('2023-01-01');
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      sampleData.push({
        date: date.toISOString().split('T')[0],
        cash_in: Math.random() * 10000 + 5000,
        cash_out: Math.random() * 8000 + 4000,
      });
    }
    
    setData(sampleData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Cash Flow Analysis
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive analysis with projections, optimization, and risk assessment
        </p>
      </motion.div>

      {/* Data Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Input</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-500">or</span>
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateSampleData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Use Sample Data
            </motion.button>
          </div>

          {data && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <DocumentTextIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Data loaded: {data.length} records
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Analysis Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projection Method
            </label>
            <select
              value={analysisOptions.projectionMethod}
              onChange={(e) => setAnalysisOptions(prev => ({
                ...prev,
                projectionMethod: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="simple">Simple</option>
              <option value="advanced">Advanced</option>
              <option value="ensemble">Ensemble</option>
              <option value="ml">Machine Learning</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optimization Strategy
            </label>
            <select
              value={analysisOptions.optimizationStrategy}
              onChange={(e) => setAnalysisOptions(prev => ({
                ...prev,
                optimizationStrategy: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Level
            </label>
            <select
              value={analysisOptions.riskLevel}
              onChange={(e) => setAnalysisOptions(prev => ({
                ...prev,
                riskLevel: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecast Horizon (days)
            </label>
            <input
              type="number"
              value={analysisOptions.horizon}
              onChange={(e) => setAnalysisOptions(prev => ({
                ...prev,
                horizon: parseInt(e.target.value)
              }))}
              min="30"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAnalysis}
            disabled={!data || analysisMutation.isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analysisMutation.isLoading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <CogIcon className="w-5 h-5 mr-2" />
                Run Analysis
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Analysis Results */}
      {analysisResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Strategy</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {analysisResults.summary.strategy}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {analysisResults.summary.risk_level}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Projection Method</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {analysisResults.summary.method}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Horizon</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analysisResults.summary.projection_horizon} days
                </p>
              </div>
            </div>
          </div>

          {/* Projection Chart */}
          {analysisResults.projection && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cash Flow Projections</h2>
              <ProjectionChart data={analysisResults.projection.projections} />
            </div>
          )}

          {/* Optimization Results */}
          {analysisResults.optimization && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Optimization Results</h2>
              <OptimizationResult result={analysisResults.optimization} />
            </div>
          )}

          {/* Risk Metrics */}
          {analysisResults.optimization?.risk_metrics && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">Value at Risk (95%)</h3>
                  <p className="text-lg font-semibold text-red-900">
                    ${analysisResults.optimization.risk_metrics.var_95?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Max Drawdown</h3>
                  <p className="text-lg font-semibold text-yellow-900">
                    {(analysisResults.optimization.risk_metrics.max_drawdown * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Volatility</h3>
                  <p className="text-lg font-semibold text-blue-900">
                    ${analysisResults.optimization.risk_metrics.avg_volatility?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Analysis; 