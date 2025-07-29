import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency, formatPercentage } from '../services/api';

const OptimizationResult = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No optimization results available</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'risk', name: 'Risk Analysis', icon: ShieldCheckIcon },
    { id: 'investment', name: 'Investment', icon: ArrowTrendingUpIcon },
    { id: 'recommendations', name: 'Recommendations', icon: LightBulbIcon },
  ];

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'conservative':
        return 'text-green-600 bg-green-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'aggressive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'conservative':
        return <ShieldCheckIcon className="w-5 h-5 text-green-500" />;
      case 'moderate':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'aggressive':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ShieldCheckIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Optimization Results - {result.strategy?.charAt(0).toUpperCase() + result.strategy?.slice(1)} Strategy
          </h3>
          <p className="text-sm text-gray-600">
            Risk Level: {result.risk_level?.charAt(0).toUpperCase() + result.risk_level?.slice(1)}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(result.risk_level)}`}>
          {getRiskIcon(result.risk_level)}
          <span className="ml-1 capitalize">{result.risk_level}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.minimum_reserve && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Minimum Reserve</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(result.minimum_reserve)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.cash_flow_volatility && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Cash Flow Volatility</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {formatCurrency(result.cash_flow_volatility)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.safety_buffer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Safety Buffer</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(result.safety_buffer)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strategy Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Strategy Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Strategy Type</p>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {result.strategy}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Risk Level</p>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {result.risk_level}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'risk' && result.risk_metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Risk Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-red-800 mb-2">Value at Risk (95%)</h4>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(result.risk_metrics.var_95)}
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-orange-800 mb-2">Value at Risk (99%)</h4>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(result.risk_metrics.var_99)}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Max Drawdown</h4>
                <p className="text-2xl font-bold text-yellow-900">
                  {formatPercentage(result.risk_metrics.max_drawdown)}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Avg Volatility</h4>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(result.risk_metrics.avg_volatility)}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Volatility Trend</h4>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(result.risk_metrics.volatility_trend)}
                </p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Risk Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(result.risk_level)}`}>
                    {result.risk_level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Liquidity Risk</span>
                  <span className="text-sm font-medium text-gray-900">
                    {result.risk_metrics.max_drawdown < -0.2 ? 'High' : result.risk_metrics.max_drawdown < -0.1 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Volatility Risk</span>
                  <span className="text-sm font-medium text-gray-900">
                    {result.risk_metrics.avg_volatility > 10000 ? 'High' : result.risk_metrics.avg_volatility > 5000 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'investment' && result.investment_analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Investment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-green-800 mb-2">Total Surplus</h4>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(result.investment_analysis.total_surplus)}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Average Surplus</h4>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(result.investment_analysis.avg_surplus)}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Max Investment</h4>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(result.investment_analysis.max_investment)}
                </p>
              </div>
            </div>

            {/* Investment Strategies */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Strategies</h4>
              <div className="space-y-4">
                {Object.entries(result.investment_analysis.strategies).map(([key, strategy]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace('_', ' ')} Term
                      </h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        strategy.risk === 'low' ? 'bg-green-100 text-green-800' :
                        strategy.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {strategy.risk} risk
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-medium text-gray-900">{formatCurrency(strategy.amount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-medium text-gray-900">{strategy.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expected Return</p>
                        <p className="font-medium text-gray-900">{formatPercentage(strategy.expected_return)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recommendations' && result.recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Recommendations */}
            <div className="space-y-4">
              {result.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <LightBulbIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">{recommendation}</p>
                </motion.div>
              ))}
            </div>

            {/* Action Items */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Short Term (1-30 days)</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Review current cash flow patterns</li>
                    <li>• Implement monitoring alerts</li>
                    <li>• Adjust reserve levels if needed</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Long Term (30+ days)</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Optimize cash management processes</li>
                    <li>• Consider investment opportunities</li>
                    <li>• Plan for contingencies</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OptimizationResult;
