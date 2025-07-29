import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { apiService, handleApiError, handleApiSuccess } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const DataUpload = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [description, setDescription] = useState('');

  // Upload mutation
  const uploadMutation = useMutation(apiService.uploadData, {
    onSuccess: (response) => {
      handleApiSuccess(response, 'Data uploaded successfully!');
      setUploadedData(response);
    },
    onError: (error) => {
      handleApiError(error, 'Failed to upload data');
    },
  });

  // Generate sample data mutation
  const sampleDataMutation = useMutation(apiService.generateSampleData, {
    onSuccess: (response) => {
      handleApiSuccess(response, 'Sample data generated successfully!');
      setUploadedData(response);
    },
    onError: (error) => {
      handleApiError(error, 'Failed to generate sample data');
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      uploadMutation.mutate({ file, description });
    }
  }, [description, uploadMutation]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    maxSize: 16 * 1024 * 1024, // 16MB
  });

  const generateSampleData = () => {
    sampleDataMutation.mutate({ days: 365 });
  };

  const getDropzoneContent = () => {
    if (isDragReject) {
      return (
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-600">Invalid file type</p>
          <p className="text-sm text-gray-500 mt-2">
            Please upload a CSV, XLS, or XLSX file
          </p>
        </div>
      );
    }

    if (isDragActive) {
      return (
        <div className="text-center">
          <CloudArrowUpIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-blue-600">Drop your file here</p>
          <p className="text-sm text-gray-500 mt-2">Release to upload</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900">
          Drag & drop your file here
        </p>
        <p className="text-sm text-gray-500 mt-2">
          or click to browse files
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Supports CSV, XLS, XLSX (max 16MB)
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Data
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your cash flow data to get started with advanced analysis and optimization
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Dataset Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for your dataset..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : isDragReject
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {getDropzoneContent()}
        </div>

        {/* Loading State */}
        {uploadMutation.isLoading && (
          <div className="text-center">
            <LoadingSpinner text="Uploading and processing data..." />
          </div>
        )}

        {/* Sample Data Button */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Don't have data? Try our sample data</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateSampleData}
            disabled={sampleDataMutation.isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sampleDataMutation.isLoading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Generate Sample Data
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Upload Results */}
      {uploadedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {uploadedData.success ? 'Upload Successful!' : 'Upload Completed'}
            </h3>
          </div>

          {uploadedData.metadata && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-600">File Type</p>
                <p className="text-lg text-gray-900">{uploadedData.metadata.file_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Records Processed</p>
                <p className="text-lg text-gray-900">
                  {uploadedData.metadata.processed_rows?.toLocaleString() || uploadedData.metadata.original_rows?.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {uploadedData.summary_stats && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Summary Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total Cash In</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${uploadedData.summary_stats.total_cash_in?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Cash Out</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${uploadedData.summary_stats.total_cash_out?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net Cash Flow</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${uploadedData.summary_stats.net_cash_flow?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Anomalies</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {uploadedData.summary_stats.anomalies_detected}
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadedData.quality_report && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Quality Report</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Total Records: {uploadedData.quality_report.total_records}</p>
                <p>• Date Range: {uploadedData.quality_report.date_range?.start} to {uploadedData.quality_report.date_range?.end}</p>
                <p>• Missing Values: {Object.values(uploadedData.quality_report.missing_values || {}).reduce((a, b) => a + b, 0)}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 rounded-lg p-6 border border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Format Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Required Columns</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <code className="bg-gray-100 px-1 rounded">date</code> - Date in YYYY-MM-DD format</li>
              <li>• <code className="bg-gray-100 px-1 rounded">cash_in</code> - Cash inflows (positive numbers)</li>
              <li>• <code className="bg-gray-100 px-1 rounded">cash_out</code> - Cash outflows (positive numbers)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Optional Columns</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <code className="bg-gray-100 px-1 rounded">category</code> - Transaction category</li>
              <li>• <code className="bg-gray-100 px-1 rounded">description</code> - Transaction description</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataUpload;
