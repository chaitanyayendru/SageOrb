import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency, formatDate } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProjectionChart = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('cumulative_cash');

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No projection data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Net Cash Flow',
        data: data.map(item => item.net_cash_flow),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Cumulative Cash',
        data: data.map(item => item.cumulative_cash),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cash Flow Projections',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount ($)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Calculate summary statistics
  const summaryStats = {
    totalProjectedFlow: data.reduce((sum, item) => sum + item.net_cash_flow, 0),
    finalCumulative: data[data.length - 1]?.cumulative_cash || 0,
    maxCumulative: Math.max(...data.map(item => item.cumulative_cash)),
    minCumulative: Math.min(...data.map(item => item.cumulative_cash)),
    avgDailyFlow: data.reduce((sum, item) => sum + item.net_cash_flow, 0) / data.length,
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Display:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="cumulative_cash">Cumulative Cash</option>
            <option value="net_cash_flow">Net Cash Flow</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="text-sm text-gray-500">
          {data.length} days projected
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-medium">Total Projected Flow</p>
          <p className="text-lg font-semibold text-blue-900">
            {formatCurrency(summaryStats.totalProjectedFlow)}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-600 font-medium">Final Cumulative</p>
          <p className="text-lg font-semibold text-green-900">
            {formatCurrency(summaryStats.finalCumulative)}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-medium">Peak Cash</p>
          <p className="text-lg font-semibold text-purple-900">
            {formatCurrency(summaryStats.maxCumulative)}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-600 font-medium">Lowest Cash</p>
          <p className="text-lg font-semibold text-yellow-900">
            {formatCurrency(summaryStats.minCumulative)}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 font-medium">Daily Average</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(summaryStats.avgDailyFlow)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="h-96">
          <Line data={chartData} options={options} />
        </div>
      </motion.div>

      {/* Projection Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Projection Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Cash Flow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cumulative Cash
                </th>
                {data[0]?.confidence_lower && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence Range
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.net_cash_flow)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.cumulative_cash)}
                  </td>
                  {item.confidence_lower && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.confidence_lower)} - {formatCurrency(item.confidence_upper)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 10 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Showing first 10 projections of {data.length} total
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectionChart;
