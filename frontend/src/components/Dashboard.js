import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ChartBarIcon,
  CloudArrowUpIcon,
  LightBulbIcon,
  FolderIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { apiService, formatCurrency, formatDate } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDatasets: 0,
    totalRecords: 0,
    avgCashFlow: 0,
    riskLevel: 'low',
  });

  // Fetch datasets
  const { data: datasets, isLoading: datasetsLoading } = useQuery(
    'datasets',
    apiService.listDatasets,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  useEffect(() => {
    if (datasets?.datasets) {
      const totalRecords = datasets.datasets.reduce((sum, dataset) => {
        return sum + (dataset.metadata?.processed_rows || 0);
      }, 0);

      setStats({
        totalDatasets: datasets.datasets.length,
        totalRecords,
        avgCashFlow: totalRecords > 0 ? 15000 : 0, // Placeholder
        riskLevel: totalRecords > 1000 ? 'medium' : 'low',
      });
    }
  }, [datasets]);

  const quickActions = [
    {
      title: 'Upload Data',
      description: 'Upload your cash flow data for analysis',
      icon: CloudArrowUpIcon,
      href: '/upload',
      color: 'bg-blue-500',
    },
    {
      title: 'Run Analysis',
      description: 'Perform comprehensive cash flow analysis',
      icon: ChartBarIcon,
      href: '/analysis',
      color: 'bg-green-500',
    },
    {
      title: 'View Insights',
      description: 'Get business insights and recommendations',
      icon: LightBulbIcon,
      href: '/insights',
      color: 'bg-purple-500',
    },
    {
      title: 'Manage Datasets',
      description: 'View and manage your uploaded datasets',
      icon: FolderIcon,
      href: '/datasets',
      color: 'bg-orange-500',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'upload',
      message: 'New dataset uploaded: Q4_2023_CashFlow.csv',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'success',
    },
    {
      id: 2,
      type: 'analysis',
      message: 'Analysis completed for dataset #3',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'success',
    },
    {
      id: 3,
      type: 'warning',
      message: 'High volatility detected in recent data',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'warning',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (datasetsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SageOrb
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Advanced liquidity optimization and cash flow analysis platform
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Datasets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDatasets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecords.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Cash Flow</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgCashFlow)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{stats.riskLevel}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.href}
                className="block bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className={`p-3 rounded-lg ${action.color} w-fit mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Advanced Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Machine Learning
            </h3>
            <p className="text-gray-600">
              Advanced ML models for accurate cash flow predictions and trend analysis
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <LightBulbIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Insights
            </h3>
            <p className="text-gray-600">
              AI-powered recommendations for optimal cash management strategies
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Risk Management
            </h3>
            <p className="text-gray-600">
              Comprehensive risk assessment and stress testing capabilities
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 