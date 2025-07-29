import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'react-query';
import {
  LightBulbIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { apiService, handleApiError, handleApiSuccess, formatCurrency } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Insights = () => {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);

  // Insights mutation
  const insightsMutation = useMutation(apiService.generateInsights, {
    onSuccess: (response) => {
      handleApiSuccess(response, 'Insights generated successfully!');
      setInsights(response.insights);
    },
    onError: (error) => {
      handleApiError(error, 'Failed to generate insights');
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

  const generateInsights = () => {
    if (!data || data.length === 0) {
      handleApiError(new Error('No data available'), 'Please upload data first');
      return;
    }

    insightsMutation.mutate({ data });
  };

  const generateSampleData = () => {
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

  const getTrendIcon = (direction) => {
    return direction === 'increasing' ? (
      <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
    );
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
          Business Insights
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          AI-powered insights and recommendations for optimal cash flow management
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

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateInsights}
              disabled={!data || insightsMutation.isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {insightsMutation.isLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <LightBulbIcon className="w-5 h-5 mr-2" />
                  Generate Insights
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Insights Results */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Cash Flow Summary */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cash Flow Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Cash In</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(insights.cash_flow_summary.total_cash_in)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Cash Out</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(insights.cash_flow_summary.total_cash_out)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Net Cash Flow</p>
                <p className={`text-lg font-semibold ${
                  insights.cash_flow_summary.net_cash_flow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(insights.cash_flow_summary.net_cash_flow)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Daily Average</p>
                <p className={`text-lg font-semibold ${
                  insights.cash_flow_summary.avg_daily_cash_flow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(insights.cash_flow_summary.avg_daily_cash_flow)}
                </p>
              </div>
            </div>
          </div>

          {/* Trends Analysis */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trend Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                {getTrendIcon(insights.trends.trend_direction)}
                <div>
                  <p className="text-sm text-gray-600">Trend Direction</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {insights.trends.trend_direction}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Trend Strength</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(insights.trends.trend_strength * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Seasonality</p>
                <p className="text-lg font-semibold text-gray-900">
                  {insights.trends.seasonality_detected ? 'Detected' : 'Not Detected'}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-800 mb-2">Negative Cash Flow Days</h3>
                <p className="text-lg font-semibold text-red-900">
                  {insights.risk_indicators.negative_cash_flow_days}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Volatility Ratio</h3>
                <p className="text-lg font-semibold text-yellow-900">
                  {(insights.risk_indicators.cash_flow_volatility_ratio * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Max Drawdown</h3>
                <p className="text-lg font-semibold text-blue-900">
                  {(insights.risk_indicators.max_drawdown * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
            <div className="space-y-3">
              {insights.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <LightBulbIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Immediate Actions</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Review cash flow patterns</li>
                  <li>• Implement monitoring alerts</li>
                  <li>• Consider reserve adjustments</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Long-term Strategy</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Optimize cash management</li>
                  <li>• Diversify revenue streams</li>
                  <li>• Plan for contingencies</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Insights; 