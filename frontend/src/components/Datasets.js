import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  FolderIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { apiService, handleApiError, handleApiSuccess, formatDate, downloadFile } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Datasets = () => {
  const queryClient = useQueryClient();

  // Fetch datasets
  const { data: datasetsResponse, isLoading, error } = useQuery(
    'datasets',
    apiService.listDatasets,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  // Export mutation
  const exportMutation = useMutation(apiService.exportDataset, {
    onSuccess: (response, datasetId) => {
      const dataset = datasetsResponse?.datasets?.find(d => d.id === datasetId);
      const filename = dataset ? `${dataset.name}_export.csv` : `dataset_${datasetId}_export.csv`;
      downloadFile(response, filename);
      handleApiSuccess({}, 'Dataset exported successfully!');
    },
    onError: (error) => {
      handleApiError(error, 'Failed to export dataset');
    },
  });

  const handleExport = (datasetId) => {
    exportMutation.mutate(datasetId);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading datasets..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <DocumentTextIcon className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading datasets</h3>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const datasets = datasetsResponse?.datasets || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Dataset Management
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View and manage your uploaded cash flow datasets
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Datasets</p>
              <p className="text-2xl font-bold text-gray-900">{datasets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {datasets.reduce((sum, dataset) => sum + (dataset.metadata?.processed_rows || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Latest Upload</p>
              <p className="text-2xl font-bold text-gray-900">
                {datasets.length > 0 ? formatDate(datasets[0].created_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Datasets List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Datasets</h2>
        </div>

        {datasets.length === 0 ? (
          <div className="p-12 text-center">
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
            <p className="text-gray-600 mb-6">Upload your first dataset to get started with analysis.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/upload'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Upload Dataset
            </motion.button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {datasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{dataset.name}</h3>
                        {dataset.description && (
                          <p className="text-sm text-gray-600 mt-1">{dataset.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">File Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {dataset.metadata?.file_type?.toUpperCase() || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Records</p>
                        <p className="text-sm font-medium text-gray-900">
                          {dataset.metadata?.processed_rows?.toLocaleString() || dataset.metadata?.original_rows?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(dataset.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(dataset.updated_at)}
                        </p>
                      </div>
                    </div>

                    {dataset.metadata?.summary_stats && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Summary Statistics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Total Cash In</p>
                            <p className="text-sm font-semibold text-green-600">
                              ${dataset.metadata.summary_stats.total_cash_in?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Cash Out</p>
                            <p className="text-sm font-semibold text-red-600">
                              ${dataset.metadata.summary_stats.total_cash_out?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Net Cash Flow</p>
                            <p className="text-sm font-semibold text-gray-900">
                              ${dataset.metadata.summary_stats.net_cash_flow?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Anomalies</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {dataset.metadata.summary_stats.anomalies_detected}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleExport(dataset.id)}
                      disabled={exportMutation.isLoading}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      title="Export dataset"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      {datasets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/upload'}
              className="flex items-center justify-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200"
            >
              <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Upload New Dataset</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/analysis'}
              className="flex items-center justify-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors duration-200"
            >
              <DocumentTextIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Run Analysis</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/insights'}
              className="flex items-center justify-center px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors duration-200"
            >
              <DocumentTextIcon className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Generate Insights</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Datasets; 